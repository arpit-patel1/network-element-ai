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
  author?: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
};

export function BlogListRealtime({ 
  initialPosts, 
  userId 
}: { 
  initialPosts: Post[]; 
  userId: string | undefined;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = createClient();
  
  console.log("🎨 BlogListRealtime rendering with", posts.length, "posts");

  // Fetch fresh data on mount to ensure we have the latest posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      setIsRefreshing(true);
      try {
        let query = supabase
          .from("posts")
          .select(`
            *,
            author:users(id, name, avatar_url)
          `)
          .order("created_at", { ascending: false });

        if (userId) {
          query = query.or(`is_published.eq.true,author_id.eq.${userId}`);
        } else {
          query = query.eq("is_published", true);
        }

        const { data, error } = await query;
        
        if (!error && data) {
          console.log("🔄 Refreshed posts, found:", data.length);
          setPosts(data);
        }
      } catch (error) {
        console.error("❌ Error fetching latest posts:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchLatestPosts();
  }, [supabase, userId]);

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
          } else if (payload.eventType === "DELETE") {
            console.log("✅ Removing post from list");
            setPosts((current) =>
              current.filter((post) => post.id !== payload.old.id)
            );
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
    if (isRefreshing) {
      return (
        <div className="text-center py-12 border rounded-lg bg-accent/20">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      );
    }
    return (
      <div className="text-center py-12 border rounded-lg bg-accent/20">
        <p className="text-muted-foreground">No posts found yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className={`hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20 ${!post.is_published ? 'border-dashed border-purple-500/50' : ''}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex flex-col gap-2 flex-1">
                <CardTitle className="bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">{post.title}</CardTitle>
                {post.subtitle && (
                  <p className="text-sm text-muted-foreground font-normal">
                    {post.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  {post.author?.name && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        By {post.author.name}
                      </p>
                      <span className="text-muted-foreground text-xs">•</span>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-muted-foreground text-xs">•</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
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
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap border border-purple-300 dark:border-purple-700">
                    Draft
                  </div>
                )}
                {post.enhancement_status === 'enhancing' && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                    <span className="animate-pulse">⚡</span>
                    Enhancing
                  </div>
                )}
                {post.enhancement_status === 'enhanced' && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 border border-green-300 dark:border-green-700">
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

