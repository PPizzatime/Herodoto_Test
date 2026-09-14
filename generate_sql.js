const fs = require('fs');
const path = require('path');

function extractMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/Buffer\.from\('([^']+)', 'base64'\)/);
  if (match) {
    return Buffer.from(match[1], 'base64').toString('utf-8');
  }
  return '';
}

const archMd = extractMd('apps/web/app/office/docs/architecture/page.tsx');
const techMd = extractMd('apps/web/app/office/docs/tech-stack/page.tsx');
const depMd = extractMd('apps/web/app/office/docs/deployment/page.tsx');
const dbMd = extractMd('apps/web/app/office/docs/database/page.tsx');
let reqMd = extractMd('apps/web/app/office/docs/requirements/page.tsx');

reqMd += "\n\n### 5. Comments & Tagging Engine\n- [x] **Tagging System:** When writing comments, the user should be able to tag people using the `@` symbol followed by their name.\n- [x] **Notification Routing:** People tagged in documentation comments should receive an instant notification in the work environment (Office Portal) and Mobile App.\n\n### 6. Universal Notification Inbox\n- [x] **Dedicated Area:** There should be a notifications area (inbox/dropdown) for each user.\n- [x] **Visual Badging:** Notifications should be flagged in the home page header with a red badge containing a little number stating the amount of unclicked or unreviewed notifications.";

const sql = `
CREATE TABLE IF NOT EXISTS public.documentation_pages (
    slug text PRIMARY KEY,
    title text NOT NULL,
    content_markdown text NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.documentation_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read documentation" ON public.documentation_pages;
DROP POLICY IF EXISTS "Admins can update documentation" ON public.documentation_pages;

CREATE POLICY "Anyone can read documentation" ON public.documentation_pages FOR SELECT USING (true);
CREATE POLICY "Admins can update documentation" ON public.documentation_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.organization_members om WHERE om.user_id = auth.uid() AND om.role_id = '22222222-2222-2222-2222-222222222223')
);

INSERT INTO public.documentation_pages (slug, title, content_markdown) VALUES
('architecture', 'System Architecture', $$` + archMd + `$$),
('tech-stack', 'Core Technology Stack', $$` + techMd + `$$),
('deployment', 'Deployment & CI/CD Guide', $$` + depMd + `$$),
('database', 'Database Architecture', $$` + dbMd + `$$),
('requirements', 'Project Requirements', $$` + reqMd + `$$)
ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown, title = EXCLUDED.title;
`;

fs.writeFileSync('supabase/migrations/20260914010000_docs_cms.sql', sql);
