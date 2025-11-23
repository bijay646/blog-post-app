"use client"

import { useParams, useRouter } from "next/navigation"
import { usePosts } from "@/hooks/use-posts"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Loader2, ArrowLeft, Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function PostDetail() {
  const params = useParams()
  const router = useRouter()
  const { getPost, deletePost, isLoading } = usePosts()
  const { user } = useAuth()
  const post = getPost(Number(params?.id))

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading post...</p>
        </div>
      </div>
    )
  }

  const isOwner = post.userId === user?.id

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id)
        router.push("/dashboard")
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-3 py-1.5 text-sm bg-transparent text-foreground rounded-md hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-border space-y-4">
            <div>
              <h1 className="text-3xl font-semibold mb-3">{post.title}</h1>
              {post.category && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {post.category}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              {post.updatedAt !== post.createdAt && (
                <span>Edited {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}</span>
              )}
            </div>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg font-semibold text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>
            </div>

            {isOwner && (
              <div className="border-t pt-6 flex gap-3">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isLoading ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
