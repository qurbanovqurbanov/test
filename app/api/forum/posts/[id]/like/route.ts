import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    // Mock like/unlike logic
    const liked = Math.random() > 0.5 // Random for demo

    return NextResponse.json({
      success: true,
      liked,
      likes: liked ? 13 : 11,
    })
  } catch (error) {
    console.error("Bəyənmə xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
