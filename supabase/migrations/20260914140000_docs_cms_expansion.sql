-- 1. Add Category to Documentation Pages
ALTER TABLE public.documentation_pages
ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';

-- Seed categories for existing pages based on slug
UPDATE public.documentation_pages SET category = 'Core Concepts' WHERE slug IN ('architecture', 'database', 'tech-stack');
UPDATE public.documentation_pages SET category = 'Operations' WHERE slug IN ('deployment', 'requirements');

-- 2. Enhance Comments Table for Threading
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- 3. Update RLS on Documentation Pages for Admins
DROP POLICY IF EXISTS "Admins can manage docs" ON public.documentation_pages;

CREATE POLICY "Admins can manage docs" ON public.documentation_pages
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.id
        WHERE om.user_id = auth.uid() AND r.name = 'ADMIN'
    )
);

-- Ensure public select is still there
DROP POLICY IF EXISTS "Users can view docs" ON public.documentation_pages;
CREATE POLICY "Users can view docs" ON public.documentation_pages
FOR SELECT
USING (true);

