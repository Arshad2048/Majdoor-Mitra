-- Role-Based Post Creation: Add new nullable columns to the posts table
-- Run this in your Supabase SQL Editor

ALTER TABLE posts ADD COLUMN IF NOT EXISTS experience text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS pay_type text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS availability text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS workers_needed integer;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS budget_min integer;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS budget_max integer;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS urgency text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS preferred_date date;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS time_slot text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS budget_note text;

-- Multi-image banner for profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner_images jsonb DEFAULT '[]'::jsonb;
