
-- 1. Create Countries and States
CREATE TABLE IF NOT EXISTS public.countries (
    id uuid default gen_random_uuid() primary key,
    code text not null unique,
    name text not null
);
CREATE TABLE IF NOT EXISTS public.states (
    id uuid default gen_random_uuid() primary key,
    country_id uuid references public.countries on delete cascade not null,
    code text not null,
    name text not null
);

-- Seed Countries
INSERT INTO public.countries (code, name) VALUES 
('IT', 'Italy'), ('IN', 'India'), ('PE', 'Peru'), ('CN', 'China'), 
('MX', 'Mexico'), ('FR', 'France'), ('US', 'United States'), 
('GB', 'United Kingdom'), ('ES', 'Spain')
ON CONFLICT (code) DO NOTHING;

-- 2. Rename Promo Codes
ALTER TABLE IF EXISTS public.promo_codes RENAME TO promos;
ALTER TABLE IF EXISTS public.promo_code_redemptions RENAME TO promo_redemptions;
ALTER TABLE IF EXISTS public.promo_redemptions RENAME COLUMN promo_code_id TO promo_id;

-- Add new columns to promos
ALTER TABLE public.promos 
ADD COLUMN IF NOT EXISTS target_country_id uuid references public.countries,
ADD COLUMN IF NOT EXISTS target_state_id uuid references public.states,
ADD COLUMN IF NOT EXISTS guide_id uuid, -- references guides, will add FK later
ADD COLUMN IF NOT EXISTS discount_amount numeric,
ADD COLUMN IF NOT EXISTS start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS end_date timestamp with time zone;

-- Drop old text columns
ALTER TABLE public.promos DROP COLUMN IF EXISTS target_country;
ALTER TABLE public.promos DROP COLUMN IF EXISTS target_month;

-- 3. Create Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    price numeric not null,
    created_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS public.subscription_inclusions (
    id uuid default gen_random_uuid() primary key,
    subscription_id uuid references public.subscriptions on delete cascade not null,
    guide_id uuid not null,
    discount numeric,
    start_date timestamp with time zone,
    end_date timestamp with time zone
);

-- 4. Create Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    action text not null,
    table_name text not null,
    record_id uuid,
    user_id uuid references auth.users on delete set null,
    is_visible boolean default true,
    created_at timestamp with time zone default now()
);

-- 5. Expand Guides with Geo
ALTER TABLE public.guide_versions
ADD COLUMN IF NOT EXISTS lat numeric,
ADD COLUMN IF NOT EXISTS lng numeric,
ADD COLUMN IF NOT EXISTS country_id uuid references public.countries,
ADD COLUMN IF NOT EXISTS state_id uuid references public.states,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS zip_code text;

-- Add FK for promos -> guides
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'promos_guide_id_fkey'
    ) THEN
        ALTER TABLE public.promos ADD CONSTRAINT promos_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.guides(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. Seed Missing 5 Guides and Update Geo Data
DO $$
DECLARE
    internal_org_id uuid;
    c_it uuid; c_in uuid; c_pe uuid; c_cn uuid; c_mx uuid; c_fr uuid; c_us uuid; c_gb uuid; c_es uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
    
    SELECT id INTO c_it FROM public.countries WHERE code = 'IT';
    SELECT id INTO c_in FROM public.countries WHERE code = 'IN';
    SELECT id INTO c_pe FROM public.countries WHERE code = 'PE';
    SELECT id INTO c_cn FROM public.countries WHERE code = 'CN';
    SELECT id INTO c_mx FROM public.countries WHERE code = 'MX';
    SELECT id INTO c_fr FROM public.countries WHERE code = 'FR';
    SELECT id INTO c_us FROM public.countries WHERE code = 'US';
    SELECT id INTO c_gb FROM public.countries WHERE code = 'GB';
    SELECT id INTO c_es FROM public.countries WHERE code = 'ES';

    IF internal_org_id IS NOT NULL THEN
        -- Colosseum Update
        UPDATE public.guide_versions SET lat = 41.8902, lng = 12.4922, country_id = c_it WHERE title = 'Colosseum Explorer';
        -- Taj Mahal Update
        UPDATE public.guide_versions SET lat = 27.1751, lng = 78.0421, country_id = c_in WHERE title = 'Taj Mahal';
        -- Machu Picchu Update
        UPDATE public.guide_versions SET lat = -13.1631, lng = -72.5450, country_id = c_pe WHERE title = 'Machu Picchu';
        -- Great Wall Update
        UPDATE public.guide_versions SET lat = 40.4319, lng = 116.5704, country_id = c_cn WHERE title = 'Great Wall of China';
        -- Chichen Itza Update
        UPDATE public.guide_versions SET lat = 20.6843, lng = -88.5678, country_id = c_mx WHERE title = 'Chichen Itza';

        -- INSERT MISSING 5
        -- Louvre
        INSERT INTO public.guides (id, organization_id, status) VALUES ('c0000000-0000-0000-0000-000000000001', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('c0000000-0000-0000-0000-000000000001', 1, 'Louvre Museum', 'Explore the world''s largest art museum.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop', 15.00, 200, 48.8606, 2.3376, c_fr) ON CONFLICT DO NOTHING;

        -- MoMA
        INSERT INTO public.guides (id, organization_id, status) VALUES ('c0000000-0000-0000-0000-000000000002', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('c0000000-0000-0000-0000-000000000002', 1, 'Museum of Modern Art', 'Discover modern and contemporary art.', 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=2000&auto=format&fit=crop', 25.00, 250, 40.7614, -73.9776, c_us) ON CONFLICT DO NOTHING;

        -- British Museum
        INSERT INTO public.guides (id, organization_id, status) VALUES ('c0000000-0000-0000-0000-000000000003', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('c0000000-0000-0000-0000-000000000003', 1, 'British Museum', 'A museum dedicated to human history and culture.', 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=2000&auto=format&fit=crop', 0, 150, 51.5194, -0.1270, c_gb) ON CONFLICT DO NOTHING;

        -- Uffizi
        INSERT INTO public.guides (id, organization_id, status) VALUES ('c0000000-0000-0000-0000-000000000004', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('c0000000-0000-0000-0000-000000000004', 1, 'Uffizi Gallery', 'Prominent art museum located adjacent to the Piazza della Signoria.', 'https://images.unsplash.com/photo-1627914838615-ce1bb2552382?q=80&w=2000&auto=format&fit=crop', 20.00, 300, 43.7677, 11.2556, c_it) ON CONFLICT DO NOTHING;

        -- Prado
        INSERT INTO public.guides (id, organization_id, status) VALUES ('c0000000-0000-0000-0000-000000000005', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('c0000000-0000-0000-0000-000000000005', 1, 'Prado Museum', 'The main Spanish national art museum.', 'https://images.unsplash.com/photo-1543781702-811c75c88b2b?q=80&w=2000&auto=format&fit=crop', 18.00, 200, 40.4138, -3.6921, c_es) ON CONFLICT DO NOTHING;
    END IF;
END $$;
