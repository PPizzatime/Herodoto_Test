const url = 'https://xyrvjfhalabgfaktcmsn.supabase.co';
const anon = 'sb_publishable_BghbLvfmswri2_0YAlSASA_kins7HDi';

fetch(url + '/rest/v1/guides?select=id,status,deleted_at,active_version_id,guide_versions(title)', {
  headers: {
    'apikey': anon,
    'Authorization': 'Bearer ' + anon
  }
}).then(r => r.json()).then(d => {
  console.log('Guides count:', d.length);
  if (d.length > 0) {
    d.forEach(g => {
        const title = g.guide_versions && g.guide_versions.length > 0 ? g.guide_versions[0].title : 'No Version';
        console.log(`${g.id} - ${title} - deleted: ${g.deleted_at} - status: ${g.status}`);
    });
  }
}).catch(console.error);

fetch(url + '/rest/v1/guide_images?select=id,guide_id,image_url', {
  headers: {
    'apikey': anon,
    'Authorization': 'Bearer ' + anon
  }
}).then(r => r.json()).then(d => {
  console.log('Guide images count:', d.length);
}).catch(console.error);
