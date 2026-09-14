-- 1. ADD COMMENT_ID TO NOTIFICATIONS FOR CASCADING DELETES
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- 2. UPDATE THE AUTO-ROLE TRIGGER TO INCLUDE ANY HERODOTO.ART EMAIL AS ADMIN
CREATE OR REPLACE FUNCTION public.handle_new_user_roles() 
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  org_id uuid;
BEGIN
  -- Create Profile if it doesn't exist
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (new.id, split_part(new.email, '@', 1), 'User', '')
  ON CONFLICT (id) DO NOTHING;

  -- Add to Organization based on email prefix or domain
  SELECT id INTO org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
  
  IF org_id IS NOT NULL THEN
    IF new.email LIKE '%@herodoto.art' THEN
      -- Everyone at herodoto.art gets Admin access
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222223')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    ELSIF new.email LIKE 'manager@%' THEN
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222222')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    ELSIF new.email LIKE 'employee@%' THEN
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222221')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN new;
END;
$$;

-- 3. RETROACTIVELY GRANT ADMIN TO THE 4 EXISTING USERS
DO $$
DECLARE
  org_id uuid;
BEGIN
  SELECT id INTO org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
  
  IF org_id IS NOT NULL THEN
    -- Insert organization_members for Carlos, Luis, Ricardo, Enrique
    INSERT INTO public.organization_members (organization_id, user_id, role_id)
    SELECT org_id, id, '22222222-2222-2222-2222-222222222223'
    FROM auth.users
    WHERE email IN ('carlos@herodoto.art', 'luis@herodoto.art', 'ricardo@herodoto.art', 'enrique@herodoto.art')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;
END $$;

-- 4. UPDATE RLS POLICIES FOR COMMENTS (ALLOW ADMINS TO DELETE)
-- Drop existing delete policy if any
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON public.comments;

-- Allow anyone with an Admin role to delete ANY comment
CREATE POLICY "Admins can delete any comment" ON public.comments FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = auth.uid() 
      AND om.role_id = '22222222-2222-2222-2222-222222222223' -- Admin role ID
  )
);

-- Allow users to delete their own comments just in case
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE 
USING (auth.uid() = author_id);
