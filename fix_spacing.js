const fs = require('fs');

const envPath = 'apps/web/.env';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

async function fixWhitespace() {
  console.log("Fetching docs...");
  const fetchRes = await fetch(`${url}/rest/v1/documentation_pages?select=slug,content_markdown`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  
  const pages = await fetchRes.json();
  let sqlUpdates = '';
  
  for (const page of pages) {
    if (!page.content_markdown) continue;
    
    // Split by newlines and trim leading spaces
    const lines = page.content_markdown.split('\n');
    const fixedLines = lines.map(line => line.trimStart());
    const fixedMd = fixedLines.join('\n');
    
    // generate SQL
    const escapeSql = (str) => str.replace(/'/g, "''");
    sqlUpdates += `UPDATE public.documentation_pages SET content_markdown = '${escapeSql(fixedMd)}' WHERE slug = '${page.slug}';\n`;
  }
  
  fs.writeFileSync('supabase/migrations/20260914050000_fix_markdown_spacing.sql', sqlUpdates);
  console.log("SQL file generated!");
}

fixWhitespace();
