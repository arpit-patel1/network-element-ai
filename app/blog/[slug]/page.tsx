import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/delete-post-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:users(id, name, avatar_url)
    `)
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Double check visibility if the post is not published
  const { data: { user } } = await supabase.auth.getUser();
  if (!post.is_published && post.author_id !== user?.id) {
    notFound();
  }

  async function deletePost(formData: FormData) {
    "use server";

    const postId = formData.get("postId") as string;
    const supabase = await createClient();
    
    // RLS policies will ensure only the author can delete
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error);
      return;
    }

    // Invalidate cache
    revalidatePath("/blog");
    revalidatePath("/protected");
    redirect("/blog");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-3xl mx-auto py-12">
      <div className="flex justify-between items-center w-full">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>
        
        {post.author_id === user?.id && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950">
              <Link href={`/protected/edit-post/${post.slug}`} className="flex items-center gap-2">
                <EditIcon size={14} />
                Edit Post
              </Link>
            </Button>
            <form action={deletePost}>
              <input type="hidden" name="postId" value={post.id} />
              <DeletePostButton variant="destructive" size="sm" showLabel={true} />
            </form>
          </div>
        )}
      </div>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            <div className="flex items-center gap-2">
              {!post.is_published && (
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 text-xs uppercase font-bold px-2 py-1 rounded border border-purple-300 dark:border-purple-700">
                  Draft
                </span>
              )}
              {post.enhancement_status === 'enhancing' && (
                <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 text-xs uppercase font-bold px-2 py-1 rounded flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                  <span className="animate-pulse">⚡</span>
                  Enhancing
                </span>
              )}
              {post.enhancement_status === 'enhanced' && (
                <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 text-xs uppercase font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-300 dark:border-green-700">
                  ✨ Enhanced
                </span>
              )}
            </div>
          </div>
          
          {post.subtitle && (
            <p className="text-xl text-muted-foreground">
              {post.subtitle}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {post.author?.name && (
              <>
                <p className="text-sm text-muted-foreground">
                  By {post.author.name}
                </p>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <p className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
