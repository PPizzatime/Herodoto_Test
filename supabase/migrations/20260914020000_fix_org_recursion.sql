-- Drop the recursive policy
DROP POLICY IF EXISTS "Org members viewable." ON public.organization_members;

-- Create a security definer function to check org membership safely
CREATE OR REPLACE FUNCTION public.is_in_same_org(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid() AND organization_id = org_id
  );
$$;

-- Recreate the policy using the safe function
CREATE POLICY "Org members viewable." ON public.organization_members FOR SELECT USING (
  public.has_permission('organization.view') OR public.is_in_same_org(organization_id)
);
