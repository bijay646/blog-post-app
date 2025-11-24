"use client";

import type { BlogPost } from "@/lib/posts-store";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: BlogPost;
  onDelete?: (id: number) => Promise<void>;
  isOwner?: boolean;
}

export function PostCard({ post, onDelete, isOwner }: PostCardProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await onDelete?.(post.id);
    }
  };

  return (
    <div className="bg-green-600 text-white border border-border rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>
            {post.category && (
              <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {post.category}
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>
      <div className="px-6 py-4 space-y-4">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

        <div className="flex gap-2 pt-2">
          <Link
            href={`/posts/${post.id}`}
            className="flex-1 px-3 py-1.5 text-sm border border-input bg-transparent text-foreground rounded-md hover:bg-accent transition-colors text-center"
          >
            Read More
          </Link>
          {isOwner && (
            <>
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-3 py-1.5 text-sm border border-input bg-transparent text-foreground rounded-md hover:bg-accent transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm cursor-pointer border border-input bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
