"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MessageCircle, Share2, Flag, Calendar, Eye, Upload, X, Heart, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
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
  user_liked: boolean
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
  user_liked: boolean
  parent_id?: string
  replies?: ForumReply[]
}

export default function ForumPostPage() {
  const params = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newReply, setNewReply] = useState("")
  const [replyImages, setReplyImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchPost()
      fetchReplies()
    }
  }, [params.id])

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/posts/${params.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error("Post yükləmə xətası:", error)
    }
  }

  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/posts/${params.id}/replies`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setReplies(data)
      }
    } catch (error) {
      console.error("Cavablar yükləmə xətası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikePost = async () => {
    if (!user || !post) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.user_liked ? prev.likes - 1 : prev.likes + 1,
                user_liked: !prev.user_liked,
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Bəyənmə xətası:", error)
    }
  }

  const handleLikeReply = async (replyId: string) => {
    if (!user) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/replies/${replyId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setReplies((prev) =>
          prev.map((reply) =>
            reply.id === replyId
              ? {
                  ...reply,
                  likes: reply.user_liked ? reply.likes - 1 : reply.likes + 1,
                  user_liked: !reply.user_liked,
                }
              : reply,
          ),
        )
      }
    } catch (error) {
      console.error("Cavab bəyənmə xətası:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setReplyImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 şəkil
  }

  const removeImage = (index: number) => {
    setReplyImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitReply = async () => {
    if (!newReply.trim() || !user) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("content", newReply)
      formData.append("post_id", params.id as string)

      if (replyingTo) {
        formData.append("parent_id", replyingTo)
      }

      replyImages.forEach((image) => {
        formData.append("images", image)
      })

      const token = localStorage.getItem("token")
      const response = await fetch("/api/forum/replies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const newReplyData = await response.json()
        setReplies((prev) => [...prev, newReplyData])
        setNewReply("")
        setReplyImages([])
        setReplyingTo(null)

        // Update post reply count
        setPost((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : null))

        toast({
          title: "Uğurlu",
          description: "Cavabınız əlavə edildi",
        })
      }
    } catch (error) {
      console.error("Cavab göndərmə xətası:", error)
      toast({
        title: "Xəta",
        description: "Cavab göndərilə bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Tapılmadı</h1>
          <p className="text-gray-600 mb-6">Axtardığınız post mövcud deyil və ya silinib.</p>
          <Link href="/forum">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Foruma Qayıt
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Back Button */}
        <Link href="/forum">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Foruma Qayıt
          </Button>
        </Link>

        {/* Post */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Post Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.name}`}
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.is_pinned && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">📌 Sabitlənmiş</Badge>
                    )}
                    {post.is_solved && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">✅ Həll Edilmiş</Badge>
                    )}
                    <Badge variant="outline">{post.category}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="font-medium">{post.author.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.author.role}
                  </Badge>
                </div>

                {/* Post Content */}
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Post şəkli ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    variant={post.user_liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLikePost}
                    disabled={!user}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${post.user_liked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </Button>

                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </Button>

                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Paylaş</span>
                  </Button>

                  <Button variant="outline" size="sm" className="flex items-center gap-2 ml-auto bg-transparent">
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">Şikayət</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {user && (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  {replyingTo && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-700">Cavab verilir...</span>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Textarea
                    placeholder="Cavabınızı yazın..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="reply-images"
                      />
                      <Label
                        htmlFor="reply-images"
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Şəkil Əlavə Et</span>
                      </Label>
                      <span className="text-xs text-gray-500">Maksimum 5 şəkil</span>
                    </div>

                    {/* Image Preview */}
                    {replyImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {replyImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`Şəkil ${index + 1}`}
                              className="w-full h-16 sm:h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSubmitReply} disabled={!newReply.trim() || isSubmitting}>
                      {isSubmitting ? "Göndərilir..." : "Cavab Ver"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Cavablar ({replies.length})</h2>

          {replies.length > 0 ? (
            replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          reply.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${reply.author.name}`
                        }
                      />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {reply.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{reply.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {reply.author.role}
                          </Badge>
                          {reply.is_accepted && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              ✅ Qəbul Edilmiş
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatTimeAgo(reply.created_at)}</span>
                        </div>
                      </div>

                      {/* Reply Content */}
                      <div className="prose max-w-none mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                      </div>

                      {/* Reply Images */}
                      {reply.images && reply.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                          {reply.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Cavab şəkli ${index + 1}`}
                              className="w-full h-24 sm:h-32 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      )}

                      {/* Reply Actions */}
                      <div className="flex items-center gap-4 pt-3 border-t">
                        <Button
                          variant={reply.user_liked ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleLikeReply(reply.id)}
                          disabled={!user}
                          className="flex items-center gap-2"
                        >
                          <Heart className={`w-4 h-4 ${reply.user_liked ? "fill-current" : ""}`} />
                          <span>{reply.likes}</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(reply.id)}
                          disabled={!user}
                          className="flex items-center gap-2"
                        >
                          <Reply className="w-4 h-4" />
                          <span className="hidden sm:inline">Cavab Ver</span>
                        </Button>

                        <Button variant="outline" size="sm" className="flex items-center gap-2 ml-auto bg-transparent">
                          <Flag className="w-4 h-4" />
                          <span className="hidden sm:inline">Şikayət</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hələ cavab yoxdur</h3>
              <p className="text-gray-600 mb-6">Bu suala ilk cavab verən siz olun!</p>
              {!user && (
                <p className="text-sm text-gray-500">
                  Cavab vermək üçün{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    giriş edin
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
