-- Criar tabela de usuários (complementar à tabela auth.users do Supabase)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'transporter')),
  company_name TEXT,
  tax_id TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  vehicle_type TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT NOT NULL,
  capacity NUMERIC,
  capacity_unit TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de fretes
CREATE TABLE IF NOT EXISTS freights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id),
  transporter_id UUID REFERENCES users(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  cargo_type TEXT NOT NULL,
  weight NUMERIC,
  volume NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  price NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de propostas
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freight_id UUID NOT NULL REFERENCES freights(id),
  transporter_id UUID NOT NULL REFERENCES users(id),
  price NUMERIC NOT NULL,
  delivery_estimate TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freight_id UUID NOT NULL REFERENCES freights(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewed_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de atualizações de status
CREATE TABLE IF NOT EXISTS status_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freight_id UUID NOT NULL REFERENCES freights(id),
  status TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de notificações
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

-- Criar políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freights ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para veículos
CREATE POLICY "Transportadores podem ver seus próprios veículos" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Transportadores podem gerenciar seus próprios veículos" ON vehicles
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para fretes
CREATE POLICY "Clientes podem ver seus próprios fretes" ON freights
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Transportadores podem ver fretes disponíveis" ON freights
  FOR SELECT USING (status = 'pending');
  
CREATE POLICY "Transportadores podem ver fretes atribuídos a eles" ON freights
  FOR SELECT USING (auth.uid() = transporter_id);
  
CREATE POLICY "Clientes podem gerenciar seus próprios fretes" ON freights
  FOR ALL USING (auth.uid() = client_id);

-- Políticas para propostas
CREATE POLICY "Transportadores podem ver suas próprias propostas" ON proposals
  FOR SELECT USING (auth.uid() = transporter_id);
  
CREATE POLICY "Clientes podem ver propostas para seus fretes" ON proposals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM freights WHERE id = freight_id
    )
  );
  
CREATE POLICY "Transportadores podem criar propostas" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = transporter_id);
  
CREATE POLICY "Transportadores podem atualizar suas propostas" ON proposals
  FOR UPDATE USING (auth.uid() = transporter_id AND status = 'pending');

-- Políticas para avaliações
CREATE POLICY "Todos podem ver avaliações" ON reviews
  FOR SELECT USING (true);
  
CREATE POLICY "Usuários podem criar avaliações para fretes concluídos" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    auth.uid() IN (
      SELECT client_id FROM freights WHERE id = freight_id AND status = 'delivered'
      UNION
      SELECT transporter_id FROM freights WHERE id = freight_id AND status = 'delivered'
    )
  );

-- Políticas para atualizações de status
CREATE POLICY "Todos podem ver atualizações de status" ON status_updates
  FOR SELECT USING (true);
  
CREATE POLICY "Transportadores podem criar atualizações de status para seus fretes" ON status_updates
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT transporter_id FROM freights WHERE id = freight_id
    )
  );

-- Políticas para notificações
CREATE POLICY "Usuários podem ver suas próprias notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Usuários podem marcar suas notificações como lidas" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
