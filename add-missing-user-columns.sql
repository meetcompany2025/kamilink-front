-- Adicionar colunas em falta na tabela users baseado nos perfis dos usuários

-- Colunas para informações pessoais
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id),
ADD COLUMN IF NOT EXISTS provincia VARCHAR(100),
ADD COLUMN IF NOT EXISTS document_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS document_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Colunas para configurações do usuário
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'pt',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Africa/Luanda',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_public": false, "show_phone": false}';

-- Colunas para dados de negócio
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS operating_regions TEXT[],
ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Colunas para estatísticas e métricas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_provincia ON users(provincia);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Atualizar políticas RLS para as novas colunas
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Comentários para documentação
COMMENT ON COLUMN users.bio IS 'Biografia do usuário';
COMMENT ON COLUMN users.avatar_url IS 'URL da foto de perfil';
COMMENT ON COLUMN users.company_name IS 'Nome da empresa (para usuários empresariais)';
COMMENT ON COLUMN users.tax_id IS 'NIF ou número de identificação fiscal';
COMMENT ON COLUMN users.address_id IS 'Referência para o endereço principal';
COMMENT ON COLUMN users.provincia IS 'Província de Angola onde o usuário está localizado';
COMMENT ON COLUMN users.document_type IS 'Tipo de documento (BI, NIF, Passaporte)';
COMMENT ON COLUMN users.document_number IS 'Número do documento de identificação';
COMMENT ON COLUMN users.is_verified IS 'Se o usuário foi verificado pela equipe';
COMMENT ON COLUMN users.verification_status IS 'Status da verificação (pending, verified, rejected)';
COMMENT ON COLUMN users.profile_completed IS 'Se o perfil foi completamente preenchido';
COMMENT ON COLUMN users.notification_preferences IS 'Preferências de notificação em JSON';
COMMENT ON COLUMN users.privacy_settings IS 'Configurações de privacidade em JSON';
COMMENT ON COLUMN users.operating_regions IS 'Regiões onde o transportador opera';
COMMENT ON COLUMN users.rating IS 'Avaliação média do usuário (0.00 a 5.00)';
COMMENT ON COLUMN users.account_status IS 'Status da conta (active, suspended, banned)';

-- Mostrar estrutura final da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
