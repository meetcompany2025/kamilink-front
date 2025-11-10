-- Create transporters table
CREATE TABLE IF NOT EXISTS transporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('bi', 'nif', 'passaporte')),
  document_number VARCHAR(50) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  trailer_type VARCHAR(50),
  license_plate VARCHAR(20) NOT NULL,
  load_capacity INTEGER NOT NULL CHECK (load_capacity >= 500),
  base_province VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'active', 'suspended', 'inactive')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(license_plate),
  UNIQUE(document_number)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_transporters_user_id ON transporters(user_id);
CREATE INDEX IF NOT EXISTS idx_transporters_base_province ON transporters(base_province);
CREATE INDEX IF NOT EXISTS idx_transporters_status ON transporters(status);

-- Enable RLS
ALTER TABLE transporters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Transporters can view own profile" ON transporters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Transporters can update own profile" ON transporters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert transporter profile" ON transporters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_transporters_updated_at 
  BEFORE UPDATE ON transporters 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
