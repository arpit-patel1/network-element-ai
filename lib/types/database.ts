// Database types for Supabase tables

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  slug: string;
  author_id: string;
  is_published: boolean;
  subtitle?: string | null;
  tags?: string[];
  enhancement_status?: 'enhancing' | 'enhanced' | 'none';
}

// Type for post with author information joined
export interface PostWithAuthor extends Post {
  author: User;
}

