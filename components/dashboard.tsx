"use client"

import { useEffect, useState } from "react"
import { usePosts } from "@/hooks/use-posts"
import { useAuth } from "@/hooks/use-auth"
import { PostCard } from "./post-card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function Dashboard() {
  const { posts, isLoading, error, fetchPosts, deletePost } = usePosts()
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "my-posts">("all")

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const filteredPosts = filter === "my-posts" ? posts.filter((post) => post.userId === user?.id) : posts

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
          </div>
          <Link
            href="/posts/create"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            New Post
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-transparent text-foreground hover:bg-accent"
            }`}
          >
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setFilter("my-posts")}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              filter === "my-posts"
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-transparent text-foreground hover:bg-accent"
            }`}
          >
            My Posts ({posts.filter((p) => p.userId === user?.id).length})
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {filter === "my-posts" ? "No posts yet. Create your first post!" : "No posts found."}
            </p>
            {filter === "my-posts" && (
              <Link
                href="/posts/create"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={deletePost} isOwner={post.userId === user?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
