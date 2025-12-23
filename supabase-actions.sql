-- Just a reminder, run this in Supabase:

-- ============================================================================
-- USERS TABLE SETUP
-- ============================================================================

-- Create public.users table for custom user profiles
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Custom fields
  name text,
  avatar_url text,
  bio text
);

-- Enable RLS on users table
alter table public.users enable row level security;

-- RLS Policies for users
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.email
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- POSTS TABLE SETUP
-- ============================================================================

create table posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  content text not null,
  slug text unique not null,
  author_id uuid references public.users not null default auth.uid(),
  is_published boolean default false
);

alter table posts enable row level security;

create policy "Allow public read-only access to published posts"
  on posts for select
  using (is_published = true);

create policy "Allow authenticated users to create posts"
  on posts for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authors to update their own posts"
  on posts for update
  using (auth.uid() = author_id);





-- Migration: Add subtitle and tags to posts table
-- Run this in your Supabase SQL Editor

-- Add subtitle column (optional text field)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS subtitle text;

-- Add tags column (array of text, defaults to empty array)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create an index on tags for better query performance
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN (tags);

-- Optional: Add a comment to document the columns
COMMENT ON COLUMN posts.subtitle IS 'Optional subtitle/description for the post';
COMMENT ON COLUMN posts.tags IS 'Array of tags for categorizing and organizing posts';

-- Enable Realtime for live updates
-- This allows the UI to automatically reflect changes made by webhooks
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Add enhancement_status column to track AI enhancement progress
-- Run this in your Supabase SQL Editor
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS enhancement_status text DEFAULT 'enhancing'
CHECK (enhancement_status IN ('enhancing', 'enhanced', 'none'));

-- Optional: Add a comment to document the column
COMMENT ON COLUMN posts.enhancement_status IS 'Status of AI enhancement: enhancing (in progress), enhanced (completed), none (no enhancement needed)';

-- ============================================================================
-- MIGRATION FOR EXISTING POSTS TABLE
-- ============================================================================

-- Step 1: Populate public.users with existing auth.users
-- This creates user records for all existing auth users
INSERT INTO public.users (id, name)
SELECT id, COALESCE(raw_user_meta_data->>'name', email) as name
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop the old foreign key constraint that points to auth.users
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

-- Step 3: Add new foreign key constraint pointing to public.users
ALTER TABLE posts 
ADD CONSTRAINT posts_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

-- Verify the migration
-- Run this to check all posts have valid authors:
-- SELECT p.id, p.title, p.author_id, u.name 
-- FROM posts p 
-- LEFT JOIN public.users u ON p.author_id = u.id 
-- WHERE u.id IS NULL;
-- (Should return 0 rows)

