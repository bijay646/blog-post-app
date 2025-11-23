"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Plus, Home } from "lucide-react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="font-semibold text-xl text-primary">
            Blog Platform
          </Link>

          {isAuthenticated && (
            <div className="flex gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/posts/create"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm border border-input bg-transparent text-foreground rounded-md hover:bg-accent transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm border border-input bg-transparent text-foreground rounded-md hover:bg-accent transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
