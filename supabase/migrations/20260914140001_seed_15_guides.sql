-- Migration to add 5 new Mexican guides to reach 15 total guides
-- and ensure they have full metadata for the UI (icons, promos)

DO $$
DECLARE
    internal_org_id uuid;
    c_mx uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
    SELECT id INTO c_mx FROM public.countries WHERE code = 'MX';

    IF internal_org_id IS NOT NULL THEN
        -- 11. MARCO Monterrey
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000001', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000001', 1, 'MARCO Monterrey', 'Explore the Museum of Contemporary Art of Monterrey, a beacon of modern art in northern Mexico.', 'https://images.unsplash.com/photo-1579227521743-fba0ba0fcf0e?q=80&w=2000&auto=format&fit=crop', 8.00, 0, 150, 25.6663, -100.3106, c_mx) ON CONFLICT DO NOTHING;

        -- 12. Museo Soumaya
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000002', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000002', 1, 'Museo Soumaya', 'A breathtaking architectural marvel in CDMX housing over 66,000 works of art.', 'https://images.unsplash.com/photo-1580211717387-57353f2c7a52?q=80&w=2000&auto=format&fit=crop', 0, NULL, 100, 19.4407, -99.2047, c_mx) ON CONFLICT DO NOTHING;

        -- 13. Palenque
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000003', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000003', 1, 'Palenque Ruins', 'Discover the ancient Maya city of Palenque, hidden deep within the jungles of Chiapas.', 'https://images.unsplash.com/photo-1518623380242-d992d3c15b1c?q=80&w=2000&auto=format&fit=crop', 12.00, 10.00, 300, 17.4842, -92.0459, c_mx) ON CONFLICT DO NOTHING;

        -- 14. Tulum Ruins
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000004', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000004', 1, 'Tulum Ruins', 'Walk through the breathtaking Maya ruins overlooking the turquoise Caribbean Sea.', 'https://images.unsplash.com/photo-1510967756627-2e8675128080?q=80&w=2000&auto=format&fit=crop', 15.00, NULL, 250, 20.2147, -87.4289, c_mx) ON CONFLICT DO NOTHING;

        -- 15. Teotihuacan
        INSERT INTO public.guides (id, organization_id, status) VALUES ('d0000000-0000-0000-0000-000000000005', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
        INSERT INTO public.guide_versions (guide_id, version_number, title, description, image_url, price, discount_price, points_reward, lat, lng, country_id) 
        VALUES ('d0000000-0000-0000-0000-000000000005', 1, 'Teotihuacan Pyramids', 'Climb the Pyramid of the Sun and the Pyramid of the Moon in the ancient city of the gods.', 'https://images.unsplash.com/photo-1552594615-58531ecb8eb3?q=80&w=2000&auto=format&fit=crop', 10.00, 5.00, 350, 19.6925, -98.8439, c_mx) ON CONFLICT DO NOTHING;

        -- Ensure Chichen Itza has a unique image so they don't look duplicate
        UPDATE public.guide_versions 
        SET image_url = 'https://images.unsplash.com/photo-1518182170546-076616fdfaaf?q=80&w=2000&auto=format&fit=crop' 
        WHERE title = 'Chichen Itza';

        -- Make sure active_version_id is set for the new guides
        UPDATE public.guides g
        SET active_version_id = gv.id
        FROM public.guide_versions gv
        WHERE g.id = gv.guide_id AND g.active_version_id IS NULL;
    END IF;
END $$;
