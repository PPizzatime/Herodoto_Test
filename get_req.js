const fs = require('fs');
const envPath = 'apps/web/.env';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

async function testQuery() {
  const response = await fetch(`${url}/rest/v1/documentation_pages?select=content_markdown&slug=eq.requirements`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await response.json();
  console.log(data[0].content_markdown);
}
testQuery();
