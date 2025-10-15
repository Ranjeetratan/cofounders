-- Temporarily disable RLS for profiles table to allow insertions
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a more permissive policy
-- DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
-- CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);