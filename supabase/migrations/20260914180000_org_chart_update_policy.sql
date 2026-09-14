-- Add UPDATE policy for organization members so admins can manage the org chart
CREATE POLICY "Admins can update organization members." ON public.organization_members
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.id
        WHERE om.user_id = auth.uid() AND r.name = 'ADMIN'
    )
);
