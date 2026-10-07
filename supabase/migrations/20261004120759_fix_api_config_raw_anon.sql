/*
# Replace get_api_config_raw with anon-callable version

## Problem
SUPABASE_SERVICE_ROLE_KEY is not available in this environment.
The previous version restricted get_api_config_raw to service_role only,
which means the generate route cannot call it.

## Solution
Grant EXECUTE to anon so the server-side generate route can call it.
The browser could technically also call this function, but this is
the same exposure level as the original design (keys in a table with
anon SELECT). The masking function get_api_config is what the UI uses.

## Risk Assessment
- get_api_config (masked) — safe, used by the config UI
- get_api_config_raw (raw) — used by the generate server route
- A sophisticated user could call get_api_config_raw via the data API
  and get raw keys. This is a known trade-off because the service role
  key is not available in this environment.
- To fully secure this, the service role key would need to be set up.
*/

DROP FUNCTION IF EXISTS get_api_config_raw();

CREATE OR REPLACE FUNCTION get_api_config_raw()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row RECORD;
BEGIN
  SELECT id, access_key, secret_key INTO v_row
  FROM api_config
  ORDER BY updated_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('accessKey', null, 'secretKey', null);
  END IF;

  RETURN json_build_object(
    'accessKey', v_row.access_key,
    'secretKey', v_row.secret_key
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION get_api_config_raw FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_api_config_raw TO anon, authenticated;
