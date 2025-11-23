import { usePostsStore } from "@/lib/posts-store"

export const usePosts = () => {
  const { posts, isLoading, error, fetchPosts, createPost, updatePost, deletePost, getPost } = usePostsStore()

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPost,
  }
}
