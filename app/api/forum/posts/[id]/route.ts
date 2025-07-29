import { type NextRequest, NextResponse } from "next/server"

// Mock forum post data
const mockPost = {
  id: "1",
  title: "JavaScript-də Async/Await necə işləyir?",
  content: "Salam, JavaScript-də async/await konsepsiyasını başa düşməkdə çətinlik çəkirəm. Kimsə izah edə bilər?",
  author: {
    id: "user_1",
    name: "Əli Məmmədov",
    avatar: "",
    role: "Tələbə",
  },
  category: "Proqramlaşdırma",
  tags: ["javascript", "async", "await"],
  created_at: "2025-01-29T10:00:00Z",
  updated_at: "2025-01-29T10:00:00Z",
  views: 45,
  likes: 12,
  replies: 8,
  is_solved: false,
  is_pinned: false,
  images: [],
  user_liked: false,
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Simulate database lookup
    if (params.id === "1") {
      return NextResponse.json(mockPost)
    }

    return NextResponse.json({ error: "Post tapılmadı" }, { status: 404 })
  } catch (error) {
    console.error("Post yükləmə xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
