
CREATE TABLE IF NOT EXISTS public.documentation_pages (
    slug text PRIMARY KEY,
    title text NOT NULL,
    content_markdown text NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.documentation_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read documentation" ON public.documentation_pages;
DROP POLICY IF EXISTS "Admins can update documentation" ON public.documentation_pages;

CREATE POLICY "Anyone can read documentation" ON public.documentation_pages FOR SELECT USING (true);
CREATE POLICY "Admins can update documentation" ON public.documentation_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.organization_members om WHERE om.user_id = auth.uid() AND om.role_id = '22222222-2222-2222-2222-222222222223')
);

INSERT INTO public.documentation_pages (slug, title, content_markdown) VALUES
('architecture', 'System Architecture', $$$$),
('tech-stack', 'Core Technology Stack', $$$$),
('deployment', 'Deployment & CI/CD Guide', $$$$),
('database', 'Database Architecture', $$# Herodoto Database Architecture

This document details the PostgreSQL schema and interaction models for the Herodoto platform, hosted on Supabase.

## Table: profiles
The central table for all user demographic data. It maps 1-to-1 with Supabase's internal uth.users table.

**Fields & Types:**
- id (UUID, Primary Key): Mirrors uth.users(id).
- irst_name (Text): The user's first name.
- last_name (Text): The user's last name.
- vatar_url (Text): URL to the user's profile picture.
- updated_at (Timestampz): Last profile update.

**Interaction & Usage:**
- **Where it is used:** Displaying user names in the Office Portal top-right header, rendering avatars on Comments, and searching for users when using the @mention autocomplete system.
- **Handling:** Automatically populated by the handle_new_user_roles Postgres trigger whenever a user signs up. Users can modify their own row via the Profile screen in both Web and Mobile.

---

## Table: organizations
Stores organizational tenants. Supports both internal Herodoto operations and external customer groups.

**Fields & Types:**
- id (UUID, Primary Key): Unique identifier.
- 
ame (Text): Display name of the organization.
- 	ype (Text): Determines org capabilities (INTERNAL or CUSTOMER).
- created_at (Timestampz): Creation date.

**Interaction & Usage:**
- **Where it is used:** Currently restricts Office Portal access. Only users linked to the INTERNAL organization can bypass the Edge Middleware / layout guards.
- **Handling:** Seeded automatically by the 20240101000000_init_schema migration.

---

## Table: organization_members
A join table handling RBAC (Role-Based Access Control) by linking a user, an organization, and a specific permission role.

**Fields & Types:**
- organization_id (UUID, Composite Primary Key): References organizations(id).
- user_id (UUID, Composite Primary Key): References profiles(id).
- ole_id (UUID): References oles(id) (e.g., Admin, Manager).

**Interaction & Usage:**
- **Where it is used:** RLS (Row Level Security) policies use this table to determine permissions. For example, the Comments table checks if ole_id equals the Admin role to allow a user to delete another user's comment.
- **Handling:** Automatically assigned during signup by the handle_new_user_roles trigger if the user has an @herodoto.art email domain.

---

## Table: comments
Stores the discussion threads located at the bottom of the documentation pages.

**Fields & Types:**
- id (UUID, Primary Key): Unique comment ID.
- page_id (Text): The slug of the page the comment belongs to (e.g., 	ech-stack, database).
- uthor_id (UUID): References profiles(id).
- content (Text): The raw text of the comment.
- created_at (Timestampz): When it was posted.

**Interaction & Usage:**
- **Where it is used:** Rendered by the <Comments /> React Component at the bottom of every Next.js Office Documentation page.
- **Handling:** Users can insert their own comments. Admins can delete any comment (RLS policy). Realtime inserts are listened to by the client to instantly refresh the UI.

---

## Table: 
otifications
Powers the cross-platform notification bell, alerting users of events like being @mentioned.

**Fields & Types:**
- id (UUID, Primary Key): Unique alert ID.
- user_id (UUID): References profiles(id). The user *receiving* the alert.
- ctor_id (UUID): References profiles(id). The user who *triggered* the alert.
- comment_id (UUID): References comments(id). Uses ON DELETE CASCADE.
- message (Text): The text body (e.g., 'mentioned you in a comment').
- link (Text): Relative URL to navigate to when the notification is clicked.
- is_read (Boolean): Default alse. Becomes 	rue when viewed.
- created_at (Timestampz): Time of alert.

**Interaction & Usage:**
- **Where it is used:** Shown in the Web Office <NotificationBell /> and the Mobile App Notifications tab.
- **Handling:** Created programmatically by the React client when a comment is posted containing an @ match. 
- **Cascade Behavior:** If an Admin deletes the parent comment_id, Postgres automatically destroys the Notification row, instantly removing the unread badge from the tagged user's screen.$$),
('requirements', 'Project Requirements', $$

### 5. Comments & Tagging Engine
- [x] **Tagging System:** When writing comments, the user should be able to tag people using the `@` symbol followed by their name.
- [x] **Notification Routing:** People tagged in documentation comments should receive an instant notification in the work environment (Office Portal) and Mobile App.

### 6. Universal Notification Inbox
- [x] **Dedicated Area:** There should be a notifications area (inbox/dropdown) for each user.
- [x] **Visual Badging:** Notifications should be flagged in the home page header with a red badge containing a little number stating the amount of unclicked or unreviewed notifications.$$)
ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown, title = EXCLUDED.title;
