-- 1. Create guide_images table
CREATE TABLE IF NOT EXISTS public.guide_images (
    id uuid default gen_random_uuid() primary key,
    guide_id uuid references public.guides(id) on delete cascade not null,
    image_url text not null,
    is_user_uploaded boolean default false not null,
    user_id uuid references auth.users(id) on delete set null,
    status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'APPROVED' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for guide_images
ALTER TABLE public.guide_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guide images are viewable by everyone if APPROVED or owned" 
ON public.guide_images FOR SELECT 
USING (status = 'APPROVED' OR auth.uid() = user_id);

CREATE POLICY "Users can upload guide images" 
ON public.guide_images FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND is_user_uploaded = true);

-- Migrate existing images from guide_versions (if any exist)
INSERT INTO public.guide_images (guide_id, image_url, status)
SELECT guide_id, image_url, 'APPROVED'
FROM public.guide_versions
WHERE image_url IS NOT NULL
ON CONFLICT DO NOTHING;

-- 2. Delete Teotihuacan and insert Fuente de Poseidon
DO $$
DECLARE
    internal_org_id uuid;
    c_mx uuid;
    teoti_id uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
    SELECT id INTO c_mx FROM public.countries WHERE code = 'MX';

    IF internal_org_id IS NOT NULL THEN
        -- Find Teotihuacan guide
        SELECT guide_id INTO teoti_id FROM public.guide_versions WHERE title = 'Teotihuacan Pyramids' LIMIT 1;
        
        -- If it exists, delete it
        IF teoti_id IS NOT NULL THEN
            DELETE FROM public.guides WHERE id = teoti_id;
        END IF;

        -- Insert Fuente de Poseidón
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000006', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000006', 1, 'Fuente de Poseidón', 'La Fuente de Poseidón, un icónico monumento en Monterrey, Nuevo León.', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2000&auto=format&fit=crop', 5.00, 150, 25.6690, -100.3110, c_mx) ON CONFLICT DO NOTHING;

        -- Make sure active_version_id is set for the new guide
        UPDATE public.guides g
        SET active_version_id = gv.id
        FROM public.guide_versions gv
        WHERE g.id = gv.guide_id AND g.id = 'd0000000-0000-0000-0000-000000000006' AND g.active_version_id IS NULL;

        -- Insert the image for Fuente de Poseidón into guide_images
        INSERT INTO public.guide_images (guide_id, image_url, status)
        VALUES ('d0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2000&auto=format&fit=crop', 'APPROVED');
    END IF;
END $$;
