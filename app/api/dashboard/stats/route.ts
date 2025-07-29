import { type NextRequest, NextResponse } from "next/server"

// Mock data for dashboard stats
const mockStats = {
  totalQuizzes: 25,
  totalAttempts: 150,
  averageScore: 78.5,
  activeUsers: 45,
  recentQuizzes: [
    {
      id: "1",
      title: "JavaScript Temelleri",
      category: "Programlama",
      attempts: 25,
      averageScore: 82,
      createdAt: "2025-01-25T10:00:00Z",
    },
    {
      id: "2",
      title: "React Hooks",
      category: "Frontend",
      attempts: 18,
      averageScore: 75,
      createdAt: "2025-01-24T14:30:00Z",
    },
    {
      id: "3",
      title: "Database Tasarımı",
      category: "Backend",
      attempts: 12,
      averageScore: 88,
      createdAt: "2025-01-23T09:15:00Z",
    },
  ],
  recentAttempts: [
    {
      id: "1",
      quizTitle: "JavaScript Temelleri",
      score: 8,
      percentage: 80,
      attemptedAt: "2025-01-29T11:30:00Z",
    },
    {
      id: "2",
      quizTitle: "React Hooks",
      score: 7,
      percentage: 70,
      attemptedAt: "2025-01-29T10:15:00Z",
    },
    {
      id: "3",
      quizTitle: "CSS Grid Layout",
      score: 9,
      percentage: 90,
      attemptedAt: "2025-01-28T16:45:00Z",
    },
    {
      id: "4",
      quizTitle: "Node.js Basics",
      score: 6,
      percentage: 60,
      attemptedAt: "2025-01-28T14:20:00Z",
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Token gerekli" }, { status: 401 })
    }

    // In a real app, you would validate the token and get user-specific data
    // For now, return mock data
    return NextResponse.json(mockStats)
  } catch (error) {
    return NextResponse.json({ detail: "Sunucu hatası" }, { status: 500 })
  }
}
