import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Register - Blog Platform",
  description: "Create a new blog account",
}

export default function RegisterPage() {
  return <AuthForm mode="register" />
}
