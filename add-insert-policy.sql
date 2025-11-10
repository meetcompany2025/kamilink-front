-- Adicionar política RLS para permitir que usuários autenticados insiram seus próprios registros
CREATE POLICY "Usuários podem inserir seus próprios dados" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
