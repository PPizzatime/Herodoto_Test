DO $$
DECLARE
    internal_org_id uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;

    -- Colosseum
    INSERT INTO public.guides (id, organization_id, status) VALUES ('b0000000-0000-0000-0000-000000000001', internal_org_id, 'PUBLISHED') ON CONFLICT DO NOTHING;
    INSERT INTO public.guide_versions (guide_id, version_number, title, description) VALUES ('b0000000-0000-0000-0000-000000000001', 1, 'Colosseum Explorer', 'Step into the grand arena of ancient Rome and discover the secrets of the gladiators.') ON CONFLICT DO NOTHING;
    -- Image can be stored in mobile_layout JSON or we don't have an image_url field? Let's check schema.
END $$;
