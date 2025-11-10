-- Create addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  street_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Angola',
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add address_id column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'address_id'
  ) THEN
    ALTER TABLE users ADD COLUMN address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add bio column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Create RLS policies for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own addresses
CREATE POLICY select_own_addresses ON addresses
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own addresses
CREATE POLICY insert_own_addresses ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own addresses
CREATE POLICY update_own_addresses ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own addresses
CREATE POLICY delete_own_addresses ON addresses
  FOR DELETE USING (auth.uid() = user_id);
