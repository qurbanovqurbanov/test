"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  MessageCircle,
  Eye,
  CheckCircle,
  User,
  Tag,
  TrendingUp,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  views: number
  likes: number
  replies: number
  is_solved: boolean
  is_pinned: boolean
  images?: string[]
}

interface ForumReply {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  created_at: string
  likes: number
  is_accepted: boolean
  images?: string[]
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "JavaScript-də async/await necə işləyir?",
    content:
      "Salam, JavaScript-də async/await konseptini başa düşməkdə çətinlik çəkirəm. Kimsə sadə misallarla izah edə bilər?",
    author: {
      id: "1",
      name: "Əli Məmmədov",
      avatar: "",
      role: "Tələbə",
    },
    category: "Proqramlaşdırma",
    tags: ["javascript", "async", "programming"],
    created_at: "2025-01-29T10:30:00Z",
    updated_at: "2025-01-29T10:30:00Z",
    views: 45,
    likes: 12,
    replies: 8,
    is_solved: false,
    is_pinned: false,
  },
  {
    id: "2",
    title: "React Hook-ları haqqında sual",
    content: "useState və useEffect hook-larını eyni komponentdə necə düzgün istifadə etmək olar?",
    author: {
      id: "2",
      name: "Leyla Həsənova",
      avatar: "",
      role: "Tələbə",
    },
    category: "Frontend",
    tags: ["react", "hooks", "frontend"],
    created_at: "2025-01-29T09:15:00Z",
    updated_at: "2025-01-29T09:15:00Z",
    views: 67,
    likes: 18,
    replies: 12,
    is_solved: true,
    is_pinned: true,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox - hansını seçmək?",
    content: "Layout yaratmaq üçün CSS Grid və Flexbox arasında hansını seçməli? Hər birinin üstünlükləri nələrdir?",
    author: {
      id: "3",
      name: "Rəşad Quliyev",
      avatar: "",
      role: "Müəllim",
    },
    category: "Dizayn",
    tags: ["css", "grid", "flexbox", "layout"],
    created_at: "2025-01-28T16:45:00Z",
    updated_at: "2025-01-28T16:45:00Z",
    views: 89,
    likes: 25,
    replies: 15,
    is_solved: false,
    is_pinned: false,
  },
]

