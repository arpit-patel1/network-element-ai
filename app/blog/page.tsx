import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function BlogPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select("*")
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
            Welcome to our blog. Check out our latest posts below.
          </p>
        </div>
        <Button asChild>
          <Link href="/protected/create-post" className="flex items-center gap-2">
            <PlusIcon size={16} />
            Create Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-accent/20">
            <p className="text-muted-foreground">No posts found yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className={`hover:bg-accent/50 transition-colors ${!post.is_published ? 'border-dashed border-primary/50' : ''}`}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!post.is_published && (
                    <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded">
                      Draft
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-muted-foreground">
                    {post.content.substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
