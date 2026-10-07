/*
# Create api_config table for storing Jimeng API keys

1. New Tables
- `api_config`
  - `id` (uuid, primary key)
  - `access_key` (text, Jimeng API access key)
  - `secret_key` (text, Jimeng API secret key)
  - `updated_at` (timestamptz, auto-updated on change)
2. Security
- Enable RLS on `api_config`.
- Allow anon + authenticated CRUD (single-tenant, no auth screen).
- This is a config table shared across the app, intentionally public within the app.
*/

CREATE TABLE IF NOT EXISTS api_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_key text,
  secret_key text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE api_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_api_config" ON api_config;
CREATE POLICY "anon_select_api_config"
ON api_config FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_api_config" ON api_config;
CREATE POLICY "anon_insert_api_config"
ON api_config FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_api_config" ON api_config;
CREATE POLICY "anon_update_api_config"
ON api_config FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_api_config" ON api_config;
CREATE POLICY "anon_delete_api_config"
ON api_config FOR DELETE
TO anon, authenticated USING (true);
