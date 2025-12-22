# My Playground - Personal Projects

A collection of personal projects and experiments built with Next.js, Supabase, and modern web technologies.

## 🚀 Projects

### Blog
A full-featured blog platform with:
- ✨ Full CRUD operations (Create, Read, Update, Delete)
- 🔒 Row Level Security (RLS) with Supabase
- 📝 Draft support for unpublished posts
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
  content text not null,
  slug text unique not null,
  author_id uuid references auth.users not null default auth.uid(),
  is_published boolean default false
);

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

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ using modern web technologies
