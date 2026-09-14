
UPDATE public.documentation_pages SET content_markdown = '# System Architecture


Herodoto is built as a **Monorepo** using Turborepo. This allows us to share code (like database clients and UI components) between completely different applications while keeping them in the same GitHub repository.



## The Two Environments



### 1. Consumer App (apps/mobile)

Built with **Expo (React Native)**. This is the main product that tourists and consumers use to view maps, explore guides, and track their gamification points. Even though it is a mobile app, we compile it for the Web so it can be accessed directly from a browser without installing anything.





### 2. Office Portal (apps/web)

Built with **Next.js (React)**. This is the secure internal dashboard used by Employees, Managers, and Admins to manage tours, view audit logs, manage subscriptions, and oversee the platform.




## Unified Web Routing

To provide a seamless experience, both environments are hosted on a single Netlify domain (`herodoto.art`). When a user visits the site:



- The server instantly redirects them to the `/app` directory.

- The `/app` directory serves the compiled Expo Mobile App statically.

- If an employee logs in through the Mobile App, their profile shows an "Enter Office" button.

- Clicking the button sends them to `/office`, which is intercepted and rendered by the Next.js Office Portal engine.


For more details on how these are built and hosted, see the <a href="/office/docs/deployment" style={{ color: ''#2563eb'' }}>Deployment Guide</a>.' WHERE slug = 'architecture';
UPDATE public.documentation_pages SET content_markdown = '# Technology Stack


## Frameworks


- **Turborepo:** High-performance build system for our monorepo. It manages dependencies and scripts across all our apps.

- **Next.js 14 (App Router):** React framework used for the Office Portal (`apps/web`). Used for its robust routing and server components.

- **Expo / React Native:** Used for the Consumer App (`apps/mobile`). Allows us to write code once and deploy it to iOS, Android, and the Web simultaneously.



## Libraries


- **Supabase JS:** Client SDK for connecting to our PostgreSQL database. Shared between both apps in `packages/supabase`.

- **Lucide React Native:** Icon library used in the mobile app for a consistent look.

- **Expo Router:** File-based routing for React Native, bringing web-like navigation to the mobile app.' WHERE slug = 'tech-stack';
UPDATE public.documentation_pages SET content_markdown = '# Herodoto Deployment Guide (Free Tier for Teams)

Since you are working with a team and using a GitHub Organization, Vercel will block you from using their free tier. Instead, we will use **Netlify**, a massive Vercel competitor that **allows GitHub Organization repositories on their completely free plan**. 

*(Note: Your teammates won''t need to log into Netlify. As long as they push their code to the GitHub repository, Netlify will automatically build and update the website for everyone for free).*

## 1. Deploy the Web Office App (Netlify)

### Step 1: Push to GitHub
1. Open GitHub Desktop and commit all your recent changes.
2. Push your repository to your GitHub Organization.

### Step 2: Import to Netlify (Free Tier)
1. Go to [Netlify.com](https://www.netlify.com/) and click **Sign Up** (Choose "Sign up with GitHub").
2. Once you are in the Netlify Dashboard, click the **"Add new site"** button and select **"Import an existing project"**.
3. Click the **GitHub** icon to authorize Netlify.
4. A window will pop up asking which repositories Netlify can access. Select your Organization and choose the `HerodotoAntigravity` repository.
5. Once selected, Netlify will show you the build settings. Configure them exactly like this:
- **Base directory:** `apps/web` *(Important!)*
- **Build command:** `next build`
- **Publish directory:** `.next`
6. Click the **"Add environment variables"** button and add your Supabase keys:
- Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: `https://xyrvjfhalabgfaktcmsn.supabase.co`
- Key: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Value: `your_key_here`
7. Click the **Deploy site** button. Netlify will now build your Next.js app in the cloud!

### Step 3: Add Your Custom Domain (`herodoto.art`)
1. Once your site finishes deploying, go to the **"Domain management"** section in your Netlify site dashboard.
2. Click **"Add custom domain"**.
3. Type in `office.herodoto.art` or `herodoto.art` and click Verify.
4. Netlify will ask if you want to configure DNS. It will give you a DNS record (like a `CNAME` pointing to `your-site-name.netlify.app` or an `A` record).
5. Log into where you bought `herodoto.art` (GoDaddy, Hostinger, etc.), go to the DNS settings, and add the record Netlify gave you. Your site will be live on your domain within minutes!

---

## 2. Deploy the Mobile App for Teammates (Expo Go)

Because building real App Store apps requires paid Apple Developer accounts and a long review process, we will use **Expo Go** to share the app with your teammates instantly and for free.

### Remote Testing (EAS Update)
This allows your teammates to test the app anywhere in the world:
1. Open a terminal in your project and install EAS CLI: `npm install -g eas-cli`
2. Log in to your Expo account: `eas login`
3. Run `eas build:configure` and just hit enter for the defaults.
4. Run `eas update`
5. This will upload the app to Expo''s cloud and give you a public URL/QR Code. You can send that link to your teammates in Slack or WhatsApp. When they open it, the app will instantly launch inside the free Expo Go app on their phones!

---

## 3. Supabase Database (Already Live)

Your Supabase project is already running live in the cloud. No further deployment is required! 

Just remember that you and your teammates will all be connecting to the same live database. If they log in using the mobile app and change a tour status, you will see the change on your end as well.' WHERE slug = 'deployment';
UPDATE public.documentation_pages SET content_markdown = '# Herodoto Database Architecture

This document details the PostgreSQL schema and interaction models for the Herodoto platform, hosted on Supabase.

## Table: profiles
The central table for all user demographic data. It maps 1-to-1 with Supabase''s internal `auth.users` table.

**Fields & Types:**
- `id` (UUID, Primary Key): Mirrors `auth.users(id)`.
- `first_name` (Text): The user''s first name.
- `last_name` (Text): The user''s last name.
- `avatar_url` (Text): URL to the user''s profile picture.
- `updated_at` (Timestampz): Last profile update.

**Interaction & Usage:**
- **Where it is used:** Displaying user names in the Office Portal top-right header, rendering avatars on Comments, and searching for users when using the `@mention` autocomplete system.
- **Handling:** Automatically populated by the `handle_new_user_roles` Postgres trigger whenever a user signs up. Users can modify their own row via the Profile screen in both Web and Mobile.

---

## Table: organizations
Stores organizational tenants. Supports both internal Herodoto operations and external customer groups.

**Fields & Types:**
- `id` (UUID, Primary Key): Unique identifier.
- `name` (Text): Display name of the organization.
- `type` (Text): Determines org capabilities (INTERNAL or CUSTOMER).
- `created_at` (Timestampz): Creation date.

**Interaction & Usage:**
- **Where it is used:** Office Portal "Organization" tab.
- **Handling:** Organizations are the root boundary for Role-Based Access Control (RBAC). A user must belong to an organization to possess any meaningful roles or permissions.

---

## Table: roles & permissions
A many-to-many relationship defining the RBAC engine.

**Fields & Types:**
- `roles` Table: Contains `id` and `name` (e.g., "Admin", "Manager", "Employee", "Consumer").
- `permissions` Table: Contains granular flags like `organization.view`, `guides.edit`.
- `role_permissions` Table: Maps which roles have which permissions.

**Interaction & Usage:**
- **Handling:** Permissions are evaluated natively inside PostgreSQL Row Level Security using the `public.has_permission(permission_name)` Security Definer function. This ensures that even direct API calls are blocked if the user lacks the permission flag.

---

## Table: comments & mentions
The system for annotating internal documents and guides.

**Fields & Types:**
- `id` (UUID): Unique comment ID.
- `page_id` (Text): The slug of the document being commented on (e.g., ''architecture'').
- `author_id` (UUID): Foreign key to `profiles(id)`.
- `content` (Text): The raw text of the comment.
- `created_at` (Timestampz): Time of creation.

**Interaction & Usage:**
- **Where it is used:** Rendered at the bottom of every Documentation page via the `<Comments />` component.
- **Handling:** Supports cascading deletes. When a comment is erased by an Admin, the database automatically deletes any associated rows in the `notifications` table using a foreign key `ON DELETE CASCADE`.

---

## Table: notifications
The centralized inbox for system alerts and user mentions.

**Fields & Types:**
- `id` (UUID): Unique notification ID.
- `user_id` (UUID): Foreign key to the user receiving the notification.
- `actor_id` (UUID): Foreign key to the user who triggered the action.
- `type` (Text): e.g., ''mention'', ''system_alert''.
- `message` (Text): The display text (e.g., ''tagged you in a comment'').
- `link` (Text, Nullable): URL to redirect the user to when clicked.
- `is_read` (Boolean): Default `false`.

**Interaction & Usage:**
- **Where it is used:** Displayed in the Office Portal top header bell and the Mobile App Notifications tab.
- **Handling:** Real-time updates are streamed directly to the frontend using Supabase Realtime (`postgres_changes` listener).

---

## Table: user_guide_history
Tracks Consumer interaction with tourist guides for gamification.

**Fields & Types:**
- `id` (UUID): Unique history ID.
- `user_id` (UUID): Foreign key to the consumer.
- `guide_id` (UUID): Foreign key to the guide explored.
- `status` (Text): e.g., ''in_progress'', ''completed''.
- `progress` (Integer): Percentage of completion (0-100).
- `last_accessed` (Timestampz): Used to sort recent guides on the mobile app.

**Interaction & Usage:**
- **Where it is used:** Displayed on the Consumer Profile screen to show progress bars and recently visited locations.
' WHERE slug = 'database';
UPDATE public.documentation_pages SET content_markdown = '# Herodoto Platform Requirements & Features

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
' WHERE slug = 'requirements';
