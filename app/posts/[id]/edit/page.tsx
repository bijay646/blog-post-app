import { PostForm } from "@/components/post-form"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Edit Post - Blog Platform",
  description: "Edit your blog post",
}

export default function EditPostPage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <PostForm mode="edit" />
      </ProtectedRoute>
    </>
  )
}
