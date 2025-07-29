import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string
    const website = formData.get("website") as string
    const isPrivate = formData.get("is_private") === "true"
    const avatarFile = formData.get("avatar") as File | null

    // Validasiya
    if (!name) {
      return NextResponse.json({ error: "Ad tələb olunur" }, { status: 400 })
    }

    let avatarUrl = ""
    if (avatarFile && avatarFile.size > 0) {
      // Real tətbiqdə şəkil yükləmə xidməti istifadə ediləcək
      avatarUrl = `/uploads/avatars/${Date.now()}-${avatarFile.name}`
    }

    // Profil yeniləmə simulasiyası
    const updatedProfile = {
      id: "user_1",
      name,
      email: "user@example.com",
      avatar: avatarUrl || undefined,
      bio,
      location,
      website,
      is_private: isPrivate,
      role: "Tələbə",
      joined_date: "2024-01-15T00:00:00Z",
      stats: {
        quizzes_created: 5,
        quizzes_completed: 25,
        forum_posts: 12,
        total_score: 2150,
        average_score: 86,
        achievements: 8,
      },
      achievements: [],
      recent_activity: [],
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Profil yeniləmə xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