export default function ForumPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts)
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })
  const [postImages, setPostImages] = useState<File[]>([])

  useEffect(() => {
    filterPosts()
  }, [searchTerm, selectedCategory, sortBy, activeTab, posts])

  const filterPosts = () => {
    let filtered = posts

    // Tab filter
    if (activeTab === "solved") {
      filtered = filtered.filter((post) => post.is_solved)
    } else if (activeTab === "unsolved") {
      filtered = filtered.filter((post) => !post.is_solved)
    } else if (activeTab === "popular") {
      filtered = filtered.filter((post) => post.likes > 15)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "most_replies":
        filtered.sort((a, b) => b.replies - a.replies)
        break
      case "most_views":
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    // Pinned posts always on top
    const pinned = filtered.filter((post) => post.is_pinned)
    const regular = filtered.filter((post) => !post.is_pinned)

    setFilteredPosts([...pinned, ...regular])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPostImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 şəkil
  }

  const removeImage = (index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("title", newPost.title)
      formData.append("content", newPost.content)
      formData.append("category", newPost.category)
      formData.append("tags", newPost.tags)

      postImages.forEach((image, index) => {
        formData.append(`images`, image)
      })

      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setPosts((prev) => [data, ...prev])
        setNewPost({ title: "", content: "", category: "", tags: "" })
        setPostImages([])
        setShowNewPostDialog(false)
      }
    } catch (error) {
      console.error("Post yaratma xətası:", error)
    }
  }

  const categories = Array.from(new Set(posts.map((post) => post.category)))

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Az əvvəl"
    if (diffInHours < 24) return `${diffInHours} saat əvvəl`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} gün əvvəl`

    return date.toLocaleDateString("az-AZ")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
            <p className="text-gray-600 mt-2">Suallarınızı verin, cavablar tapın və biliklərinizi paylaşın</p>
          </div>

          <Button
            onClick={() => setShowNewPostDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Sual
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
              <div className="text-sm text-gray-600">Ümumi Post</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{posts.filter((p) => p.is_solved).length}</div>
              <div className="text-sm text-gray-600">Həll Edilmiş</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{posts.filter((p) => p.likes > 15).length}</div>
              <div className="text-sm text-gray-600">Populyar</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Aktiv Üzv</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Hamısı ({posts.length})</TabsTrigger>
            <TabsTrigger value="unsolved">Həll Edilməmiş ({posts.filter((p) => !p.is_solved).length})</TabsTrigger>
            <TabsTrigger value="solved">Həll Edilmiş ({posts.filter((p) => p.is_solved).length})</TabsTrigger>
            <TabsTrigger value="popular">Populyar ({posts.filter((p) => p.likes > 15).length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Sual, məzmun və ya etiket axtar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Kateqoriya seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Bütün Kateqoriyalar</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Ən Yeni</SelectItem>
                      <SelectItem value="oldest">Ən Köhnə</SelectItem>
                      <SelectItem value="popular">Ən Populyar</SelectItem>
                      <SelectItem value="most_replies">Ən Çox Cavab</SelectItem>
                      <SelectItem value="most_views">Ən Çox Baxış</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              post.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.name}`
                            }
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.is_pinned && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  📌 Sabitlənmiş
                                </Badge>
                              )}
                              {post.is_solved && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">✅ Həll Edilmiş</Badge>
                              )}
                              <Badge variant="outline">{post.category}</Badge>
                            </div>

                            <div className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</div>
                          </div>

                          {/* Title */}
                          <Link href={`/forum/post/${post.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          {/* Content Preview */}
                          <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>

                          {/* Tags */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Author & Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">{post.author.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {post.author.role}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.replies}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Post tapılmadı</h3>
                <p className="text-gray-600 mb-6">
                  Axtarış kriterlərinizə uyğun post tapılmadı. Filterləri dəyişməyi sınayın.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSortBy("newest")
                    }}
                    variant="outline"
                  >
                    Filterləri Təmizlə
                  </Button>
                  <Button onClick={() => setShowNewPostDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Sual Ver
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* New Post Dialog */}
        <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Sual Ver</DialogTitle>
              <DialogDescription>
                Sualınızı aydın və ətraflı şəkildə yazın ki, daha yaxşı cavablar ala biləsiniz.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="post-title">Başlıq *</Label>
                <Input
                  id="post-title"
                  placeholder="Sualınızın qısa və aydın başlığını yazın..."
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Kateqoriya *</Label>
                <Select
                  value={newPost.category}
                  onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kateqoriya seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proqramlaşdırma">Proqramlaşdırma</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Dizayn">Dizayn</SelectItem>
                    <SelectItem value="Riyaziyyat">Riyaziyyat</SelectItem>
                    <SelectItem value="Ümumi">Ümumi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="post-content">Məzmun *</Label>
                <Textarea
                  id="post-content"
                  placeholder="Sualınızı ətraflı izah edin. Kod nümunələri, xəta mesajları və ya digər əlavə məlumatları daxil edin..."
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="post-tags">Etiketlər</Label>
                <Input
                  id="post-tags"
                  placeholder="Etiketləri vergüllə ayırın (məs: javascript, react, css)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
                />
                <p className="text-xs text-gray-500">Etiketlər sualınızın daha asan tapılmasına kömək edir</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Şəkillər (İstəyə görə)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="post-images"
                    />
                    <Label
                      htmlFor="post-images"
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Şəkil Yüklə</span>
                    </Label>
                    <span className="text-xs text-gray-500">Maksimum 5 şəkil</span>
                  </div>

                  {/* Image Preview */}
                  {postImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {postImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Şəkil ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                  Ləğv Et
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim() || !newPost.category}
                >
                  Sual Ver
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
