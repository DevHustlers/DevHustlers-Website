-- Create custom types
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

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role public.user_role DEFAULT 'user'::public.user_role,
  status public.user_status DEFAULT 'active'::public.user_status,
  points INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  points INTEGER DEFAULT 0,
  difficulty public.challenge_difficulty DEFAULT 'Easy'::public.challenge_difficulty,
  status TEXT,
  requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prize TEXT,
  status TEXT,
  time_per_question INTEGER,
  scheduled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Junction table for user badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RBAC Helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users can update their own bio" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for Tracks
CREATE POLICY "Public tracks are viewable by everyone" ON public.tracks
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tracks" ON public.tracks
  FOR ALL USING (public.is_admin());

-- Policies for Challenges
CREATE POLICY "Public challenges are viewable by everyone" ON public.challenges
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenges" ON public.challenges
  FOR ALL USING (public.is_admin());

-- Policies for Competitions
CREATE POLICY "Public competitions are viewable by everyone" ON public.competitions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage competitions" ON public.competitions
  FOR ALL USING (public.is_admin());

-- Policies for Events
CREATE POLICY "Public events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin());

-- Policies for Badges
CREATE POLICY "Public badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL USING (public.is_admin());

-- Policies for User Badges
CREATE POLICY "Public user badges are viewable by everyone" ON public.user_badges
  FOR SELECT USING (true);

-- Points log table
CREATE TABLE IF NOT EXISTS public.points_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for points_log
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can see all point logs" ON public.points_log FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can see own point logs" ON public.points_log FOR SELECT USING (auth.uid() = user_id);

-- Functions
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

-- Badge eligibility trigger
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

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
    'user', 
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
