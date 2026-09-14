-- 1. Guides Expansion
ALTER TABLE public.guides 
ADD COLUMN IF NOT EXISTS price numeric default 0,
ADD COLUMN IF NOT EXISTS discount_price numeric,
ADD COLUMN IF NOT EXISTS discount_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS points_reward integer default 100,
ADD COLUMN IF NOT EXISTS image_url text;

-- (Wait, the subagent for Add 5 guides used price, image_url. Let's make sure they are in guides or guide_versions)
