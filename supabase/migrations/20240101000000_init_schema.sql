-- Herodoto Initial Schema
-- Enforces Postgres extensions
create extension if not exists "uuid-ossp";

-- Core profiles table extending auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organizations
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text check (type in ('INTERNAL', 'EXTERNAL')) default 'INTERNAL',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Roles dictionary
create table public.roles (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

-- Permissions dictionary
create table public.permissions (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

-- Role permissions
create table public.role_permissions (
  role_id uuid references public.roles on delete cascade,
  permission_id uuid references public.permissions on delete cascade,
  primary key (role_id, permission_id)
);

-- Organization members (hierarchy)
create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role_id uuid references public.roles on delete restrict not null,
  level integer check (level >= 1 and level <= 10) default 1,
  supervisor_id uuid references public.profiles on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (organization_id, user_id)
);

-- Tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED')) default 'TODO',
  priority text check (priority in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) default 'MEDIUM',
  creator_id uuid references public.profiles on delete set null,
  assignee_id uuid references public.profiles on delete set null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Guides
create table public.guides (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  status text check (status in ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'BLOCKED', 'ERASED')) default 'DRAFT',
  created_by uuid references public.profiles on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guide Versions
create table public.guide_versions (
  id uuid default gen_random_uuid() primary key,
  guide_id uuid references public.guides on delete cascade not null,
  version_number integer not null,
  title text not null,
  description text,
  location_lat double precision,
  location_lng double precision,
  language text default 'en',
  mobile_layout jsonb default '[]'::jsonb,
  desktop_layout jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (guide_id, version_number)
);

-- Active Guide references
alter table public.guides add column active_version_id uuid references public.guide_versions on delete set null;

-- Gamification Profiles
create table public.gamification_profiles (
  user_id uuid references public.profiles on delete cascade primary key,
  points integer default 0,
  level integer default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions Tiers
create table public.subscription_tiers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price_monthly numeric,
  features jsonb default '[]'::jsonb
);

-- Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  tier_id uuid references public.subscription_tiers on delete restrict not null,
  status text check (status in ('ACTIVE', 'CANCELED', 'EXPIRED')) default 'ACTIVE',
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Promo Codes
create table public.promo_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  tier_id uuid references public.subscription_tiers on delete restrict not null,
  max_uses integer not null,
  current_uses integer default 0,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Logs
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references public.profiles on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  previous_state jsonb,
  new_state jsonb,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guide Erase Verdicts
create table public.guide_erase_verdicts (
  id uuid default gen_random_uuid() primary key,
  guide_id uuid references public.guides on delete cascade not null,
  actor_id uuid references public.profiles on delete set null,
  verdict_reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


