const fs = require('fs');
const dotenv = require('dotenv');

// Load .env
const envConfig = dotenv.parse(fs.readFileSync('apps/web/.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function main() {
    let res = await fetch(`${supabaseUrl}/rest/v1/documentation_pages?slug=eq.architecture&select=id,content_markdown`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    let data = await res.json();
    let page = data[0];
    
    let content = page.content_markdown;
    content = content.replace(/<a href="\/office\/docs\/deployment"[^>]*>Deployment Guide<\/a>/g, '[Deployment Guide](/office/docs/deployment)');
    
    let updateRes = await fetch(`${supabaseUrl}/rest/v1/documentation_pages?id=eq.${page.id}`, {
        method: 'PATCH',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_markdown: content })
    });
    
    if (updateRes.ok) console.log("Success with fetch!");
    else console.error(await updateRes.text());
}
main();
