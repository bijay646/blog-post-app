"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "register"
}

interface FormErrors {
  email?: string
  password?: string
  name?: string
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password123")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const { login, register, isLoading, error } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Name validation for register
    if (mode === "register") {
      if (!name.trim()) {
        newErrors.name = "Name is required"
      } else if (name.length < 2) {
        newErrors.name = "Name must be at least 2 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(email, password, name)
      }
      router.push("/dashboard")
    } catch (err) {
      // Error is handled by the store and displayed below
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm">
        <div className="px-6 py-6 border-b border-border space-y-1">
          <h2 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to your blog account" : "Join our blogging community today"}
          </p>
        </div>
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-3 items-start">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                placeholder="you@example.com"
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-destructive" : "border-input"
                }`}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? "border-destructive" : "border-input"
                }`}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <a href="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </a>
              </>
            )}
          </div>

          {mode === "login" && (
            <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
              <p className="font-medium mb-1">Demo credentials:</p>
              <p>Email: demo@example.com</p>
              <p>Password: password123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
