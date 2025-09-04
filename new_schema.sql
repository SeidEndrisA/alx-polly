-- Create the polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  closing_date TIMESTAMPTZ
);

-- Create the poll_options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  votes INTEGER DEFAULT 0
);

-- Create the user_votes table to prevent multiple votes
CREATE TABLE user_votes (
  user_id UUID REFERENCES auth.users(id),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, poll_id)
);

-- Create the comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security for the tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for polls
CREATE POLICY "Allow all to read polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create polls" ON polls FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for poll_options
CREATE POLICY "Allow all to read poll options" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create poll options" ON poll_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for user_votes
CREATE POLICY "Allow all to read user_votes" ON user_votes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create their own votes" ON user_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for comments
CREATE POLICY "Allow all to read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote(option_id_arg UUID, poll_id_arg UUID, user_id_arg UUID)
RETURNS void AS $$
BEGIN
  -- Check if the user has already voted
  IF EXISTS (SELECT 1 FROM user_votes WHERE user_id = user_id_arg AND poll_id = poll_id_arg) THEN
    RAISE EXCEPTION 'User has already voted on this poll';
  END IF;

  -- Increment the vote count
  UPDATE poll_options
  SET votes = votes + 1
  WHERE id = option_id_arg;

  -- Record the user's vote
  INSERT INTO user_votes (user_id, poll_id, option_id)
  VALUES (user_id_arg, poll_id_arg, option_id_arg);
END;
$$ LANGUAGE plpgsql;
