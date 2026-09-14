const fs = require('fs');

const envFile = fs.readFileSync('apps/web/.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/^"|"$/g, '');
  }
});

fetch(env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/guides?select=id,title,deleted_at,active_version_id', {
  headers: {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': 'Bearer ' + env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  }
}).then(r => r.json()).then(d => {
  console.log('Guides count:', d.length);
  if(d.length > 0) console.log(d);
}).catch(console.error);

fetch(env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/guide_images?select=id,guide_id,image_url', {
  headers: {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': 'Bearer ' + env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  }
}).then(r => r.json()).then(d => {
  console.log('Guide images count:', d.length);
  if(d.length > 0) console.log(d.slice(0, 5));
}).catch(console.error);
