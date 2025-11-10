-- Criar tabela addresses se não existir
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  street_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Angola',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios endereços
CREATE POLICY IF NOT EXISTS "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem seus próprios endereços
CREATE POLICY IF NOT EXISTS "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios endereços
CREATE POLICY IF NOT EXISTS "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios endereços
CREATE POLICY IF NOT EXISTS "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_city ON addresses(city);
CREATE INDEX IF NOT EXISTS idx_addresses_state ON addresses(state);

-- Comentários para documentação
COMMENT ON TABLE addresses IS 'Endereços dos usuários';
COMMENT ON COLUMN addresses.user_id IS 'ID do usuário proprietário do endereço';
COMMENT ON COLUMN addresses.street_address IS 'Endereço completo da rua';
COMMENT ON COLUMN addresses.city IS 'Cidade';
COMMENT ON COLUMN addresses.state IS 'Província/Estado';
COMMENT ON COLUMN addresses.postal_code IS 'Código postal';
COMMENT ON COLUMN addresses.country IS 'País (padrão: Angola)';
COMMENT ON COLUMN addresses.latitude IS 'Latitude para geolocalização';
COMMENT ON COLUMN addresses.longitude IS 'Longitude para geolocalização';
