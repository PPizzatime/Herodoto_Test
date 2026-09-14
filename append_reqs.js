const fs = require('fs');
const reqMd = fs.readFileSync('requirements_clean.md', 'utf8');

const newReqs = `
## 8. Gamification & Mobile Data
- [x] **Famous Locations Integration:** Populated mobile app with 10 total guides, including rich imagery for the Colosseum, Taj Mahal, Machu Picchu, Great Wall of China, and Chichen Itza via Unsplash API.
- [x] **Unread Badging (Mobile):** Built a WebSocket listener within the primary mobile layout to maintain an active unread count, rendering a persistent red badge over the notification bell tab.

## 9. Office Operational Systems
- [x] **Kanban Task Engine:** Engineered a fully database-backed Tasks board (\`tasks\` table) allowing Managers to track \`TODO\`, \`IN_PROGRESS\`, and \`COMPLETED\` objectives, and assign them directly to specific team members.
- [x] **Promo Code Logistics:** Transformed the hardcoded Promo Codes view into a functional CMS connected to the \`promo_codes\` table, featuring live discount configurations and redemption constraints.
- [x] **Cloud Avatar Storage:** Deployed a public Supabase Storage Bucket (\`avatars\`) and updated the Office Profile view to support rich file uploads, streaming directly to PostgreSQL via the \`profiles\` schema.
- [x] **Hierarchy Re-alignment:** Programmatically synchronized the \`organization_members\` database to place Luis at the Director tier (\`level 10\`), with Carlos, Ricardo, and Enrique functioning underneath him. \`admin@herodoto.art\` was officially branded as 'Admin'.
`;

fs.writeFileSync('requirements_clean.md', reqMd + newReqs);

const escapeSql = (str) => str.replace(/'/g, "''");
const sql = `UPDATE public.documentation_pages SET content_markdown = '${escapeSql(reqMd + newReqs)}' WHERE slug = 'requirements';`;

fs.writeFileSync('supabase/migrations/20260914090000_update_reqs.sql', sql);
console.log("SQL generated!");
