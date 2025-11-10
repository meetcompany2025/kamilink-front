-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_id UUID;

-- Add foreign key constraint for address_id if addresses table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'addresses') THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_address 
        FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Constraint already exists, ignore
        NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_address_id ON users(address_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- Update any existing users to have default values
UPDATE users SET 
    bio = COALESCE(bio, ''),
    company_name = COALESCE(company_name, ''),
    tax_id = COALESCE(tax_id, '')
WHERE bio IS NULL OR company_name IS NULL OR tax_id IS NULL;

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
