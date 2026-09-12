-- Drop old broken trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user_roles() 
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  org_id uuid;
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (new.id, split_part(new.email, '@', 1), 'User', '');

  -- 2. Add to Organization based on email prefix
  SELECT id INTO org_id FROM public.organizations WHERE type = 'INTERNAL' LIMIT 1;
  
  IF org_id IS NOT NULL THEN
    IF new.email LIKE 'employee@%' THEN
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222221');
    ELSIF new.email LIKE 'manager@%' THEN
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222222');
    ELSIF new.email LIKE 'admin@%' THEN
      INSERT INTO public.organization_members (organization_id, user_id, role_id)
      VALUES (org_id, new.id, '22222222-2222-2222-2222-222222222223');
    END IF;
  END IF;
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created_roles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_roles();
