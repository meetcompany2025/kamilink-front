-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  );
END;
$$;

-- Function to get basic database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'users_count', (SELECT COUNT(*) FROM users),
    'freight_requests_count', (SELECT COUNT(*) FROM freight_requests),
    'freight_offers_count', (SELECT COUNT(*) FROM freight_offers),
    'last_freight_request', (SELECT MAX(created_at) FROM freight_requests),
    'last_user_registration', (SELECT MAX(created_at) FROM users)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to validate user data integrity
CREATE OR REPLACE FUNCTION validate_user_data(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  user_exists boolean;
  freight_count integer;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM users WHERE id = user_id) INTO user_exists;
  
  -- Count freight requests
  SELECT COUNT(*) FROM freight_requests WHERE client_id = user_id INTO freight_count;
  
  SELECT json_build_object(
    'user_exists', user_exists,
    'freight_requests_count', freight_count,
    'user_data', (SELECT row_to_json(users.*) FROM users WHERE id = user_id)
  ) INTO result;
  
  RETURN result;
END;
$$;
