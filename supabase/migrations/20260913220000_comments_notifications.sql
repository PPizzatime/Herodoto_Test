-- Comments Table
create table public.comments (
    id uuid default gen_random_uuid() primary key,
    page_id text not null,
    author_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    actor_id uuid references public.profiles(id) on delete cascade not null,
    message text not null,
    link text,
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;
alter table public.notifications enable row level security;

-- Comments Policies
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can insert their own comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "Users can update their own comments" on public.comments for update using (auth.uid() = author_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = author_id);

-- Notifications Policies
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Anyone can insert notifications (for mentions)" on public.notifications for insert with check (true);
create policy "Users can update their own notifications (e.g., mark as read)" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete their own notifications" on public.notifications for delete using (auth.uid() = user_id);
