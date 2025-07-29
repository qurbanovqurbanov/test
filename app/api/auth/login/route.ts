import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "admin@squiz.com",
    password: "admin123", // In real app, this would be hashed
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ detail: "Geçersiz email veya şifre" }, { status: 401 })
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ detail: "Sunucu hatası" }, { status: 500 })
  }
}
