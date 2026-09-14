const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase.from('documentation_pages').select('id, content_markdown').eq('slug', 'architecture').single();
    if (error) { console.error(error); return; }
    
    let content = data.content_markdown;
    content = content.replace(/<a href="\/office\/docs\/deployment"[^>]*>Deployment Guide<\/a>/g, '[Deployment Guide](/office/docs/deployment)');
    
    const { error: updateError } = await supabase.from('documentation_pages').update({ content_markdown: content }).eq('id', data.id);
    if (updateError) console.error(updateError);
    else console.log("Success");
}
main();
