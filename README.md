# My Playground - Personal Projects

A collection of personal projects and experiments built with Next.js, Supabase, and modern web technologies.

## 🚀 Projects

### Blog
A full-featured blog platform with:
- ✨ Full CRUD operations (Create, Read, Update, Delete)
- 🔒 Row Level Security (RLS) with Supabase
- 📝 Modern rich text editor with formatting toolbar
- 🏷️ Subtitle and tag support for better organization
- ✍️ Real-time markdown preview
- 🎨 Beautiful UI with shadcn/ui components
- 👤 User authentication and authorization

### Todo App (Coming Soon)
Task management application with categories, priorities, and real-time updates.

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service (Auth + Database)
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Lucide Icons** - Icon library

## 🏗️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your Supabase project and add environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Database Setup

Run the following SQL in your Supabase SQL Editor to set up the blog:

```sql
-- Create the posts table
create table posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  subtitle text,
  content text not null,
  slug text unique not null,
  tags text[] default '{}',
  author_id uuid references auth.users not null default auth.uid(),
  is_published boolean default false
);

-- Create an index on tags for better query performance
create index posts_tags_idx on posts using gin (tags);

-- Enable RLS
alter table posts enable row level security;

-- Policies
create policy "Allow users to read published posts OR their own drafts"
  on posts for select
  using (
    is_published = true 
    OR 
    (auth.uid() = author_id)
  );

create policy "Allow authenticated users to create posts"
  on posts for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authors to update their own posts"
  on posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Allow authors to delete their own posts"
  on posts for delete
  using (auth.uid() = author_id);
```

### Migrating Existing Database

If you already have a posts table, run the migration script:

```bash
# Run the SQL commands in supabase-migration.sql in your Supabase SQL Editor
```

## 📝 Features

- **Authentication**: Sign up, login, and logout with Supabase Auth
- **Blog Management**: Create, edit, and delete blog posts
- **Draft Mode**: Save posts as drafts before publishing
- **Responsive Design**: Mobile-friendly UI
- **Dark Mode**: System-based theme switching
- **SEO Friendly**: Metadata and OpenGraph support

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

### Environment variables

Configure these both locally (in `.env.local`) and on Vercel (Project Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase project keys.
- `N8N_READING_WEBHOOK_URL` — the n8n webhook URL that returns the reading comprehension payload.
- `N8N_API_KEY` — the `x-api-key` header value required by the webhook (shared across n8n workflows).

### Reading comprehension webhook schema

Provide this JSON Schema to n8n/agents so responses match what the API expects. The API also accepts a wrapped `{ "data": { ... } }` version and normalizes it for the UI.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ReadingComprehensionQuestion",
  "type": "object",
  "required": ["paragraph", "question", "choices", "correctAnswer"],
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1,
      "description": "Optional identifier for the question"
    },
    "paragraph": {
      "type": "string",
      "minLength": 1,
      "description": "paragraph text the student must read"
    },
    "question": {
      "type": "string",
      "minLength": 1,
      "description": "Question about the paragraph"
    },
    "choices": {
      "type": "object",
      "required": ["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"],
      "properties": {
        "ChoiceA": { "type": "string", "minLength": 1 },
        "ChoiceB": { "type": "string", "minLength": 1 },
        "ChoiceC": { "type": "string", "minLength": 1 },
        "ChoiceD": { "type": "string", "minLength": 1 }
      },
      "additionalProperties": false,
      "description": "Four answer choices"
    },
    "correctAnswer": {
      "type": "string",
      "enum": ["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"],
      "description": "Key name of the correct choice"
    }
  },
  "additionalProperties": false
}
```

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ by Daddy
