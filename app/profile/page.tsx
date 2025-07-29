"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  User,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Edit,
  Save,
  X,
  Award,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Camera,
  Lock,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joined_date: string
  is_private: boolean
  role: string
  stats: {
    quizzes_created: number
    quizzes_completed: number
    forum_posts: number
    total_score: number
    average_score: number
    achievements: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    earned_date: string
  }>
  recent_activity: Array<{
    id: string
    type: "quiz_completed" | "quiz_created" | "forum_post" | "achievement"
    title: string
    date: string
    score?: number
  }>
}

const mockProfile: UserProfile = {
  id: "1",
  name: "Əli Məmmədov",
  email: "ali@example.com",
  avatar: "",
  bio: "Proqramlaşdırma sahəsində təcrübəli mütəxəssis. JavaScript, React və Node.js üzrə ixtisaslaşıram.",
  location: "Bakı, Azərbaycan",
  website: "https://alimammadov.dev",
  joined_date: "2024-01-15T00:00:00Z",
  is_private: false,
  role: "Müəllim",
  stats: {
    quizzes_created: 15,
    quizzes_completed: 45,
    forum_posts: 23,
    total_score: 3850,
    average_score: 85,
    achievements: 12,
  },
  achievements: [
    {
      id: "1",
      title: "İlk Test",
      description: "İlk testinizi tamamladınız",
      icon: "🎯",
      earned_date: "2024-01-20T00:00:00Z",
    },
    {
      id: "2",
      title: "Mükəmməl Bal",
      description: "100% bal ilə test tamamladınız",
      icon: "⭐",
      earned_date: "2024-02-05T00:00:00Z",
    },
    {
      id: "3",
      title: "Forum Aktivi",
      description: "10 forum postu yaratdınız",
      icon: "💬",
      earned_date: "2024-02-15T00:00:00Z",
    },
  ],
  recent_activity: [
    {
      id: "1",
      type: "quiz_completed",
      title: "JavaScript Əsasları testini tamamladı",
      date: "2024-01-28T10:30:00Z",
      score: 92,
    },
    {
      id: "2",
      type: "forum_post",
      title: "React Hook-ları haqqında sual verdi",
      date: "2024-01-27T15:20:00Z",
    },
    {
      id: "3",
      type: "achievement",
      title: "Mükəmməl Bal nailiyyəti qazandı",
      date: "2024-01-26T09:15:00Z",
    },
  ],
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    is_private: false,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        is_private: profile.is_private || false,
      })
    }
  }, [profile])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append("name", editForm.name)
      formData.append("bio", editForm.bio)
      formData.append("location", editForm.location)
      formData.append("website", editForm.website)
      formData.append("is_private", editForm.is_private.toString())

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const token = localStorage.getItem("token")
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)

        // Update auth context
        await updateProfile(updatedProfile)

        toast({
          title: "Uğurlu",
          description: "Profil yeniləndi",
        })
      } else {
        throw new Error("Profil yenilənə bilmədi")
      }
    } catch (error) {
      console.error("Profil yeniləmə xətası:", error)
      toast({
        title: "Xəta",
        description: "Profil yenilənə bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setAvatarFile(null)
    setAvatarPreview(null)
    if (profile) {
      setEditForm({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        is_private: profile.is_private || false,
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Çıxış edildi",
      description: "Hesabınızdan uğurla çıxış etdiniz",
    })
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_completed":
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case "quiz_created":
        return <Edit className="w-4 h-4 text-green-600" />
      case "forum_post":
        return <MessageSquare className="w-4 h-4 text-purple-600" />
      case "achievement":
        return <Award className="w-4 h-4 text-yellow-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const displayName = profile.is_private ? "Abituriyent" : profile.name

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-4 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage
                    src={
                      avatarPreview ||
                      profile.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || "/placeholder.svg"}`
                    }
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl sm:text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Adınızı və soyadınızı daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Haqqımda</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Özünüz haqqında qısa məlumat..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Məkan</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="Şəhər, Ölkə"
                        />
                      </div>

                      <div>
                        <Label htmlFor="website">Veb Sayt</Label>
                        <Input
                          id="website"
                          value={editForm.website}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Gizli Profil</Label>
                        <p className="text-sm text-gray-600">Profil gizli olduqda "Abituriyent" kimi görünəcək</p>
                      </div>
                      <Switch
                        checked={editForm.is_private}
                        onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_private: checked }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                          {displayName}
                          {profile.is_private && <Lock className="w-5 h-5 text-gray-500" />}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{profile.role}</Badge>
                          <Badge className="bg-blue-100 text-blue-800">{profile.stats.achievements} Nailiyyət</Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Redaktə Et
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Çıxış
                        </Button>
                      </div>
                    </div>

                    {profile.bio && <p className="text-gray-600 leading-relaxed">{profile.bio}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>

                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}

                      {profile.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.website}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(profile.joined_date)} tarixində qoşulub</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saxlanılır..." : "Saxla"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto bg-transparent">
                      <X className="w-4 h-4 mr-2" />
                      Ləğv Et
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile.stats.quizzes_created}</div>
              <div className="text-xs sm:text-sm text-gray-600">Yaradılmış Test</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile.stats.quizzes_completed}</div>
              <div className="text-xs sm:text-sm text-gray-600">Tamamlanmış Test</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile.stats.forum_posts}</div>
              <div className="text-xs sm:text-sm text-gray-600">Forum Postu</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile.stats.achievements}</div>
              <div className="text-xs sm:text-sm text-gray-600">Nailiyyət</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Son Fəaliyyət</TabsTrigger>
            <TabsTrigger value="achievements">Nailiyyətlər</TabsTrigger>
            <TabsTrigger value="stats">Statistika</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Son Fəaliyyət</CardTitle>
                <CardDescription>Son aktivlikləriniz və nailiyyətləriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recent_activity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{activity.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{formatDate(activity.date)}</p>
                      </div>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.score} bal
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Nailiyyətlər</CardTitle>
                <CardDescription>Qazandığınız nailiyyətlər və mükafatlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg sm:text-xl">
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{achievement.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.earned_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Performansı</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Orta Bal</span>
                      <span>{profile.stats.average_score}%</span>
                    </div>
                    <Progress value={profile.stats.average_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{profile.stats.total_score}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Ümumi Bal</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {profile.stats.quizzes_completed}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Tamamlanmış</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İcma Fəaliyyəti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">{profile.stats.forum_posts}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Forum Postu</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">
                        {profile.stats.quizzes_created}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Yaradılmış Test</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{profile.stats.achievements}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Nailiyyət</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
