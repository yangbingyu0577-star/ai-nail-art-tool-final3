/*
# Add SECURITY DEFINER functions for api_config read/write

## Problem
The previous lockdown removed all policies from api_config, leaving it
accessible only via the service role key. But SUPABASE_SERVICE_ROLE_KEY
is not available in this environment, so the /api/config server route
fails and users cannot save or read API keys.

## Solution
Create two SECURITY DEFINER functions that run as the table owner
(bypassing RLS) but carefully control what is returned:

1. `get_api_config()` — returns only masked keys + configured status.
   The raw secret values are NEVER returned to the caller.

2. `save_api_config(p_access_key, p_secret_key)` — upserts the config
   row. Returns success/failure only, never the keys.

Both functions are callable by anon (no auth in this app), but:
- Reading exposes only masked keys, not raw secrets
- Writing overwrites keys but cannot read them back
- This means a malicious caller can at worst overwrite the keys
  (annoyance), but can NEVER steal the actual secret values

## Security
- Functions are SECURITY DEFINER with SET search_path = public
- get_api_config returns masked values only
- save_api_config does not return key values
- EXECUTE granted to anon, authenticated (no-auth single-tenant app)
*/

CREATE OR REPLACE FUNCTION get_api_config()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_access_masked text;
  v_secret_masked text;
BEGIN
  SELECT id, access_key, secret_key INTO v_row
  FROM api_config
  ORDER BY updated_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('configured', false, 'configId', null);
  END IF;

  IF v_row.access_key IS NOT NULL AND length(v_row.access_key) > 8 THEN
    v_access_masked := left(v_row.access_key, 4) || '••••••••' || right(v_row.access_key, 4);
  ELSIF v_row.access_key IS NOT NULL THEN
    v_access_masked := '••••';
  ELSE
    v_access_masked := '';
  END IF;

  IF v_row.secret_key IS NOT NULL AND length(v_row.secret_key) > 8 THEN
    v_secret_masked := left(v_row.secret_key, 4) || '••••••••' || right(v_row.secret_key, 4);
  ELSIF v_row.secret_key IS NOT NULL THEN
    v_secret_masked := '••••';
  ELSE
    v_secret_masked := '';
  END IF;

  RETURN json_build_object(
    'configured', (v_row.access_key IS NOT NULL AND v_row.secret_key IS NOT NULL),
    'configId', v_row.id,
    'accessKeyMasked', v_access_masked,
    'secretKeyMasked', v_secret_masked
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION get_api_config FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_api_config TO anon, authenticated;

CREATE OR REPLACE FUNCTION save_api_config(p_access_key text, p_secret_key text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_existing_id uuid;
BEGIN
  IF p_access_key IS NULL OR p_secret_key IS NULL THEN
    RAISE EXCEPTION '密钥不能为空';
  END IF;

  IF length(p_access_key) < 4 OR length(p_secret_key) < 4 THEN
    RAISE EXCEPTION '密钥长度不正确';
  END IF;

  SELECT id INTO v_existing_id FROM api_config ORDER BY updated_at DESC LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    UPDATE api_config
    SET access_key = p_access_key, secret_key = p_secret_key, updated_at = now()
    WHERE id = v_existing_id;
  ELSE
    INSERT INTO api_config (access_key, secret_key) VALUES (p_access_key, p_secret_key);
  END IF;

  RETURN json_build_object('success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION save_api_config FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_api_config TO anon, authenticated;
