import { PostDetail } from "@/components/post-detail"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Post - Blog Platform",
  description: "Read blog post",
}

export default function PostPage() {
  return (
    <>
      <Navbar />
      <PostDetail />
    </>
  )
}
