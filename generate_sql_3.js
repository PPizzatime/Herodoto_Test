const fs = require('fs');

const arch = fs.readFileSync('arch.md', 'utf8');
const tech = fs.readFileSync('tech.md', 'utf8');
const dep = fs.readFileSync('dep.md', 'utf8');
const db = fs.readFileSync('database_clean.md', 'utf8');
const req = fs.readFileSync('requirements_clean.md', 'utf8');

const escapeSql = (str) => str.replace(/'/g, "''");

const sql = `
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(arch)}' WHERE slug = 'architecture';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(tech)}' WHERE slug = 'tech-stack';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(dep)}' WHERE slug = 'deployment';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(db)}' WHERE slug = 'database';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(req)}' WHERE slug = 'requirements';
`;

fs.writeFileSync('supabase/migrations/20260914060000_fix_all_formatting.sql', sql);
console.log("SQL file generated successfully.");
