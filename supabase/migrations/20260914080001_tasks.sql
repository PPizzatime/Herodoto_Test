DROP TABLE IF EXISTS public.tasks CASCADE;

CREATE TABLE public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    assignee_id uuid references public.profiles(id) on delete set null,
    status text check (status in ('TODO', 'IN_PROGRESS', 'COMPLETED')) default 'TODO',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update tasks" ON public.tasks FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete tasks" ON public.tasks FOR DELETE USING (auth.uid() IS NOT NULL);
