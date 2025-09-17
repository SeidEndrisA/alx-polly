CREATE TYPE user_role AS ENUM ('admin', 'user');

ALTER TABLE profiles
ADD COLUMN role user_role DEFAULT 'user';
