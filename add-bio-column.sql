-- Add bio column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Also add any other potentially missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id);

-- Update the updated_at column to have a default value if needed
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_address_id ON users(address_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
