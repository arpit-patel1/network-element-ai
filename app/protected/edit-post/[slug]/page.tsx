import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ModernEditor } from "@/components/modern-editor";

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
    const subtitle = formData.get("subtitle") as string;
    const content = formData.get("content") as string;
    const tagsJson = formData.get("tags") as string;
    const tags = tagsJson ? JSON.parse(tagsJson) : [];
    
    // Validate required fields
    if (!title || !content) {
      console.error("Title and content are required");
      return { error: "Title and content are required" };
    }
    
    // Optional: Update slug if title changes, but often better to keep original slug for SEO
    // For now we keep the same slug to avoid breaking links

    const supabase = await createClient();
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        subtitle: subtitle || null,
        content,
        tags: tags,
        is_published: true, // Auto-publish on update
        enhancement_status: 'enhancing', // Reset to enhancing when manually edited
      })
      .eq("id", post.id);

    if (error) {
      console.error("Error updating post:", error);
      return { error: error.message };
    }

    // Invalidate cache so pages show fresh data
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/protected");
    redirect(`/blog/${post.slug}`);
  }

  return (
    <div className="flex-1 w-full">
      <form action={updatePost}>
        <ModernEditor
          titleName="title"
          subtitleName="subtitle"
          contentName="content"
          tagsName="tags"
          defaultTitle={post.title}
          defaultSubtitle={post.subtitle || ""}
          defaultContent={post.content}
          defaultTags={post.tags || []}
        />
      </form>
    </div>
  );
}

