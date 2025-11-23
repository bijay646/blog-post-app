import { PostForm } from "@/components/post-form"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Create Post - Blog Platform",
  description: "Create a new blog post",
}

export default function CreatePostPage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <PostForm mode="create" />
      </ProtectedRoute>
    </>
  )
}
