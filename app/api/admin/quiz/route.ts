import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    // Token doğrulama (real tətbiqdə JWT verify ediləcək)
    if (!token) {
      return NextResponse.json({ error: "Etibarsız token" }, { status: 401 })
    }

    const quizData = await request.json()

    // Validasiya
    if (!quizData.title || !quizData.description || !quizData.category) {
      return NextResponse.json({ error: "Tələb olunan sahələr boş ola bilməz" }, { status: 400 })
    }

    if (!quizData.questions || quizData.questions.length === 0) {
      return NextResponse.json({ error: "Ən azı bir sual əlavə edin" }, { status: 400 })
    }

    // Quiz yaratma simulasiyası
    const newQuiz = {
      id: Date.now().toString(),
      ...quizData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: "user_1", // Real tətbiqdə token-dan alınacaq
    }

    // Uğurlu cavab
    return NextResponse.json({
      message: "Test uğurla yaradıldı",
      quiz: newQuiz,
    })
  } catch (error) {
    console.error("Quiz yaratma xətası:", error)
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 })
  }
}
