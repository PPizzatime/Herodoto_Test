const fs = require('fs');

function tsxToMarkdown(tsx) {
  if (!tsx.includes('return (')) return '';
  let md = tsx.split('return (')[1];
  md = md.substring(md.indexOf('<h1'));
  md = md.split('<Comments')[0];
  
  md = md.replace(/<div[^>]*>/g, '');
  md = md.replace(/<\/div>/g, '');
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');
  md = md.replace(/<ul[^>]*>/g, '');
  md = md.replace(/<\/ul>/g, '');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');
  md = md.replace(/<p[^>]*>/g, '');
  md = md.replace(/<\/p>/g, '\n\n');
  
  // STRIP LEADING SPACES (this was the bug!)
  const lines = md.split('\n');
  md = lines.map(line => line.trimStart()).join('\n').trim();
  
  return md;
}

const architectureMd = tsxToMarkdown(fs.readFileSync('architecture_temp.txt', 'utf16le'));
const techStackMd = tsxToMarkdown(fs.readFileSync('techstack_temp.txt', 'utf16le'));

const deployMatch = fs.readFileSync('deployment_temp.txt', 'utf16le').match(/Buffer\.from\("([^"]+)"/);
let deploymentMd = deployMatch ? Buffer.from(deployMatch[1], 'base64').toString('utf-8') : '';
deploymentMd = deploymentMd.split('\n').map(line => line.trimStart()).join('\n').trim();

const dbMd = fs.readFileSync('database_clean.md', 'utf8');
const reqMd = fs.readFileSync('requirements_clean.md', 'utf8');

// Let's create an SQL file!
const escapeSql = (str) => str.replace(/'/g, "''");

const sql = `
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(architectureMd)}' WHERE slug = 'architecture';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(techStackMd)}' WHERE slug = 'tech-stack';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(deploymentMd)}' WHERE slug = 'deployment';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(dbMd)}' WHERE slug = 'database';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(reqMd)}' WHERE slug = 'requirements';
`;

fs.writeFileSync('supabase/migrations/20260914060000_fix_all_formatting.sql', sql);
console.log("SQL file generated!");
