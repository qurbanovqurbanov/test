"use client"

import { useState, useEffect } from "react"
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

interface AdminStats {
  total_users: number
  active_users: number
  total_quizzes: number
  published_quizzes: number
  total_forum_posts: number
  pending_reports: number
  system_health: "good" | "warning" | "critical"
  recent_signups: number
  quiz_completion_rate: number
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  is_active: boolean
  created_at: string
  last_login: string
  quiz_count: number
  forum_posts: number
  is_private: boolean
}

interface Quiz {
  id: string
  title: string
  category: string
  author: string
  created_at: string
  is_published: boolean
  total_attempts: number
  average_score: number
  is_reported: boolean
}

interface ForumPost {
  id: string
  title: string
  author: string
  category: string
  created_at: string
  replies: number
  is_reported: boolean
  is_solved: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    total_users: 156,
    active_users: 89,
    total_quizzes: 45,
    published_quizzes: 38,
    total_forum_posts: 234,
    pending_reports: 3,
    system_health: "good",
    recent_signups: 12,
    quiz_completion_rate: 78,
  })
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Əli Məmmədov",
      email: "ali@example.com",
      role: "user",
      is_active: true,
      created_at: "2024-01-15",
      last_login: "2024-01-20",
      quiz_count: 5,
      forum_posts: 12,
      is_private: false,
    },
    {
      id: "2",
      name: "Leyla Həsənova",
      email: "leyla@example.com",
      role: "user",
      is_active: true,
      created_at: "2024-01-10",
      last_login: "2024-01-19",
      quiz_count: 8,
      forum_posts: 6,
      is_private: true,
    },
  ])
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "JavaScript Əsasları",
      category: "Proqramlaşdırma",
      author: "Admin",
      created_at: "2024-01-15",
      is_published: true,
      total_attempts: 45,
      average_score: 78,
      is_reported: false,
    },
  ])
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "React Hook-ları haqqında sual",
      author: "Əli Məmmədov",
      category: "Proqramlaşdırma",
      created_at: "2024-01-18",
      replies: 5,
      is_reported: false,
      is_solved: true,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (user?.role !== "admin") {
      window.location.href = "/dashboard"
      return
    }
    fetchAdminData()
  }, [user])

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Xəta",
          description: "Giriş etməlisiniz",
          variant: "destructive",
        })
        return
      }

      // Mock data - real API calls would be here
      // For now, we'll use the existing state data
      toast({
        title: "Uğurlu",
        description: "Admin məlumatları yükləndi",
      })
    } catch (error) {
      console.error("Admin məlumatları yükləmə xətası:", error)
      toast({
        title: "Xəta",
        description: "Admin məlumatları yüklənə bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, is_active: isActive } : user)))
      toast({
        title: "Uğurlu",
        description: `İstifadəçi statusu ${isActive ? "aktivləşdirildi" : "deaktivləşdirildi"}`,
      })
    } catch (error) {
      console.error("İstifadəçi statusu dəyişdirmə xətası:", error)
      toast({
        title: "Xəta",
        description: "İstifadəçi statusu dəyişdirilə bilmədi",
        variant: "destructive",
      })
    }
  }

  const handleQuizStatusToggle = async (quizId: string, isPublished: boolean) => {
    try {
      setQuizzes((prev) => prev.map((quiz) => (quiz.id === quizId ? { ...quiz, is_published: isPublished } : quiz)))
      toast({
        title: "Uğurlu",
        description: `Test ${isPublished ? "dərc edildi" : "gizlədildi"}`,
      })
    } catch (error) {
      console.error("Test statusu dəyişdirmə xətası:", error)
      toast({
        title: "Xəta",
        description: "Test statusu dəyişdirilə bilmədi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return

    try {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      toast({
        title: "Uğurlu",
        description: "İstifadəçi silindi",
      })
    } catch (error) {
      console.error("İstifadəçi silmə xətası:", error)
      toast({
        title: "Xəta",
        description: "İstifadəçi silinə bilmədi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Bu testi silmək istədiyinizə əminsiniz?")) return

    try {
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId))
      toast({
        title: "Uğurlu",
        description: "Test silindi",
      })
    } catch (error) {
      console.error("Test silmə xətası:", error)
      toast({
        title: "Xəta",
        description: "Test silinə bilmədi",
        variant: "destructive",
      })
    }
  }

  const exportData = async (type: "users" | "quizzes" | "forum") => {
    try {
      // Mock export functionality
      const data = type === "users" ? users : type === "quizzes" ? quizzes : forumPosts
      const csvContent = "data:text/csv;charset=utf-8," + JSON.stringify(data, null, 2)
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${type}_export_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Uğurlu",
        description: "Məlumatlar ixrac edildi",
      })
    } catch (error) {
      console.error("Məlumat ixracı xətası:", error)
      toast({
        title: "Xəta",
        description: "Məlumatlar ixrac edilə bilmədi",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("az-AZ")
  }

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Qadağandır</h1>
          <p className="text-gray-600">Bu səhifəyə yalnız adminlər daxil ola bilər.</p>
        </div>
      </DashboardLayout>
    )
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

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">Sistem idarəetməsi və nəzarət paneli</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => exportData("users")} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              İxrac Et
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/settings">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Link>
            </Button>
          </div>
        </div>

        {/* System Health Alert */}
        {stats?.system_health !== "good" && (
          <Alert variant={stats?.system_health === "critical" ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {stats?.system_health === "critical"
                ? "Sistem kritik vəziyyətdədir. Dərhal müdaxilə tələb olunur."
                : "Sistem xəbərdarlıq vəziyyətindədir. Nəzarət edilməlidir."}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ümumi İstifadəçi</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                  <p className="text-sm text-green-600">+{stats?.recent_signups || 0} bu həftə</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                  <Users className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktiv İstifadəçi</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.active_users || 0}</p>
                  <p className="text-sm text-gray-600">
                    %{stats?.total_users ? Math.round((stats.active_users / stats.total_users) * 100) : 0} aktivlik
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ümumi Test</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total_quizzes || 0}</p>
                  <p className="text-sm text-gray-600">{stats?.published_quizzes || 0} dərc edilmiş</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                  <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Forum Postları</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total_forum_posts || 0}</p>
                  <p className="text-sm text-orange-600">{stats?.pending_reports || 0} şikayət</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                  <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ümumi</TabsTrigger>
            <TabsTrigger value="users">İstifadəçilər</TabsTrigger>
            <TabsTrigger value="quizzes">Testlər</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Performansı</CardTitle>
                  <CardDescription>Sistem sağlamlığı və performans göstəriciləri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Test Tamamlanma Nisbəti</span>
                      <span>{stats?.quiz_completion_rate || 0}%</span>
                    </div>
                    <Progress value={stats?.quiz_completion_rate || 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Aktiv İstifadəçi Nisbəti</span>
                      <span>
                        {stats?.total_users ? Math.round((stats.active_users / stats.total_users) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats?.total_users ? (stats.active_users / stats.total_users) * 100 : 0}
                      className="h-2"
                    />
                  </div>

                  <div className="pt-4">
                    <div
                      className={`flex items-center gap-2 ${
                        stats?.system_health === "good"
                          ? "text-green-600"
                          : stats?.system_health === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {stats?.system_health === "good" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : stats?.system_health === "warning" ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        Sistem Statusu:{" "}
                        {stats?.system_health === "good"
                          ? "Yaxşı"
                          : stats?.system_health === "warning"
                            ? "Xəbərdarlıq"
                            : "Kritik"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Fəaliyyətlər</CardTitle>
                  <CardDescription>Sistemdəki son dəyişikliklər</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">Yeni qeydiyyatlar</p>
                        <p className="text-sm text-gray-600">Bu həftə {stats?.recent_signups || 0} yeni istifadəçi</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Yeni testlər</p>
                        <p className="text-sm text-gray-600">Bu həftə 12 yeni test yaradılıb</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="font-medium">Forum aktivliyi</p>
                        <p className="text-sm text-gray-600">Bu həftə 45 yeni post</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="İstifadəçi axtar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status filteri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="inactive">Qeyri-aktiv</SelectItem>
                      <SelectItem value="admin">Adminlər</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={() => exportData("users")} variant="outline" className="w-full lg:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    İxrac Et
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>İstifadəçilər ({users.length})</CardTitle>
                <CardDescription>Bütün qeydiyyatlı istifadəçilərin siyahısı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => {
                      const matchesSearch =
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      const matchesFilter =
                        filterStatus === "all" ||
                        (filterStatus === "active" && user.is_active) ||
                        (filterStatus === "inactive" && !user.is_active) ||
                        (filterStatus === "admin" && user.role === "admin")
                      return matchesSearch && matchesFilter
                    })
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-gray-900">
                                {user.is_private ? "Abituriyent" : user.name}
                              </h4>
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role === "admin" ? "Admin" : "İstifadəçi"}
                              </Badge>
                              {!user.is_active && <Badge variant="destructive">Qeyri-aktiv</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 flex-wrap">
                              <span>Qoşulma: {formatDate(user.created_at)}</span>
                              <span>Son giriş: {formatDate(user.last_login)}</span>
                              <span>{user.quiz_count} test</span>
                              <span>{user.forum_posts} post</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={(checked) => handleUserStatusToggle(user.id, checked)}
                          />

                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testlər ({quizzes.length})</CardTitle>
                <CardDescription>Bütün testlərin idarə edilməsi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                          <Badge variant="outline">{quiz.category}</Badge>
                          {quiz.is_published ? (
                            <Badge className="bg-green-100 text-green-800">Dərc Edilmiş</Badge>
                          ) : (
                            <Badge variant="secondary">Layihə</Badge>
                          )}
                          {quiz.is_reported && <Badge variant="destructive">Şikayət Var</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <span>Müəllif: {quiz.author}</span>
                          <span>Yaradılma: {formatDate(quiz.created_at)}</span>
                          <span>{quiz.total_attempts} cəhd</span>
                          <span>Orta bal: {quiz.average_score}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <Switch
                          checked={quiz.is_published}
                          onCheckedChange={(checked) => handleQuizStatusToggle(quiz.id, checked)}
                        />

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/quiz/${quiz.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Postları ({forumPosts.length})</CardTitle>
                <CardDescription>Forum fəaliyyətinin idarə edilməsi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">{post.title}</h4>
                          <Badge variant="outline">{post.category}</Badge>
                          {post.is_solved && <Badge className="bg-green-100 text-green-800">Həll Edilmiş</Badge>}
                          {post.is_reported && <Badge variant="destructive">Şikayət Var</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <span>Müəllif: {post.author}</span>
                          <span>Tarix: {formatDate(post.created_at)}</span>
                          <span>{post.replies} cavab</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/forum/post/${post.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>

                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
