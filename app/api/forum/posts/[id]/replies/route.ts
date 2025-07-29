import { type NextRequest, NextResponse } from "next/server"

// Mock replies data
const mockReplies = [
  {
    id: "reply_1",
    content:
      "Async/await JavaScript-də Promise-lərlə işləməyi asanlaşdıran sintaksis şəkəridir. Async funksiya həmişə Promise qaytarır.",
    author: {
      id: "user_2",
      name: "Leyla Həsənova",
      avatar: "",
      role: "Müəllim",
    },
    created_at: "2025-01-29T10:30:00Z",
    likes: 5,
    is_accepted: true,
    images: [],
    user_liked: false,
    parent_id: null,
  },
  {
    id: "reply_2",
    content: "Çox gözəl izahat! Mən də əlavə edim ki, await yalnız async funksiya daxilində istifadə oluna bilər.",
    author: {
      id: "user_3",
      name: "Rəşad Quliyev",
      avatar: "",
      role: "Tələbə",
    },
    created_at: "2025-01-29T11:00:00Z",
    likes: 2,
    is_accepted: false,
    images: [],
    user_liked: false,
    parent_id: null,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Return mock replies for post
    return NextResponse.json(mockReplies)
  } catch (error) {
    console.error("Cavablar yükləmə xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
