# Herodoto Platform Requirements & Features

This document tracks all implemented features, structural requirements, and operational capabilities of the Herodoto platform. 

## 1. Core Architecture & Monorepo
- [x] **Turborepo Monorepo:** Unified codebase containing both the Web Portal (`apps/web`) and the Mobile App (`apps/mobile`), with shared internal packages (`packages/ui`, `packages/supabase`).
- [x] **Shared Database Client:** A centralized `@repo/supabase` package providing strictly typed wrappers for browser and server environments.
- [x] **Unified Domain Hosting:** Seamless unified routing on a single domain via Netlify (`herodoto.art/app` for mobile, `/office` for dashboard).

## 2. Authentication & Identity
- [x] **Supabase Auth:** Secure Email/Password authentication.
- [x] **Restricted Registration:** Open signups disabled for security. Accounts are strictly provisioned.
- [x] **Profile Mapping:** Custom `profiles` table synced 1-to-1 with internal Auth users.
- [x] **Automated Employee Provisioning:** Accounts ending in `@herodoto.art` are automatically granted Admin/Worker status and organization bindings via PostgreSQL Triggers.
- [x] **Key Personnel:** Explicit Admin access mapped for founders/directors (Carlos, Luis, Ricardo, Enrique).

## 3. Role-Based Access Control (RBAC)
- [x] **Granular Roles:** System strictly differentiates between `Admin`, `Manager`, `Employee`, and `Consumer`.
- [x] **Row Level Security (RLS):** Supabase database heavily locked down with recursive-safe RLS policies to prevent unauthorized data mutation.
- [x] **Permissions Engine:** Granular permission flags (e.g., `organization.view`, `guides.edit`) assigned via `role_permissions` mapping table.

## 4. Internal Office Portal (Web - Next.js)
- [x] **Secure Dashboard:** Layout requires active auth session; unauthorized users are redirected.
- [x] **Guide CMS:** Interface for creating, editing, and managing geographic tourist guides.
- [x] **Monetization & Subscriptions:** Dedicated views for defining Subscription plans (Free, Premium, Enterprise).
- [x] **Promo Codes System:** Generation and tracking of promotional codes, including usage limits and validity.
- [x] **Security & Audit Logs:** Dedicated security view for tracking administrative actions and pending workflow approvals.
- [x] **Dynamic Documentation Portal:** Database-backed Markdown rendering engine for internal tech docs (this page!).

## 5. Consumer Experience (Mobile - Expo)
- [x] **Cross-Platform Compilation:** Built with Expo React Native, exported for iOS, Android, and Web.
- [x] **Interactive Maps:** Geospatial map interface displaying guides and POIs.
- [x] **Gamified Profiles:** User profiles featuring progress bars, completion stats, and achievements.
- [x] **Redemption Portal:** Dedicated screen for users to input and claim Promo Codes.
- [x] **Employee Bridge:** Profile screen intelligently detects `@herodoto.art` accounts and injects an exclusive button to teleport the user into the Next.js Office Dashboard.

## 6. Real-Time Collaboration: Comments & Tagging
- [x] **Inline Commenting:** Employees can leave persistent comments on internal documentation and guides.
- [x] **Cascading Deletes:** Deleting a comment correctly cleans up associated notifications.
- [x] **Admin Moderation:** Admins have privileges to erase inappropriate or outdated messages.
- [x] **@Mentions System:** When writing comments, the user is able to tag people using the `@` symbol followed by their name.
- [x] **Intelligent Routing:** People tagged in comments receive an instant, targeted notification in their work environment (Office Portal) and Mobile App.

## 7. Universal Notification Engine
- [x] **Centralized Inbox:** A dedicated `notifications` table storing all system events and mentions.
- [x] **Real-Time WebSockets:** Uses Supabase Realtime (`postgres_changes`) to instantly push notifications to connected clients without refreshing.
- [x] **Office Portal Bell:** Notifications are flagged in the home page header (always visible) with a red badge stating the amount of unread notifications.
- [x] **Mobile Inbox:** Dedicated Notifications tab in the Consumer app for alerts and system updates.
- [x] **Click-to-Read:** Clicking a notification marks it as read in the database and clears the unread badge automatically.

## 8. Gamification & Mobile Data
- [x] **Famous Locations Integration:** Populated mobile app with 10 total guides, including rich imagery for the Colosseum, Taj Mahal, Machu Picchu, Great Wall of China, and Chichen Itza via Unsplash API.
- [x] **Unread Badging (Mobile):** Built a WebSocket listener within the primary mobile layout to maintain an active unread count, rendering a persistent red badge over the notification bell tab.

## 9. Office Operational Systems
- [x] **Kanban Task Engine:** Engineered a fully database-backed Tasks board (`tasks` table) allowing Managers to track `TODO`, `IN_PROGRESS`, and `COMPLETED` objectives, and assign them directly to specific team members.
- [x] **Promo Code Logistics:** Transformed the hardcoded Promo Codes view into a functional CMS connected to the `promo_codes` table, featuring live discount configurations and redemption constraints.
- [x] **Cloud Avatar Storage:** Deployed a public Supabase Storage Bucket (`avatars`) and updated the Office Profile view to support rich file uploads, streaming directly to PostgreSQL via the `profiles` schema.
- [x] **Hierarchy Re-alignment:** Programmatically synchronized the `organization_members` database to place Luis at the Director tier (`level 10`), with Carlos, Ricardo, and Enrique functioning underneath him. `admin@herodoto.art` was officially branded as 'Admin'.

## 10. Herodoto 2.0 Feature Expansion
- [x] **Gamification Engine:** Added `points_reward` to guides and created a `gamification_profiles` table to store persistent user progress.
- [x] **Mobile Map Enhancements:** Mobile map now renders rich thumbnail imagery directly inside the markers by fetching `image_url` from the database.
- [x] **Hierarchical Workflows:** Tasks engine was upgraded to support `REVIEW_REQUESTED` and `REJECTED`, allowing Managers to formally review subordinate work.
- [x] **Geotargeted Subscriptions:** Promo codes can now be bound to specific `target_country` and `target_month` restrictions (e.g. 50% off for Mexicans in September).
