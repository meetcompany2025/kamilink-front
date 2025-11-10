-- Verificar se a tabela users existe e criar se não existir
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'transporter')),
  company_name TEXT,
  tax_id TEXT,
  bio TEXT,
  address_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verificar se a tabela addresses existe e criar se não existir
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verificar se a tabela notifications existe e criar se não existir
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verificar se a coluna is_read existe na tabela notifications e adicionar se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Verificar se a coluna read existe na tabela notifications e migrar dados para is_read se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'read'
  ) THEN
    -- Migrar dados de 'read' para 'is_read'
    UPDATE notifications SET is_read = "read" WHERE is_read IS NULL;
    
    -- Remover a coluna 'read'
    ALTER TABLE notifications DROP COLUMN "read";
  END IF;
END $$;

-- Verificar se a coluna bio existe na tabela users e adicionar se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Verificar se a coluna address_id existe na tabela users e adicionar se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'address_id'
  ) THEN
    ALTER TABLE users ADD COLUMN address_id UUID;
  END IF;
END $$;

-- Adicionar políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON users;
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
  FOR SELECT USING (auth.uid() = id);
  
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON users;
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON users;
CREATE POLICY "Usuários podem inserir seus próprios dados" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para endereços
DROP POLICY IF EXISTS "Usuários podem ver seus próprios endereços" ON addresses;
CREATE POLICY "Usuários podem ver seus próprios endereços" ON addresses
  FOR SELECT USING (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios endereços" ON addresses;
CREATE POLICY "Usuários podem gerenciar seus próprios endereços" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para notificações
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON notifications;
CREATE POLICY "Usuários podem ver suas próprias notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Usuários podem marcar suas notificações como lidas" ON notifications;
CREATE POLICY "Usuários podem marcar suas notificações como lidas" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
