import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Only the author can edit
  if (post.author_id !== user.id) {
    redirect("/blog");
  }

  async function updatePost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isPublished = formData.get("is_published") === "on";
    
    // Optional: Update slug if title changes, but often better to keep original slug for SEO
    // For now we keep the same slug to avoid breaking links

    const supabase = await createClient();
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        is_published: isPublished,
      })
      .eq("id", post.id);

    if (error) {
      console.error("Error updating post:", error);
      return;
    }

    redirect(`/blog/${post.slug}`);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-2xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">
          Update your thoughts and share them again.
        </p>
      </div>

      <form action={updatePost} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={post.title}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={post.content}
            className="min-h-[300px]"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={post.is_published}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="is_published">Published</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Update Post</Button>
          <Button variant="outline" asChild>
            <a href={`/blog/${post.slug}`}>Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  );
}

