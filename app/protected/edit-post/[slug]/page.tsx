import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { MarkdownEditor } from "@/components/markdown-editor";
import { DeletePostButton } from "@/components/delete-post-button";

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

  async function deletePost() {
    "use server";

    const supabase = await createClient();
    
    // RLS policies will ensure only the author can delete
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error("Error deleting post:", error);
      return;
    }

    redirect("/blog");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
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
          <Label htmlFor="content">Content (Markdown supported)</Label>
          <MarkdownEditor name="content" defaultValue={post.content} required />
        </div>

        <div className="flex items-center gap-2">
          <FormCheckbox
            id="is_published"
            name="is_published"
            defaultChecked={post.is_published}
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

      <div className="border-t pt-6 mt-6">
        <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete a post, there is no going back. Please be certain.
        </p>
        <form action={deletePost}>
          <DeletePostButton showLabel={true} />
        </form>
      </div>
    </div>
  );
}

