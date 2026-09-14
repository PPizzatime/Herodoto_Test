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
  console.log("Querying Supabase...");
  const response = await fetch(`${url}/rest/v1/organization_members?select=*`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  
  const data = await response.json();
  console.log("Data:", data);
}

testQuery();
