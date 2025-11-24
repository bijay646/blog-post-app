"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useParams } from "next/navigation";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface PostFormProps {
  mode: "create" | "edit";
}

interface FormErrors {
  title?: string;
  excerpt?: string;
  content?: string;
}

const CATEGORIES = [
  "Sustainable Farming",
  "Crop Production",
  "Pest Control",
  "Agribusiness & Markets",
  "Irrigation",
];

export function PostForm({ mode }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Other");
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { createPost, updatePost, getPost, isLoading, error } = usePosts();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (mode === "edit" && params?.id) {
      const post = getPost(Number(params.id));
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCategory(post.category || "Other");
      }
    }
  }, [mode, params, getPost]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    } else if (excerpt.length < 10) {
      newErrors.excerpt = "Excerpt must be at least 10 characters";
    } else if (excerpt.length > 500) {
      newErrors.excerpt = "Excerpt must be less than 500 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting post with data:", {
        title,
        excerpt,
        content,
        category,
        userId: user?.id,
      });

      if (mode === "create") {
        await createPost({
          userId: user?.id || 0,
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
        });
        setSuccessMessage("Post created successfully!");
      } else {
        await updatePost(Number(params?.id), {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
        });
        setSuccessMessage("Post updated successfully!");
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.log("[Error submitting post:", err);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {mode === "create" ? "Publishing..." : "Updating..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-border">
            <h2 className="text-2xl font-semibold">
              {mode === "create" ? "Create new post" : "Edit post"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "create"
                ? "Write and publish your blog post"
                : "Update your blog post"}
            </p>
          </div>
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-3 items-start">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md flex gap-3 items-start dark:bg-green-950 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5 dark:text-green-400" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {successMessage}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Title{" "}
                  {title.length > 0 && (
                    <span className="text-muted-foreground">
                      ({title.length}/200)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="Enter post title"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.title ? "border-destructive" : "border-input"
                  }`}
                  maxLength={200}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Excerpt{" "}
                  {excerpt.length > 0 && (
                    <span className="text-muted-foreground">
                      ({excerpt.length}/500)
                    </span>
                  )}
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (errors.excerpt)
                      setErrors({ ...errors, excerpt: undefined });
                  }}
                  placeholder="Brief summary of your post (10-500 characters)"
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                    errors.excerpt ? "border-destructive" : "border-input"
                  }`}
                  maxLength={500}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Content{" "}
                  {content.length > 0 && (
                    <span className="text-muted-foreground">
                      ({content.length})
                    </span>
                  )}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content)
                      setErrors({ ...errors, content: undefined });
                  }}
                  placeholder="Write your blog post content here... (minimum 50 characters)"
                  rows={10}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm ${
                    errors.content ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || successMessage !== ""}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || isLoading
                    ? "Saving..."
                    : mode === "create"
                    ? "Publish post"
                    : "Update post"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-input bg-background text-foreground rounded-md font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
