# Herodoto Database Architecture

This document details the PostgreSQL schema and interaction models for the Herodoto platform, hosted on Supabase.

## Table: profiles
The central table for all user demographic data. It maps 1-to-1 with Supabase's internal `auth.users` table.

**Fields & Types:**
- `id` (UUID, Primary Key): Mirrors `auth.users(id)`.
- `first_name` (Text): The user's first name.
- `last_name` (Text): The user's last name.
- `avatar_url` (Text): URL to the user's profile picture.
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
- `page_id` (Text): The slug of the document being commented on (e.g., 'architecture').
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
- `type` (Text): e.g., 'mention', 'system_alert'.
- `message` (Text): The display text (e.g., 'tagged you in a comment').
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
- `status` (Text): e.g., 'in_progress', 'completed'.
- `progress` (Integer): Percentage of completion (0-100).
- `last_accessed` (Timestampz): Used to sort recent guides on the mobile app.

**Interaction & Usage:**
- **Where it is used:** Displayed on the Consumer Profile screen to show progress bars and recently visited locations.

---

## Table: gamification_profiles
Stores persistent user levels and gamification points.

**Fields & Types:**
- `user_id` (UUID, Primary Key): Foreign key to profiles.
- `points_balance` (Integer): Currently available points.
- `total_earned` (Integer): Lifetime points earned.
- `level` (Integer): Current player level.

**Interaction & Usage:**
- **Where it is used:** Displayed on the Consumer Profile screen.
