-- Just a reminder, run this in Supabase:
create table posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  content text not null,
  slug text unique not null,
  author_id uuid references auth.users not null default auth.uid(),
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

