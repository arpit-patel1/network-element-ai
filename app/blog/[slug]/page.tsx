import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/protected/edit-post/${post.slug}`} className="flex items-center gap-2">
              <EditIcon size={14} />
              Edit Post
            </Link>
          </Button>
        )}
      </div>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {post.title}
            </h1>
            {!post.is_published && (
              <span className="bg-primary/10 text-primary text-xs uppercase font-bold px-2 py-1 rounded">
                Draft
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            Published on {new Date(post.created_at).toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph: string, index: number) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
