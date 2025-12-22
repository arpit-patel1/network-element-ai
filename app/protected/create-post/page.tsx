import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { MarkdownEditor } from "@/components/markdown-editor";

export default async function CreatePostPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isPublished = formData.get("is_published") === "on";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const supabase = await createClient();
    const { error } = await supabase.from("posts").insert({
      title,
      content,
      slug,
      is_published: isPublished,
      author_id: user?.id,
    });

    if (error) {
      console.error("Error creating post:", error.message || error);
      return;
    }

    redirect("/blog");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">
          Write something amazing and share it with the world.
        </p>
      </div>

      <form action={createPost} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content (Markdown supported)</Label>
          <MarkdownEditor name="content" required />
        </div>

        <div className="flex items-center gap-2">
          <FormCheckbox
            id="is_published"
            name="is_published"
          />
          <Label htmlFor="is_published">Publish immediately</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Create Post</Button>
          <Button variant="outline" asChild>
            <a href="/protected">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  );
}

