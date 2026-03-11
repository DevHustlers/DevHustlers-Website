-- Run this query in your Supabase project's SQL Editor to set a user as an admin.
-- This sets the 'role' attribute within user_metadata to 'admin'.
-- You can use the same technique for assigning the 'user' role by changing '"admin"' to '"user"'.

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'o.ahmed3688@gmail.com';
