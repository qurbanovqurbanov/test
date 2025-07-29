import { type NextRequest, NextResponse } from "next/server"

// Mock user database (in real app, this would be a proper database)
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

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ detail: "Bütün sahələr tələb olunur" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ detail: "Şifrə ən azı 6 simvol olmalıdır" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ detail: "Bu email adresi zaten kayıtlı" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email,
      password, // In real app, this would be hashed
      name,
      role: "user" as const,
      is_active: true,
      created_at: new Date().toISOString(),
      is_private: false,
      follower_count: 0,
      following_count: 0,
    }

    users.push(newUser)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Qeydiyyat xətası:", error)
    return NextResponse.json({ detail: "Sunucu hatası" }, { status: 500 })
  }
}
