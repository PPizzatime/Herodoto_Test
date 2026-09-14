CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert 3 generic accounts into auth.users (if they don't exist)
DO $$
DECLARE
    gen1_id uuid := 'a0000000-0000-0000-0000-000000000001';
    gen2_id uuid := 'a0000000-0000-0000-0000-000000000002';
    gen3_id uuid := 'a0000000-0000-0000-0000-000000000003';
    
    internal_org_id uuid;
    admin_role_id uuid;
    uid_luis uuid;
    
    -- Generic password hash for 'GenericPassword123!' (BCrypt)
    gen_pass_hash text := '$2a$10$tZ2E7f8a7W/J.s6O7G6j/OLw2eKj1GZ/w.K6h/Z5wL.E/v.yR.3P6';
BEGIN
    -- Only insert if the auth schema is accessible (Supabase migrations run as superuser)
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES 
        (gen1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'generic1@herodoto.art', gen_pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
        (gen2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'generic2@herodoto.art', gen_pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
        (gen3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'generic3@herodoto.art', gen_pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    ON CONFLICT (id) DO NOTHING;

    -- Profiles
    INSERT INTO public.profiles (id, first_name, last_name) VALUES 
        (gen1_id, 'Generic 1', 'Account'),
        (gen2_id, 'Generic 2', 'Account'),
        (gen3_id, 'Generic 3', 'Account')
    ON CONFLICT (id) DO NOTHING;
    
    -- Get IDs for Org Members
    SELECT id INTO internal_org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'ADMIN' LIMIT 1;
    SELECT id INTO uid_luis FROM auth.users WHERE email = 'luis@herodoto.art' LIMIT 1;
    
    -- Insert into Organization Members (under Luis by default)
    IF internal_org_id IS NOT NULL AND uid_luis IS NOT NULL THEN
        INSERT INTO public.organization_members (organization_id, user_id, role_id, level, supervisor_id)
        VALUES 
            (internal_org_id, gen1_id, admin_role_id, 1, uid_luis),
            (internal_org_id, gen2_id, admin_role_id, 1, uid_luis),
            (internal_org_id, gen3_id, admin_role_id, 1, uid_luis)
        ON CONFLICT (organization_id, user_id) DO NOTHING;
    END IF;
END $$;
