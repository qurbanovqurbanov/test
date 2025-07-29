"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Search, Clock, Users, Star, Play, ChevronRight, Filter, SortAsc, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  description: string
  category: string
  subject: string
  subcategory: string
  total_questions: number
  total_points: number
  total_attempts: number
  average_score: number
  min_pass_percentage: number
  time_limit_minutes: number | null
  created_at: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  creator_name: string
  is_featured: boolean
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Temelleri",
    description: "JavaScript programlama dilinin temel kavramları, değişkenler, fonksiyonlar ve DOM manipülasyonu",
    category: "Programlama",
    subject: "Web Development",
    subcategory: "Frontend",
    total_questions: 15,
    total_points: 15,
    total_attempts: 245,
    average_score: 78.5,
    min_pass_percentage: 70,
    time_limit_minutes: 30,
    created_at: "2025-01-20T10:00:00Z",
    difficulty: "medium",
    tags: ["javascript", "web", "frontend"],
    creator_name: "Ahmet Yılmaz",
    is_featured: true,
  },
  {
    id: "2",
    title: "React Hooks Derinlemesine",
    description: "React Hooks kullanımı, useState, useEffect, useContext ve custom hooks oluşturma",
    category: "Programlama",
    subject: "React",
    subcategory: "Frontend",
    total_questions: 20,
    total_points: 25,
    total_attempts: 189,
    average_score: 82.3,
    min_pass_percentage: 75,
    time_limit_minutes: 45,
    created_at: "2025-01-18T14:30:00Z",
    difficulty: "hard",
    tags: ["react", "hooks", "frontend"],
    creator_name: "Zeynep Kaya",
    is_featured: false,
  },
  {
    id: "3",
    title: "CSS Grid ve Flexbox",
    description: "Modern CSS layout teknikleri, responsive tasarım ve grid sistemleri",
    category: "Tasarım",
    subject: "CSS",
    subcategory: "Layout",
    total_questions: 12,
    total_points: 12,
    total_attempts: 156,
    average_score: 85.7,
    min_pass_percentage: 60,
    time_limit_minutes: null,
    created_at: "2025-01-15T09:15:00Z",
    difficulty: "easy",
    tags: ["css", "layout", "responsive"],
    creator_name: "Mehmet Demir",
    is_featured: true,
  },
  {
    id: "4",
    title: "Node.js ve Express",
    description: "Backend geliştirme için Node.js ve Express framework kullanımı",
    category: "Programlama",
    subject: "Backend",
    subcategory: "Server",
    total_questions: 18,
    total_points: 20,
    total_attempts: 134,
    average_score: 73.2,
    min_pass_percentage: 70,
    time_limit_minutes: 40,
    created_at: "2025-01-12T16:45:00Z",
    difficulty: "medium",
    tags: ["nodejs", "express", "backend"],
    creator_name: "Ayşe Özkan",
    is_featured: false,
  },
  {
    id: "5",
    title: "Database Tasarımı",
    description: "İlişkisel veritabanı tasarımı, normalizasyon ve SQL sorguları",
    category: "Veritabanı",
    subject: "SQL",
    subcategory: "Database",
    total_questions: 25,
    total_points: 30,
    total_attempts: 98,
    average_score: 79.8,
    min_pass_percentage: 75,
    time_limit_minutes: 60,
    created_at: "2025-01-10T11:20:00Z",
    difficulty: "hard",
    tags: ["sql", "database", "design"],
    creator_name: "Can Yıldız",
    is_featured: false,
  },
  {
    id: "6",
    title: "Python Temelleri",
    description: "Python programlama dili temelleri, veri tipleri ve kontrol yapıları",
    category: "Programlama",
    subject: "Python",
    subcategory: "Basics",
    total_questions: 20,
    total_points: 20,
    total_attempts: 312,
    average_score: 88.1,
    min_pass_percentage: 70,
    time_limit_minutes: 35,
    created_at: "2025-01-08T13:30:00Z",
    difficulty: "easy",
    tags: ["python", "basics", "programming"],
    creator_name: "Fatma Şen",
    is_featured: true,
  },
]

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    filterQuizzes()
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, activeTab, quizzes])

  const filterQuizzes = () => {
    let filtered = quizzes

    // Tab filter
    if (activeTab === "featured") {
      filtered = filtered.filter((quiz) => quiz.is_featured)
    } else if (activeTab === "popular") {
      filtered = filtered.filter((quiz) => quiz.total_attempts > 150)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((quiz) => quiz.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((quiz) => quiz.difficulty === selectedDifficulty)
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
        filtered.sort((a, b) => b.total_attempts - a.total_attempts)
        break
      case "highest_rated":
        filtered.sort((a, b) => b.average_score - a.average_score)
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredQuizzes(filtered)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Kolay"
      case "medium":
        return "Orta"
      case "hard":
        return "Zor"
      default:
        return "Bilinmiyor"
    }
  }

  const categories = Array.from(new Set(quizzes.map((quiz) => quiz.category)))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz'ler</h1>
            <p className="text-gray-600 mt-2">Mevcut quiz'leri keşfedin ve bilginizi test edin</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/quiz/create">
                <BookOpen className="w-4 h-4 mr-2" />
                Yeni Quiz Oluştur
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tümü ({quizzes.length})</TabsTrigger>
            <TabsTrigger value="featured">Öne Çıkanlar ({quizzes.filter((q) => q.is_featured).length})</TabsTrigger>
            <TabsTrigger value="popular">Popüler ({quizzes.filter((q) => q.total_attempts > 150).length})</TabsTrigger>
            <TabsTrigger value="recent">Son Eklenenler</TabsTrigger>
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
                        placeholder="Quiz ara... (başlık, açıklama, etiket)"
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
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Difficulty Filter */}
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Zorluk seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Zorluklar</SelectItem>
                      <SelectItem value="easy">Kolay</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="hard">Zor</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SortAsc className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">En Yeni</SelectItem>
                      <SelectItem value="oldest">En Eski</SelectItem>
                      <SelectItem value="popular">En Popüler</SelectItem>
                      <SelectItem value="highest_rated">En Yüksek Puan</SelectItem>
                      <SelectItem value="alphabetical">Alfabetik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(quiz.difficulty)} variant="outline">
                            {getDifficultyText(quiz.difficulty)}
                          </Badge>
                          {quiz.is_featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                              ⭐ Öne Çıkan
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Category and Subject */}
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {quiz.category}
                        </Badge>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <Badge variant="outline" className="text-xs">
                          {quiz.subject}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {quiz.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                        {quiz.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            +{quiz.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span>{quiz.total_questions} soru</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{quiz.total_attempts} deneme</span>
                        </div>
                        {quiz.time_limit_minutes && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{quiz.time_limit_minutes} dk</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>%{quiz.average_score.toFixed(0)} ort.</span>
                        </div>
                      </div>

                      {/* Creator */}
                      <div className="text-xs text-gray-500 border-t pt-3">
                        Oluşturan: <span className="font-medium">{quiz.creator_name}</span>
                        <span className="mx-2">•</span>
                        {new Date(quiz.created_at).toLocaleDateString("tr-TR")}
                      </div>

                      {/* Action Button */}
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Link href={`/quiz/${quiz.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          Quiz'i Başlat
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredQuizzes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  Arama kriterlerinize uygun quiz bulunamadı. Filtreleri değiştirmeyi deneyin.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedDifficulty("all")
                      setSortBy("newest")
                    }}
                    variant="outline"
                  >
                    Filtreleri Temizle
                  </Button>
                  <Button asChild>
                    <Link href="/quiz/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Quiz Oluştur
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Load More */}
            {filteredQuizzes.length > 0 && filteredQuizzes.length >= 9 && (
              <div className="text-center">
                <Button variant="outline" className="px-8 bg-transparent">
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
