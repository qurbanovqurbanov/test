import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    const formData = await request.formData()
    const content = formData.get("content") as string
    const postId = formData.get("post_id") as string
    const parentId = formData.get("parent_id") as string | null

    // Validasiya
    if (!content || !postId) {
      return NextResponse.json({ error: "Məzmun və post ID tələb olunur" }, { status: 400 })
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

    // Cavab yaratma simulasiyası
    const newReply = {
      id: Date.now().toString(),
      content,
      images,
      author: {
        id: "user_1",
        name: "İstifadəçi",
        avatar: "",
        role: "Tələbə",
      },
      created_at: new Date().toISOString(),
      likes: 0,
      is_accepted: false,
      user_liked: false,
      parent_id: parentId,
    }

    return NextResponse.json(newReply)
  } catch (error) {
    console.error("Cavab yaratma xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
