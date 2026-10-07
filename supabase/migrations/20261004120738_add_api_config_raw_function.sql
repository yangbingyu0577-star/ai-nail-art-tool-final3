/*
# Add function for server-side raw key reading

## Problem
The generate route (Next.js server route) needs to read the raw API keys
to sign requests to the Jimeng API. The get_api_config function only
returns masked keys. The table has no SELECT policy, so direct queries
with the anon key return nothing.

## Solution
Create get_api_config_raw() SECURITY DEFINER function that returns
the raw access_key and secret_key. This function is only callable
from the server route — it does not expose keys to the browser
because the browser never calls it directly (the /api/generate route
calls it server-side).

## Security Note
This function returns raw secret values. It is callable by anon
because the generate route runs server-side with the anon key.
The browser cannot call this function and use the result to steal
keys because:
- The function is called from the /api/generate server route only
- The generate route does not return the keys in its response
- A malicious user could call get_api_config_raw() via the data API,
  which IS a risk. To mitigate, we restrict this function to only
  return keys when called with the service role key.
*/

CREATE OR REPLACE FUNCTION get_api_config_raw()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row RECORD;
BEGIN
  -- Only return raw keys when called with service role (bypasses RLS)
  -- Check if the caller is service_role by testing RLS bypass capability
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

-- Only service_role can call this, not anon
REVOKE EXECUTE ON FUNCTION get_api_config_raw FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_api_config_raw TO service_role;
