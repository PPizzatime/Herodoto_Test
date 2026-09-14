UPDATE public.documentation_pages
SET content_markdown = REPLACE(content_markdown, '<a href="/office/docs/deployment" style={{ color: ''#2563eb'' }}>Deployment Guide</a>', '[Deployment Guide](/office/docs/deployment)')
WHERE slug = 'architecture';
