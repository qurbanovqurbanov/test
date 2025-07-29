import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "admin@squiz.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    is_private: false,
    follower_count: 0,
    following_count: 0,
  },
  {
    id: "2",
    email: "user@squiz.com",
    password: "user123",
    name: "Test User",
    role: "user",
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    is_private: false,
    follower_count: 5,
    following_count: 10,
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Token gerekli" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Extract user ID from mock token
    const userId = token.split("-")[3]

    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ detail: "Geçersiz token" }, { status: 401 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ detail: "Sunucu hatası" }, { status: 500 })
  }
}
