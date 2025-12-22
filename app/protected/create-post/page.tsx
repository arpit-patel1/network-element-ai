import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ModernEditor } from "@/components/modern-editor";

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

    const userId = formData.get("userId") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const content = formData.get("content") as string;
    const tagsJson = formData.get("tags") as string;
    const tags = tagsJson ? JSON.parse(tagsJson) : [];
    
    // Generate base slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const supabase = await createClient();
    
    // Check if slug exists and make it unique
    const { data: existingPost } = await supabase
      .from("posts")
      .select("slug")
      .eq("slug", slug)
      .single();
    
    if (existingPost) {
      // Append timestamp to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      subtitle: subtitle || null,
      content,
      slug,
      tags: tags,
      is_published: true, // Auto-publish on create
      author_id: userId,
      enhancement_status: 'enhancing', // Will be updated to 'enhanced' by webhook
    });

    if (error) {
      console.error("Error creating post:", error.message || error);
      return;
    }

    // Invalidate cache so the blog page shows fresh data
    revalidatePath("/blog");
    revalidatePath("/protected");
    redirect("/blog");
  }

  return (
    <div className="flex-1 w-full">
      <form action={createPost}>
        <input type="hidden" name="userId" value={user.id} />
        <ModernEditor
          titleName="title"
          subtitleName="subtitle"
          contentName="content"
          tagsName="tags"
        />
      </form>
    </div>
  );
}

