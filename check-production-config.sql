-- Verificar configuração de autenticação
SELECT 
  'auth.users' as table_name,
  COUNT(*) as total_users
FROM auth.users;

-- Verificar se a tabela users existe e tem dados
SELECT 
  'public.users' as table_name,
  COUNT(*) as total_profiles
FROM users;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'freights', 'addresses');

-- Verificar configuração de URL do site
SELECT 
  name,
  value
FROM auth.config
WHERE name IN ('site_url', 'uri_allow_list');
