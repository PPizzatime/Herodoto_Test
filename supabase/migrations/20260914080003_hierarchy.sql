DO $$
DECLARE
    internal_org_id uuid;
    admin_role_id uuid;
    uid_admin uuid;
    uid_luis uuid;
    uid_carlos uuid;
    uid_ricardo uuid;
    uid_enrique uuid;
BEGIN
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'ADMIN' LIMIT 1;

    -- Fetch user IDs by finding auth users with these emails (since profiles are 1-1 mapped)
    SELECT id INTO uid_admin FROM auth.users WHERE email = 'admin@herodoto.art' LIMIT 1;
    SELECT id INTO uid_luis FROM auth.users WHERE email = 'luis@herodoto.art' LIMIT 1;
    SELECT id INTO uid_carlos FROM auth.users WHERE email = 'carlos@herodoto.art' LIMIT 1;
    SELECT id INTO uid_ricardo FROM auth.users WHERE email = 'ricardo@herodoto.art' LIMIT 1;
    SELECT id INTO uid_enrique FROM auth.users WHERE email = 'enrique@herodoto.art' LIMIT 1;

    -- Update Profiles
    IF uid_admin IS NOT NULL THEN
        UPDATE public.profiles SET first_name = 'Admin', last_name = '' WHERE id = uid_admin;
    END IF;
    IF uid_luis IS NOT NULL THEN
        UPDATE public.profiles SET first_name = 'Luis', last_name = '' WHERE id = uid_luis;
    END IF;
    IF uid_carlos IS NOT NULL THEN
        UPDATE public.profiles SET first_name = 'Carlos', last_name = '' WHERE id = uid_carlos;
    END IF;
    IF uid_ricardo IS NOT NULL THEN
        UPDATE public.profiles SET first_name = 'Ricardo', last_name = '' WHERE id = uid_ricardo;
    END IF;
    IF uid_enrique IS NOT NULL THEN
        UPDATE public.profiles SET first_name = 'Enrique', last_name = '' WHERE id = uid_enrique;
    END IF;

    -- Update Organization Members
    IF uid_luis IS NOT NULL THEN
        UPDATE public.organization_members 
        SET role_id = admin_role_id, level = 10, supervisor_id = NULL 
        WHERE user_id = uid_luis;
    END IF;

    IF uid_carlos IS NOT NULL THEN
        UPDATE public.organization_members 
        SET role_id = admin_role_id, level = 9, supervisor_id = uid_luis 
        WHERE user_id = uid_carlos;
    END IF;

    IF uid_ricardo IS NOT NULL THEN
        UPDATE public.organization_members 
        SET role_id = admin_role_id, level = 9, supervisor_id = uid_luis 
        WHERE user_id = uid_ricardo;
    END IF;

    IF uid_enrique IS NOT NULL THEN
        UPDATE public.organization_members 
        SET role_id = admin_role_id, level = 9, supervisor_id = uid_luis 
        WHERE user_id = uid_enrique;
    END IF;

END $$;
