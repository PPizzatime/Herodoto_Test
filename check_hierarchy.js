const fs = require('fs');
const envPath = 'apps/web/.env';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

async function checkHierarchy() {
  const fetchRes = await fetch(`${url}/rest/v1/organization_members?select=user_id,role,profiles(first_name,last_name)`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  console.log(await fetchRes.json());
}

checkHierarchy();
