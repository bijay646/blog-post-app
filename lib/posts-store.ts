import { create } from "zustand"

export interface BlogPost {
  id: number
  userId: number
  title: string
  content: string
  excerpt: string
  category?: string
  createdAt: string
  updatedAt: string
}

interface PostsState {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
  createPost: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => Promise<BlogPost>
  updatePost: (id: number, post: Partial<BlogPost>) => Promise<BlogPost>
  deletePost: (id: number) => Promise<void>
  getPost: (id: number) => BlogPost | undefined
}

// Mock posts data
const mockPosts: BlogPost[] = [
  {
    id: 1,
    userId: 1,
    title: "Getting Started with React",
    excerpt: "Learn the basics of React and start building amazing web applications.",
    content: "React is a JavaScript library for building user interfaces...",
    category: "React",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    title: "Next.js Best Practices",
    excerpt: "Master Next.js with these proven best practices and patterns.",
    content: "Next.js is a React framework that enables production applications...",
    category: "Next.js",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
]

let nextPostId = 3

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: mockPosts,
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
      set({ isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch posts", isLoading: false })
      throw error
    }
  },

  createPost: async (post) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)) // Simulate API call

      const newPost: BlogPost = {
        ...post,
        id: nextPostId++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }))

      return newPost
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create post", isLoading: false })
      throw error
    }
  },

  updatePost: async (id, post) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)) // Simulate API call

      const updatedPost = {
        ...get().posts.find((p) => p.id === id)!,
        ...post,
        updatedAt: new Date().toISOString(),
      }

      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        isLoading: false,
      }))

      return updatedPost
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update post", isLoading: false })
      throw error
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete post", isLoading: false })
      throw error
    }
  },

  getPost: (id) => {
    return get().posts.find((p) => p.id === id)
  },
}))
