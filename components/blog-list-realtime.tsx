"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  slug: string;
  created_at: string;
  is_published: boolean;
  tags: string[] | null;
  author_id: string;
  enhancement_status?: 'enhancing' | 'enhanced' | 'none';
};

export function BlogListRealtime({ 
  initialPosts, 
  userId 
}: { 
  initialPosts: Post[]; 
  userId: string | undefined;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const supabase = createClient();
  
  console.log("🎨 BlogListRealtime rendering with", posts.length, "posts");

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          console.log("🔔 Post change detected:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            const newPost = payload.new as Post;
            // Only add if published or user is the author
            if (newPost.is_published || newPost.author_id === userId) {
              console.log("✅ Adding new post to list:", newPost.title);
              setPosts((current) => [newPost, ...current]);
              setLastUpdate(new Date());
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedPost = payload.new as Post;
            console.log("✅ Updating post in list:", updatedPost.title);
            setPosts((current) => {
              const postIndex = current.findIndex(p => p.id === updatedPost.id);
              console.log("📍 Found post at index:", postIndex);
              if (postIndex === -1) {
                console.log("⚠️ Post not found in current list, adding it");
                return [updatedPost, ...current];
              }
              const oldPost = current[postIndex];
              console.log("📝 Old post title:", oldPost.title);
              console.log("📝 New post title:", updatedPost.title);
              const newPosts = [
                ...current.slice(0, postIndex),
                updatedPost,
                ...current.slice(postIndex + 1)
              ];
              console.log("✨ Updated posts array length:", newPosts.length);
              return newPosts;
            });
            setLastUpdate(new Date());
          } else if (payload.eventType === "DELETE") {
            console.log("✅ Removing post from list");
            setPosts((current) =>
              current.filter((post) => post.id !== payload.old.id)
            );
            setLastUpdate(new Date());
          }
        }
      )
      .subscribe((status, err) => {
        console.log("📡 Realtime subscription status:", status);
        if (err) {
          console.error("❌ Realtime subscription error:", err);
        }
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to posts changes");
        }
      });

    return () => {
      console.log("🔌 Unsubscribing from posts changes");
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-accent/20">
        <p className="text-muted-foreground">No posts found yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {lastUpdate && (
        <div className="text-xs text-muted-foreground text-center py-2 bg-green-500/10 rounded border border-green-500/20">
          ✨ Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className={`hover:bg-accent/50 transition-colors ${!post.is_published ? 'border-dashed border-primary/50' : ''}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex flex-col gap-2 flex-1">
                <CardTitle>{post.title}</CardTitle>
                {post.subtitle && (
                  <p className="text-sm text-muted-foreground font-normal">
                    {post.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-muted-foreground text-xs">•</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {!post.is_published && (
                  <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap">
                    Draft
                  </div>
                )}
                {post.enhancement_status === 'enhancing' && (
                  <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                    <span className="animate-pulse">⚡</span>
                    Enhancing
                  </div>
                )}
                {post.enhancement_status === 'enhanced' && (
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                    ✨ Enhanced
                  </div>
                )}
              </div>
            </CardHeader>
            {!post.subtitle && (
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground text-sm">
                  {post.content.substring(0, 150)}...
                </p>
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

