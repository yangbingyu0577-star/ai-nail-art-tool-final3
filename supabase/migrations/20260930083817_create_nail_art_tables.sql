/*
# Create tables for AI Nail Art Design Tool

1. New Tables
- `designs` — saves user-generated nail art designs (source images, palette, pattern config, construction list snapshot)
- `material_library` — preset 素材 (reference) images users can pick from in the left panel, categorized
- `nail_materials` — catalog of nail art materials with brand, cost (CNY), and purchase channel
- `nail_techniques` — catalog of nail art techniques with difficulty and description
- `salon_price_tiers` — price ranges for different salon tiers (budget, mid-range, high-end)

2. Security
- This is a single-tenant app with no sign-in screen.
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Design',
  source_image_url text,
  source_image_data text,
  palette jsonb NOT NULL DEFAULT '[]'::jsonb,
  nail_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  instruction text,
  construction_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_designs" ON designs;
CREATE POLICY "anon_select_designs" ON designs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_designs" ON designs;
CREATE POLICY "anon_insert_designs" ON designs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_designs" ON designs;
CREATE POLICY "anon_update_designs" ON designs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_designs" ON designs;
CREATE POLICY "anon_delete_designs" ON designs FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS material_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE material_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_material_library" ON material_library;
CREATE POLICY "anon_select_material_library" ON material_library FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_material_library" ON material_library;
CREATE POLICY "anon_insert_material_library" ON material_library FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_material_library" ON material_library;
CREATE POLICY "anon_update_material_library" ON material_library FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_material_library" ON material_library;
CREATE POLICY "anon_delete_material_library" ON material_library FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nail_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  cost_cny numeric NOT NULL DEFAULT 0,
  purchase_channel text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nail_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_nail_materials" ON nail_materials;
CREATE POLICY "anon_select_nail_materials" ON nail_materials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_nail_materials" ON nail_materials;
CREATE POLICY "anon_insert_nail_materials" ON nail_materials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_nail_materials" ON nail_materials;
CREATE POLICY "anon_update_nail_materials" ON nail_materials FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_nail_materials" ON nail_materials;
CREATE POLICY "anon_delete_nail_materials" ON nail_materials FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nail_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nail_techniques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_nail_techniques" ON nail_techniques;
CREATE POLICY "anon_select_nail_techniques" ON nail_techniques FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_nail_techniques" ON nail_techniques;
CREATE POLICY "anon_insert_nail_techniques" ON nail_techniques FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_nail_techniques" ON nail_techniques;
CREATE POLICY "anon_update_nail_techniques" ON nail_techniques FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_nail_techniques" ON nail_techniques;
CREATE POLICY "anon_delete_nail_techniques" ON nail_techniques FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS salon_price_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name text NOT NULL,
  price_min_cny integer NOT NULL DEFAULT 0,
  price_max_cny integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE salon_price_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_salon_prices" ON salon_price_tiers;
CREATE POLICY "anon_select_salon_prices" ON salon_price_tiers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_salon_prices" ON salon_price_tiers;
CREATE POLICY "anon_insert_salon_prices" ON salon_price_tiers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_salon_prices" ON salon_price_tiers;
CREATE POLICY "salon_price_tiers_update" ON salon_price_tiers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "salon_price_tiers_update" ON salon_price_tiers;
CREATE POLICY "anon_update_salon_prices" ON salon_price_tiers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_salon_prices" ON salon_price_tiers;
CREATE POLICY "anon_delete_salon_prices" ON salon_price_tiers FOR DELETE
  TO anon, authenticated USING (true);
