const fs = require('fs');

const envPath = 'apps/web/.env';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

async function fetchDocs() {
  const fetchRes = await fetch(`${url}/rest/v1/documentation_pages?select=slug,content_markdown`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  
  const pages = await fetchRes.json();
  const req = pages.find(p => p.slug === 'requirements').content_markdown;
  const db = pages.find(p => p.slug === 'database').content_markdown;
  const arch = pages.find(p => p.slug === 'architecture').content_markdown;

  fs.writeFileSync('req_old.md', req);
  fs.writeFileSync('db_old.md', db);
  fs.writeFileSync('arch_old.md', arch);
  console.log("Files downloaded!");
}

fetchDocs();
