import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateJWT, isTokenExpired } from "./jwt"

export interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  setHydrated: () => void
}

// Mock user database
const mockUsers: Record<string, { id: number; email: string; name: string; password: string }> = {
  "demo@example.com": {
    id: 1,
    email: "demo@example.com",
    name: "Demo User",
    password: "password123",
  },
}

let nextUserId = 2

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true })
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

          const user = mockUsers[email]
          if (!user || user.password !== password) {
            throw new Error("Invalid email or password")
          }

          const token = generateJWT({
            id: user.id,
            email: user.email,
            name: user.name,
          })

          set({ user: { id: user.id, email: user.email, name: user.name }, token, isLoading: false })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Login failed", isLoading: false })
          throw error
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

          if (mockUsers[email]) {
            throw new Error("User already exists")
          }

          if (!email || !password || !name) {
            throw new Error("All fields are required")
          }

          const id = nextUserId++
          mockUsers[email] = { id, email, name, password }

          const token = generateJWT({
            id,
            email,
            name,
          })

          set({ user: { id, email, name }, token, isLoading: false })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Registration failed", isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null })
      },

      isAuthenticated: () => {
        const state = get()
        if (!state.token) return false

        return !isTokenExpired(state.token)
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && isTokenExpired(state.token)) {
            state.token = null
            state.user = null
          }
          state.setHydrated()
        }
      },
    },
  ),
)
