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
  const response = await fetch(`${url}/rest/v1/documentation_pages?select=slug,title,content_markdown`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  
  const data = await response.json();
  data.forEach(row => {
    console.log(`Slug: ${row.slug}, Content Length: ${row.content_markdown ? row.content_markdown.length : 0}`);
  });
}

testQuery();
