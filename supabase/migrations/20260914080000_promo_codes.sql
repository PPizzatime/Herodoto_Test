-- Recreate promo_codes table to match the application's needs
DROP TABLE IF EXISTS public.promo_codes CASCADE;

CREATE TABLE public.promo_codes (
    id uuid default gen_random_uuid() primary key,
    code text not null unique,
    discount text not null,
    redemptions integer default 0 not null,
    max_redemptions integer not null default 100,
    expires_at timestamp with time zone,
    status text check (status in ('ACTIVE', 'EXPIRED', 'DISABLED')) default 'ACTIVE' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.promo_code_redemptions (
    id uuid default gen_random_uuid() primary key,
    promo_code_id uuid references public.promo_codes on delete cascade not null,
    user_id uuid references auth.users on delete cascade,
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Policies for promo_codes
CREATE POLICY "Promo codes are viewable by everyone" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Promo codes are insertable by authenticated users" ON public.promo_codes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Promo codes are updatable by authenticated users" ON public.promo_codes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Promo codes are deletable by authenticated users" ON public.promo_codes FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for promo_code_redemptions
CREATE POLICY "Redemptions viewable by everyone" ON public.promo_code_redemptions FOR SELECT USING (true);
CREATE POLICY "Redemptions insertable by authenticated users" ON public.promo_code_redemptions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
