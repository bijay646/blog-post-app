import { useAuthStore } from "@/lib/auth-store"

export const useAuth = () => {
  const { user, token, isLoading, error, login, register, logout, isAuthenticated } = useAuthStore()

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticated(),
  }
}
