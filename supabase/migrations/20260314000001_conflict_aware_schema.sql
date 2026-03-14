-- Conflict-Aware Migration for DevHustlers Dashboard

-- 1. Create custom types if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mod', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE public.user_status AS ENUM ('active', 'inactive');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_difficulty') THEN
        CREATE TYPE public.challenge_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
    END IF;
END $$;

-- 2. Update existing 'profiles' table to match new requirements
-- The existing table has: id, name, email, username, is_admin, updated_at
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'user'::public.user_role,
  ADD COLUMN IF NOT EXISTS status public.user_status DEFAULT 'active'::public.user_status,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Migrate data from is_admin to role if necessary
UPDATE public.profiles SET role = 'admin' WHERE is_admin = true AND role = 'user';

-- 3. Create or Update 'tracks' table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Update existing 'challenges' table
-- Existing has: id, title, description, difficulty (text), track (text), points, is_deleted, created_at, updated_at
-- We want to link it to the tracks table via track_id
ALTER TABLE public.challenges 
  ADD COLUMN IF NOT EXISTS track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS requirements TEXT;

-- 5. Update 'competitions' table
-- Existing has: id, title, description, start_date, end_date, prize_pool, created_by, created_at, updated_at
ALTER TABLE public.competitions 
  ADD COLUMN IF NOT EXISTS prize TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS time_per_question INTEGER,
  ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ;

-- 6. Create new supporting tables
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  time TEXT,
  date DATE,
  capacity INTEGER,
  type TEXT,
  event_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  icon_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.points_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;

-- RBAC Helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies (using IF NOT EXISTS logic via dropping if they exist to be clean)
DO $$ 
BEGIN
    -- Profiles
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
    CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
    
    DROP POLICY IF EXISTS "Users can update their own bio" ON public.profiles;
    CREATE POLICY "Users can update their own bio" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    -- Manage access for other tables (Admins only for mutations)
    -- Tracks
    DROP POLICY IF EXISTS "Public tracks viewable" ON public.tracks;
    CREATE POLICY "Public tracks viewable" ON public.tracks FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admins manage tracks" ON public.tracks;
    CREATE POLICY "Admins manage tracks" ON public.tracks FOR ALL USING (public.is_admin());

    -- Challenges
    DROP POLICY IF EXISTS "Public challenges viewable" ON public.challenges;
    CREATE POLICY "Public challenges viewable" ON public.challenges FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admins manage challenges" ON public.challenges;
    CREATE POLICY "Admins manage challenges" ON public.challenges FOR ALL USING (public.is_admin());
END $$;

-- 8. Functions & Triggers
CREATE OR REPLACE FUNCTION public.award_points(user_id UUID, amount INTEGER, reason TEXT DEFAULT '')
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET points = points + amount
  WHERE id = user_id;

  INSERT INTO public.points_log (user_id, amount, reason)
  VALUES (user_id, amount, reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_badge_eligibility()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT NEW.id, b.id
  FROM public.badges b
  WHERE NEW.points >= b.min_points
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_points_update ON public.profiles;
CREATE TRIGGER on_points_update
AFTER UPDATE OF points ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.check_badge_eligibility();
