"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Plus,
  BarChart3,
  Users,
  TrendingUp,
  Target,
  MessageSquare,
  Calendar,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Link from "next/link"

interface DashboardStats {
  totalQuizzes: number
  totalAttempts: number
  averageScore: number
  activeUsers: number
  weeklyGrowth: number
  monthlyGrowth: number
  recentQuizzes: Array<{
    id: string
    title: string
    category: string
    attempts: number
    averageScore: number
    createdAt: string
    difficulty: "easy" | "medium" | "hard"
  }>
  recentAttempts: Array<{
    id: string
    quizTitle: string
    score: number
    percentage: number
    attemptedAt: string
    timeSpent: number
  }>
  topCategories: Array<{
    name: string
    quizCount: number
    attempts: number
    averageScore: number
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const quickStats = [
    {
      title: "Ümumi Test",
      value: stats?.totalQuizzes || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: stats?.weeklyGrowth || 0,
    },
    {
      title: "Ümumi Cəhd",
      value: stats?.totalAttempts || 0,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: 12,
    },
    {
      title: "Orta Bal",
      value: `${stats?.averageScore || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: 5,
    },
    {
      title: "Aktiv İstifadəçi",
      value: stats?.activeUsers || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: 8,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Asan"
      case "medium":
        return "Orta"
      case "hard":
        return "Çətin"
      default:
        return "Naməlum"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xoş gəldin, {user?.name}! 👋</h1>
            <p className="text-gray-600 mt-2">Dashboard-da nələr baş verir, dərhal baxaq.</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/quiz/create">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Test
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/forum">
                <MessageSquare className="w-4 h-4 mr-2" />
                Forum
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.change > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                          %{Math.abs(stat.change)} bu həftə
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ümumi Baxış</TabsTrigger>
            <TabsTrigger value="quizzes">Testlər</TabsTrigger>
            <TabsTrigger value="analytics">Analitika</TabsTrigger>
            <TabsTrigger value="achievements">Nailiyyətlər</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Quizzes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Son Testlər
                  </CardTitle>
                  <CardDescription>Ən son yaradılmış testləriniz</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentQuizzes?.length ? (
                      stats.recentQuizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                            <p className="text-sm text-gray-600">{quiz.category}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">{quiz.attempts} cəhd</span>
                              <span className="text-xs text-gray-500">%{quiz.averageScore} orta</span>
                              <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                                {getDifficultyText(quiz.difficulty)}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant="outline">{new Date(quiz.createdAt).toLocaleDateString("az-AZ")}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Hələ test yaratmamısınız</p>
                        <Button asChild className="mt-4">
                          <Link href="/quiz/create">İlk Testinizi Yaradın</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Son Fəaliyyətlər
                  </CardTitle>
                  <CardDescription>Son test cəhdləri və nəticələri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentAttempts?.length ? (
                      stats.recentAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{attempt.quizTitle}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={attempt.percentage} className="flex-1 h-2" />
                              <span className="text-sm font-medium text-gray-900">%{attempt.percentage}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-xs text-gray-500">
                                {new Date(attempt.attemptedAt).toLocaleDateString("az-AZ")}
                              </p>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {attempt.timeSpent} dəq
                              </span>
                            </div>
                          </div>
                          <Badge variant={attempt.percentage >= 70 ? "default" : "destructive"}>
                            {attempt.score} bal
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Hələ test həll etməmişsiniz</p>
                        <Button variant="outline" asChild className="mt-4 bg-transparent">
                          <Link href="/quizzes">Testləri Kəşf Edin</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quiz Categories */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Kateqoriya Performansı</CardTitle>
                  <CardDescription>Kateqoriya əsaslı test statistikaları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topCategories?.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                            <span>{category.quizCount} test</span>
                            <span>{category.attempts} cəhd</span>
                            <span>%{category.averageScore} orta</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Sürətli Əməliyyatlar</CardTitle>
                  <CardDescription>Tez-tez istifadə olunan xüsusiyyətlər</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                    <Link href="/quiz/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Test Yarat
                    </Link>
                  </Button>

                  <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                    <Link href="/quizzes">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Testləri Göstər
                    </Link>
                  </Button>

                  <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                    <Link href="/analytics">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analitik Hesabatlar
                    </Link>
                  </Button>

                  <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                    <Link href="/forum/ask">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Sual Ver
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Həftəlik Artım</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">+{stats?.weeklyGrowth || 0}%</div>
                  <p className="text-sm text-gray-600">Keçən həftəyə görə</p>
                  <Progress value={stats?.weeklyGrowth || 0} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aylıq Artım</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">+{stats?.monthlyGrowth || 0}%</div>
                  <p className="text-sm text-gray-600">Keçən aya görə</p>
                  <Progress value={stats?.monthlyGrowth || 0} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uğur Nisbəti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats?.averageScore || 0}%</div>
                  <p className="text-sm text-gray-600">Orta bal</p>
                  <Progress value={stats?.averageScore || 0} className="mt-3" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ətraflı Analitika</CardTitle>
                <CardDescription>Əhatəli performans hesabatları üçün</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Təkmil Analitika</h3>
                  <p className="text-gray-600 mb-6">
                    Ətraflı performans hesabatları, trend analizləri və müqayisəli məlumatlar
                  </p>
                  <Button asChild>
                    <Link href="/analytics">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analitika Səhifəsinə Get
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.achievements?.length ? (
                stats.achievements.map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <Badge variant="outline">{new Date(achievement.unlockedAt).toLocaleDateString("az-AZ")}</Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Hələ Nailiyyət Yoxdur</h3>
                  <p className="text-gray-600 mb-6">Test yaradın və həll edin, nailiyyətlərinizi qazanmağa başlayın!</p>
                  <Button asChild>
                    <Link href="/quiz/create">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Testinizi Yaradın
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Calendar Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Bu Həftə
            </CardTitle>
            <CardDescription>Həftəlik fəaliyyət xülasəsi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-600 mb-2">{day}</div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 5 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
