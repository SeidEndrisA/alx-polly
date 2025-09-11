-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Function to create a new profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Allow users to update their own profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to get user polls
CREATE OR REPLACE FUNCTION get_user_polls(user_id_arg UUID)
RETURNS TABLE (
  id UUID,
  question TEXT,
  created_at TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  total_votes BIGINT
) AS $
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.question,
    p.created_at,
    p.closing_date,
    (SELECT COUNT(*) FROM user_votes uv WHERE uv.poll_id = p.id) as total_votes
  FROM
    polls p
  WHERE
    p.created_by = user_id_arg
  ORDER BY
    p.created_at DESC;
END;
$ LANGUAGE plpgsql;
