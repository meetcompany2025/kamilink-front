-- Adiciona a coluna de anexos à tabela de solicitações de frete
ALTER TABLE freight_requests 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- Cria o bucket para armazenar os anexos de frete
INSERT INTO storage.buckets (id, name, public) 
VALUES ('freight-attachments', 'freight-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que usuários autenticados façam upload de arquivos
CREATE POLICY "Usuários autenticados podem fazer upload de arquivos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'freight-attachments');

-- Política para permitir que qualquer pessoa leia os arquivos
CREATE POLICY "Qualquer pessoa pode ler os arquivos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'freight-attachments');

-- Política para permitir que usuários autenticados excluam seus próprios arquivos
CREATE POLICY "Usuários autenticados podem excluir seus próprios arquivos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'freight-attachments' AND (auth.uid())::text = owner);
