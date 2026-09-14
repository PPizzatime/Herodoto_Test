const fs = require('fs');

const req = fs.readFileSync('req_old.md', 'utf8');
const newReqs = `
## 10. Herodoto 2.0 Feature Expansion
- [x] **Gamification Engine:** Added \`points_reward\` to guides and created a \`gamification_profiles\` table to store persistent user progress.
- [x] **Mobile Map Enhancements:** Mobile map now renders rich thumbnail imagery directly inside the markers by fetching \`image_url\` from the database.
- [x] **Hierarchical Workflows:** Tasks engine was upgraded to support \`REVIEW_REQUESTED\` and \`REJECTED\`, allowing Managers to formally review subordinate work.
- [x] **Geotargeted Subscriptions:** Promo codes can now be bound to specific \`target_country\` and \`target_month\` restrictions (e.g. 50% off for Mexicans in September).
`;
fs.writeFileSync('req_new.md', req + newReqs);

const db = fs.readFileSync('db_old.md', 'utf8');
const newDb = `
---

## Table: gamification_profiles
Stores persistent user levels and gamification points.

**Fields & Types:**
- \`user_id\` (UUID, Primary Key): Foreign key to profiles.
- \`points_balance\` (Integer): Currently available points.
- \`total_earned\` (Integer): Lifetime points earned.
- \`level\` (Integer): Current player level.

**Interaction & Usage:**
- **Where it is used:** Displayed on the Consumer Profile screen.
`;
fs.writeFileSync('db_new.md', db + newDb);

const arch = fs.readFileSync('arch_old.md', 'utf8');
// Architecture doesn't need much change, maybe just append a note about gamification.
const newArch = `
## Herodoto 2.0 Engine Updates
The architecture has been expanded to support real-time Hierarchical Workflows and Geotargeted Subscriptions, leveraging PostgreSQL's relational integrity to bind Managers to Employees for task reviews.
`;
fs.writeFileSync('arch_new.md', arch + newArch);

const escapeSql = (str) => str.replace(/'/g, "''");
const sql = `
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(req + newReqs)}' WHERE slug = 'requirements';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(db + newDb)}' WHERE slug = 'database';
UPDATE public.documentation_pages SET content_markdown = '${escapeSql(arch + newArch)}' WHERE slug = 'architecture';
`;

fs.writeFileSync('supabase/migrations/20260914110000_docs_update.sql', sql);
console.log("SQL generated!");
