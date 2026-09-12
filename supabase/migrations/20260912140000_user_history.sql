-- user_guide_history
create table public.user_guide_history (
  user_id uuid references public.profiles on delete cascade not null,
  guide_id uuid references public.guides on delete cascade not null,
  status text check (status in ('IN_PROGRESS', 'COMPLETED')) default 'IN_PROGRESS',
  last_poi_index integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, guide_id)
);

-- enable RLS
alter table public.user_guide_history enable row level security;

create policy "Users can view their own history"
  on public.user_guide_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own history"
  on public.user_guide_history for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own history"
  on public.user_guide_history for update
  using ( auth.uid() = user_id );

