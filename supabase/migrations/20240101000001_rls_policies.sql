-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organization_members enable row level security;
alter table public.tasks enable row level security;
alter table public.guides enable row level security;
alter table public.guide_versions enable row level security;
alter table public.gamification_profiles enable row level security;
alter table public.subscription_tiers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.promo_codes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.guide_erase_verdicts enable row level security;

-- Utility Functions for Permissions --

create or replace function public.has_permission(required_permission text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from role_permissions rp
    join permissions p on rp.permission_id = p.id
    join organization_members om on om.role_id = rp.role_id
    where om.user_id = auth.uid()
      and p.name = required_permission
  );
$$;

create or replace function public.is_supervisor(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    with recursive hierarchy as (
      select user_id, supervisor_id
      from organization_members
      where user_id = target_user_id
      union all
      select om.user_id, om.supervisor_id
      from organization_members om
      join hierarchy h on om.user_id = h.supervisor_id
    )
    select 1 from hierarchy where supervisor_id = auth.uid()
  );
$$;

-- RLS Policies --

-- Profiles: Anyone can view profiles, users can update their own
create policy "Profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Organizations: Viewable by members or if external
create policy "Organizations viewable by members." on public.organizations for select using (
  exists (select 1 from organization_members where organization_id = id and user_id = auth.uid())
);

-- Guides:
-- Viewable if published, or if user has guides.view internal permission
create policy "Guides viewable if published." on public.guides for select using (
  status = 'PUBLISHED' or public.has_permission('guides.view')
);
-- Create if has guides.create
create policy "Can create guides if authorized." on public.guides for insert with check (
  public.has_permission('guides.create')
);
-- Update if has guides.edit
create policy "Can update guides if authorized." on public.guides for update using (
  public.has_permission('guides.edit')
);

-- Guide Versions: Inherits logic essentially
create policy "Guide versions viewable if published." on public.guide_versions for select using (
  exists (select 1 from guides g where g.id = guide_id and (g.status = 'PUBLISHED' or public.has_permission('guides.view')))
);

-- Tasks:
-- Viewable if assigned to you, created by you, or you are a supervisor
create policy "Tasks viewable by assignee, creator, or supervisor." on public.tasks for select using (
  assignee_id = auth.uid() or creator_id = auth.uid() or public.is_supervisor(assignee_id)
);
-- Create if has tasks.create
create policy "Can create tasks." on public.tasks for insert with check (
  public.has_permission('tasks.create')
);
-- Update if assigned (can update status), or if creator/supervisor
create policy "Can update tasks." on public.tasks for update using (
  assignee_id = auth.uid() or creator_id = auth.uid() or public.is_supervisor(assignee_id)
);

-- Audit logs: Viewable only with specific permission, no manual inserts/updates/deletes
create policy "Audit logs viewable by authorized users." on public.audit_logs for select using (
  public.has_permission('audit_logs.view')
);

-- Organization Members: viewable by authorized or if same org
create policy "Org members viewable." on public.organization_members for select using (
  public.has_permission('organization.view') or organization_id in (select organization_id from organization_members where user_id = auth.uid())
);

