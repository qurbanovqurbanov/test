import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const tags = formData.get("tags") as string

    // Validasiya
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Tələb olunan sahələr boş ola bilməz" }, { status: 400 })
    }

    // Şəkilləri işlə
    const images: string[] = []
    const imageFiles = formData.getAll("images") as File[]

    for (const file of imageFiles) {
      if (file.size > 0) {
        // Real tətbiqdə şəkil yükləmə xidməti istifadə ediləcək
        const imageUrl = `/uploads/${Date.now()}-${file.name}`
        images.push(imageUrl)
      }
    }

    // Post yaratma simulasiyası
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      images,
      author: {
        id: "user_1",
        name: "İstifadəçi",
        avatar: "",
        role: "Tələbə",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      likes: 0,
      replies: 0,
      is_solved: false,
      is_pinned: false,
      user_liked: false,
    }

    return NextResponse.json(newPost)
  } catch (error) {
    console.error("Post yaratma xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
