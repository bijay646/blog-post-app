import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Login - Blog Platform",
  description: "Sign in to your blog account",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
