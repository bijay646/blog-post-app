import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BlogPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ) => Promise<BlogPost>;
  updatePost: (id: number, post: Partial<BlogPost>) => Promise<BlogPost>;
  deletePost: (id: number) => Promise<void>;
  getPost: (id: number) => BlogPost | undefined;
  clearPosts: () => void;
}

// Mock posts data
const mockPosts: BlogPost[] = [];

let nextPostId = 3;

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: mockPosts,
      isLoading: false,
      error: null,

      fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch posts",
            isLoading: false,
          });
          throw error;
        }
      },

      createPost: async (post) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 400));

          const newPost: BlogPost = {
            ...post,
            id: nextPostId++,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            posts: [newPost, ...state.posts],
            isLoading: false,
          }));

          return newPost;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create post",
            isLoading: false,
          });
          throw error;
        }
      },

      updatePost: async (id, post) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 400));

          const updatedPost = {
            ...get().posts.find((p) => p.id === id)!,
            ...post,
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
            isLoading: false,
          }));

          return updatedPost;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update post",
            isLoading: false,
          });
          throw error;
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));

          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete post",
            isLoading: false,
          });
          throw error;
        }
      },

      getPost: (id) => {
        return get().posts.find((p) => p.id === id);
      },

      clearPosts: () => {
        set({ posts: mockPosts, isLoading: false, error: null });
      },
    }),
    {
      name: "posts-storage",
      partialize: (state) => ({ posts: state.posts }),
    }
  )
);
