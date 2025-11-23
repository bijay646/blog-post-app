import { Dashboard } from "@/components/dashboard"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Dashboard - Blog Platform",
  description: "View and manage your blog posts",
}

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </>
  )
}
