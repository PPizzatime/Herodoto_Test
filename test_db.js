const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = 'apps/web/.env';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function testQuery() {
  console.log("Querying Supabase...");
  const { data, error } = await supabase.from('documentation_pages').select('slug, title');
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data:", data);
  }
}

testQuery();
