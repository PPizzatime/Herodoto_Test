-- 1. Create a function to auto-update 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Add updated_at columns and triggers to all relevant tables

-- Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
DROP TRIGGER IF EXISTS update_organizations_modtime ON public.organizations;
CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Organization Members
ALTER TABLE public.organization_members ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
DROP TRIGGER IF EXISTS update_organization_members_modtime ON public.organization_members;
CREATE TRIGGER update_organization_members_modtime BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE PROCEDURE update_modified_column();



-- Guides
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
DROP TRIGGER IF EXISTS update_guides_modtime ON public.guides;
CREATE TRIGGER update_guides_modtime BEFORE UPDATE ON public.guides FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Guide Versions
ALTER TABLE public.guide_versions ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
DROP TRIGGER IF EXISTS update_guide_versions_modtime ON public.guide_versions;
CREATE TRIGGER update_guide_versions_modtime BEFORE UPDATE ON public.guide_versions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Subscriptions (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscriptions' AND table_schema = 'public') THEN
        ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
        DROP TRIGGER IF EXISTS update_subscriptions_modtime ON public.subscriptions;
        CREATE TRIGGER update_subscriptions_modtime BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'promo_codes' AND table_schema = 'public') THEN
        ALTER TABLE public.promo_codes ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
        DROP TRIGGER IF EXISTS update_promo_codes_modtime ON public.promo_codes;
        CREATE TRIGGER update_promo_codes_modtime BEFORE UPDATE ON public.promo_codes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    END IF;
END $$;

-- Guide Images (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guide_images' AND table_schema = 'public') THEN
        ALTER TABLE public.guide_images ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
        DROP TRIGGER IF EXISTS update_guide_images_modtime ON public.guide_images;
        CREATE TRIGGER update_guide_images_modtime BEFORE UPDATE ON public.guide_images FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    END IF;
END $$;


-- 3. Add Soft Deletes (deleted_at)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;



-- 4. Foreign Key Indexes for Performance Optimization

-- role_permissions
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- organization_members
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role_id ON public.organization_members(role_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_supervisor_id ON public.organization_members(supervisor_id);

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks' AND table_schema = 'public') THEN
        ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
        ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;
        DROP TRIGGER IF EXISTS update_tasks_modtime ON public.tasks;
        CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'creator_id') THEN
            CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON public.tasks(creator_id);
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'assignee_id') THEN
            CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
        END IF;
    END IF;
END $$;

-- guides
CREATE INDEX IF NOT EXISTS idx_guides_org_id ON public.guides(organization_id);
CREATE INDEX IF NOT EXISTS idx_guides_created_by ON public.guides(created_by);
CREATE INDEX IF NOT EXISTS idx_guides_active_version ON public.guides(active_version_id);

-- guide_versions
CREATE INDEX IF NOT EXISTS idx_guide_versions_guide_id ON public.guide_versions(guide_id);

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscriptions' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_tier_id ON public.subscriptions(tier_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'promo_codes' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_promo_codes_tier_id ON public.promo_codes(tier_id);
    END IF;
END $$;

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);

-- guide_erase_verdicts
CREATE INDEX IF NOT EXISTS idx_guide_erase_verdicts_guide_id ON public.guide_erase_verdicts(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_erase_verdicts_actor_id ON public.guide_erase_verdicts(actor_id);

-- gamification_profiles
CREATE INDEX IF NOT EXISTS idx_gamification_profiles_user_id ON public.gamification_profiles(user_id);

-- guide_images & activity logs (if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guide_images' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_guide_images_guide_id ON public.guide_images(guide_id);
        CREATE INDEX IF NOT EXISTS idx_guide_images_user_id ON public.guide_images(user_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'activity_logs' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_guide_history' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_user_guide_history_user_id ON public.user_guide_history(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_guide_history_guide_id ON public.user_guide_history(guide_id);
    END IF;
END $$;
