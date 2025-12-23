import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { BlogListRealtime } from "@/components/blog-list-realtime";

export default async function BlogPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select(`
      *,
      author:users(id, name, avatar_url)
    `)
    .order("created_at", { ascending: false });

  if (user) {
    // Show posts that are EITHER published OR authored by the current user
    query = query.or(`is_published.eq.true,author_id.eq.${user.id}`);
  } else {
    // Only show published posts for guests
    query = query.eq("is_published", true);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="text-center py-12 border rounded-lg bg-destructive/10">
        <p className="text-destructive">Error loading posts. Please make sure the database table exists.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto py-12">
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
           ✍️ Write and publish your blog posts, with a AI Powered Editor ✨
          </p>
        </div>
        <Button asChild>
          <Link href="/protected/create-post" className="flex items-center gap-2">
            <PlusIcon size={16} />
            Create Post
          </Link>
        </Button>
      </div>

      <BlogListRealtime initialPosts={posts || []} userId={user?.id} />
    </div>
  );
}
