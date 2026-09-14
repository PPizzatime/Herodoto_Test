# Herodoto Database Architecture

This document details the PostgreSQL schema and interaction models for the Herodoto platform, hosted on Supabase.

## Global Database Standards
- **Timestamps**: All relevant tables utilize an `updated_at` column which is automatically kept up-to-date by the `update_modified_column` trigger function.
- **Soft Deletes**: Critical data (like users, profiles, and organization_members) use a `deleted_at` timestamp rather than permanent deletion to preserve historical data and avoid broken foreign key constraints.
- **Indexes**: All foreign keys have corresponding B-Tree indexes for optimal JOIN performance.

## Table: profiles
The central table for all user demographic data. It maps 1-to-1 with Supabase's internal `auth.users` table.

**Fields & Types:**
- `id` (UUID, Primary Key): Mirrors `auth.users(id)`.
- `first_name` (Text): The user's first name.
- `last_name` (Text): The user's last name.
- `avatar_url` (Text): URL to the user's profile picture.
- `updated_at` (Timestampz): Last profile update.
- `deleted_at` (Timestampz): Soft delete timestamp.

**Interaction & Usage:**
- **Where it is used:** Displaying user names in the Office Portal, rendering avatars, mentions, and org charts.
- **Handling:** Automatically populated upon sign up. Soft deletable.

## Table: organizations
Stores organizational tenants. Supports both internal Herodoto operations and external customer groups.

**Fields & Types:**
- `id` (UUID, Primary Key): Unique identifier.
- `name` (Text): Display name of the organization.
- `type` (Text): Determines org capabilities (INTERNAL or CUSTOMER).
- `created_at` (Timestampz): Creation date.
- `updated_at` (Timestampz): Last update.
- `deleted_at` (Timestampz): Soft delete timestamp.

## Table: roles & permissions
A many-to-many relationship defining the RBAC engine.

**Fields & Types:**
- `roles` Table: Contains `id` and `name` (e.g., "Admin", "Manager", "Employee", "Consumer").
- `permissions` Table: Contains granular flags like `organization.view`, `guides.edit`.
- `role_permissions` Table: Maps which roles have which permissions.

## Table: organization_members
Connects users to organizations, assigning them roles and supervisors (for HR hierarchy).

**Fields & Types:**
- `organization_id` (UUID): The organization.
- `user_id` (UUID): The user.
- `role_id` (UUID): The RBAC role.
- `level` (Integer): The depth in the hierarchy.
- `supervisor_id` (UUID): Reports to whom.
- `updated_at` (Timestampz)
- `deleted_at` (Timestampz)

## Table: guides
The primary content structure for the Herodoto tourism experience.

**Fields & Types:**
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `latitude` / `longitude` (Float)
- `location_name` (Text)
- `category` (Text)
- `updated_at` (Timestampz)

## Table: guide_images
Stores multiple images associated with a specific guide.

**Fields & Types:**
- `id` (UUID, Primary Key)
- `guide_id` (UUID): Foreign key to guides.
- `image_url` (Text): Public URL of the image.
- `caption` (Text): Description of the image.
- `is_primary` (Boolean): Defines if this is the main image for the guide.
- `user_uploaded` (Boolean): Defines if this was uploaded by a consumer vs an admin.

## Table: user_guide_history
Tracks Consumer interaction with tourist guides for gamification.

**Fields & Types:**
- `id` (UUID): Unique history ID.
- `user_id` (UUID): Foreign key to the consumer.
- `guide_id` (UUID): Foreign key to the guide explored.
- `status` (Text): e.g., 'in_progress', 'completed'.
- `progress` (Integer): Percentage of completion (0-100).
- `last_accessed` (Timestampz): Used to sort recent guides.
- `updated_at` (Timestampz)

## Table: gamification_profiles
Stores persistent user levels and gamification points.

**Fields & Types:**
- `user_id` (UUID, Primary Key): Foreign key to profiles.
- `points_balance` (Integer): Currently available points.
- `total_earned` (Integer): Lifetime points earned.
- `level` (Integer): Current player level.
- `updated_at` (Timestampz)
