import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateJWT, isTokenExpired } from "./jwt";
import { usePostsStore } from "./posts-store";

export interface User {
  id: number;
  email: string;
  name: string;
}

interface UsersDatabase {
  users: Record<
    string,
    { id: number; email: string; name: string; password: string }
  >;
  nextUserId: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  setHydrated: () => void;
}

const getOrInitializeUsersDB = (): UsersDatabase => {
  if (typeof window === "undefined") {
    return {
      users: {
        "test1@demo.com": {
          id: 1,
          email: "test1@demo.com",
          name: "Demo User",
          password: "test123",
        },
      },
      nextUserId: 2,
    };
  }

  const stored = localStorage.getItem("users-database");
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultDB: UsersDatabase = {
    users: {
      "test1@demo.com": {
        id: 1,
        email: "test1@demo.com",
        name: "Demo User",
        password: "test123",
      },
    },
    nextUserId: 2,
  };

  localStorage.setItem("users-database", JSON.stringify(defaultDB));
  return defaultDB;
};

const saveUsersDB = (db: UsersDatabase): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users-database", JSON.stringify(db));
  }
};

let usersDB = getOrInitializeUsersDB();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          usersDB = getOrInitializeUsersDB();
          const user = usersDB.users[email];
          if (!user || user.password !== password) {
            throw new Error("Invalid email or password");
          }

          const token = generateJWT({
            id: user.id,
            email: user.email,
            name: user.name,
          });

          set({
            user: { id: user.id, email: user.email, name: user.name },
            token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          usersDB = getOrInitializeUsersDB();

          if (usersDB.users[email]) {
            throw new Error("User already exists");
          }

          if (!email || !password || !name) {
            throw new Error("All fields are required");
          }

          const id = usersDB.nextUserId++;
          usersDB.users[email] = { id, email, name, password };

          saveUsersDB(usersDB);

          const token = generateJWT({
            id,
            email,
            name,
          });

          set({ user: { id, email, name }, token, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        usePostsStore.getState();
      },

      isAuthenticated: () => {
        const state = get();
        if (!state.token) return false;

        return !isTokenExpired(state.token);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && isTokenExpired(state.token)) {
            state.token = null;
            state.user = null;
          }
          state.setHydrated();
        }
      },
    }
  )
);
