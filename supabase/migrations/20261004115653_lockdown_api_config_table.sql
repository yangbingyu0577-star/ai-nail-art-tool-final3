/*
# Lock down api_config table — remove public read access

## Problem
The api_config table stores Jimeng API keys (access_key, secret_key).
The previous migration granted TO anon, authenticated SELECT (true),
meaning anyone with the public anon key could read full secret values
directly from the database. This is a credential exposure vulnerability.

## Changes
1. Drop all existing policies on api_config
2. Re-create with NO public access — only service role can read/write
   (service role bypasses RLS, so no policies needed for it)
3. Revoke all table privileges from anon and authenticated roles

## Security
- RLS remains enabled
- No policies = no access via anon or authenticated keys
- Only the service role (used server-side) can access the data
- Frontend reads/writes go through the /api/config server route
  which uses the service role key internally
*/

DROP POLICY IF EXISTS "anon_select_api_config" ON api_config;
DROP POLICY IF EXISTS "anon_insert_api_config" ON api_config;
DROP POLICY IF EXISTS "anon_update_api_config" ON api_config;
DROP POLICY IF EXISTS "anon_delete_api_config" ON api_config;

REVOKE ALL ON api_config FROM anon;
REVOKE ALL ON api_config FROM authenticated;
