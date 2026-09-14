-- 1. Guides Expansions
ALTER TABLE public.guide_versions
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS price numeric default 0,
ADD COLUMN IF NOT EXISTS discount_price numeric,
ADD COLUMN IF NOT EXISTS discount_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS points_reward integer default 100;

-- 2. Tasks Expansions
ALTER TABLE public.tasks
DROP CONSTRAINT IF EXISTS tasks_status_check,
ADD COLUMN IF NOT EXISTS reviewer_id uuid references public.profiles(id) on delete set null;

-- Add constraint back (in postgres we must add constraint without IF NOT EXISTS)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_status_check') THEN
        ALTER TABLE public.tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW_REQUESTED', 'REJECTED', 'COMPLETED'));
    END IF;
END $$;

-- 3. Promo Codes Expansions
ALTER TABLE public.promo_codes
ADD COLUMN IF NOT EXISTS target_country text,
ADD COLUMN IF NOT EXISTS target_month integer;

-- 4. Gamification Tables
CREATE TABLE IF NOT EXISTS public.gamification_profiles (
    user_id uuid references public.profiles(id) on delete cascade primary key,
    points_balance integer default 0,
    total_earned integer default 0,
    level integer default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can view all gamification profiles" ON public.gamification_profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Insert 5 Guides
DO $$
DECLARE
    internal_org_id uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;

    IF internal_org_id IS NOT NULL THEN
        -- Colosseum
        INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000001', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward) 
        VALUES ('b0000000-0000-0000-0000-000000000001', 1, 'Colosseum Explorer', 'Step into the grand arena of ancient Rome and discover the secrets of the gladiators.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2000&auto=format&fit=crop', 12.00, 250) ON CONFLICT DO NOTHING;

        -- Taj Mahal
        INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000002', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward) 
        VALUES ('b0000000-0000-0000-0000-000000000002', 1, 'Taj Mahal', 'Experience the breathtaking beauty of the ivory-white marble mausoleum on the right bank of the river Yamuna.', 'https://images.unsplash.com/photo-1564507592208-02df22521975?q=80&w=2000&auto=format&fit=crop', 20.00, 300) ON CONFLICT DO NOTHING;

        -- Machu Picchu
        INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000003', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward) 
        VALUES ('b0000000-0000-0000-0000-000000000003', 1, 'Machu Picchu', 'Explore the 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley in Peru.', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop', 35.00, 500) ON CONFLICT DO NOTHING;

        -- Great Wall of China
        INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000004', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward) 
        VALUES ('b0000000-0000-0000-0000-000000000004', 1, 'Great Wall of China', 'Walk along the historic northern borders of ancient Chinese states and Imperial China.', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop', 10.00, 5.00, 200) ON CONFLICT DO NOTHING;

        -- Chichen Itza
        INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000005', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward) 
        VALUES ('b0000000-0000-0000-0000-000000000005', 1, 'Chichen Itza', 'Uncover the mysteries of the pre-Columbian city built by the Maya people.', 'https://images.unsplash.com/photo-1518182170546-076616fdfaaf?q=80&w=2000&auto=format&fit=crop', 15.00, 0, 400) ON CONFLICT DO NOTHING;
    END IF;
END $$;
