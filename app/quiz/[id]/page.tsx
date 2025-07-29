"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface QuizQuestion {
  id: string
  question_text: string
  question_type: "multiple_choice" | "open_ended"
  options: Array<{
    id: string
    text: string
    image_url?: string
  }>
  image_url?: string
  math_formula?: string
  points: number
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  category: string
  subject: string
  total_questions: number
  total_points: number
  time_limit_minutes: number | null
  min_pass_percentage: number
  questions: QuizQuestion[]
  shuffle_questions: boolean
  shuffle_options: boolean
}

interface QuizAttempt {
  answers: { [questionId: string]: string | string[] }
  startTime: number
  currentQuestion: number
  isCompleted: boolean
  timeSpent: number
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt>({
    answers: {},
    startTime: Date.now(),
    currentQuestion: 0,
    isCompleted: false,
    timeSpent: 0,
  })
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (quiz?.time_limit_minutes && !attempt.isCompleted) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - attempt.startTime) / 1000 / 60)
        const remaining = quiz.time_limit_minutes! - elapsed

        if (remaining <= 0) {
          handleSubmitQuiz()
        } else {
          setTimeLeft(remaining)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quiz, attempt.startTime, attempt.isCompleted])

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setQuiz(data)

        // Sualları qarışdır
        if (data.shuffle_questions) {
          data.questions = [...data.questions].sort(() => Math.random() - 0.5)
        }

        // Variantları qarışdır
        if (data.shuffle_options) {
          data.questions.forEach((question: QuizQuestion) => {
            if (question.question_type === "multiple_choice") {
              question.options = [...question.options].sort(() => Math.random() - 0.5)
            }
          })
        }

        setQuiz(data)
      }
    } catch (error) {
      console.error("Test yükləmə xətası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }))
  }

  const handleNextQuestion = () => {
    if (quiz && attempt.currentQuestion < quiz.questions.length - 1) {
      setAttempt((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }))
    }
  }

  const handlePreviousQuestion = () => {
    if (attempt.currentQuestion > 0) {
      setAttempt((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }))
    }
  }

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const timeSpent = Math.floor((Date.now() - attempt.startTime) / 1000 / 60)

      const token = localStorage.getItem("token")
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: attempt.answers,
          time_spent: timeSpent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setShowResults(true)
        setAttempt((prev) => ({ ...prev, isCompleted: true, timeSpent }))
      }
    } catch (error) {
      console.error("Test göndərmə xətası:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}s ${mins}d` : `${mins}d`
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

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Tapılmadı</h1>
          <p className="text-gray-600 mb-6">Axtardığınız test mövcud deyil və ya silinib.</p>
          <Button onClick={() => router.push("/quizzes")}>Testlərə Qayıt</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (showResults && results) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Nəticələri</CardTitle>
              <CardDescription>{quiz.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nəticə Statistikaları */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{results.score}</div>
                  <div className="text-sm text-gray-600">Ümumi Bal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
                  <div className="text-sm text-gray-600">Faiz</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{results.correct_answers}</div>
                  <div className="text-sm text-gray-600">Düzgün Cavab</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{formatTime(attempt.timeSpent)}</div>
                  <div className="text-sm text-gray-600">Vaxt</div>
                </div>
              </div>

              {/* Keçid Statusu */}
              <div className="text-center">
                {results.percentage >= quiz.min_pass_percentage ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 font-medium">
                      Təbriklər! Testi uğurla keçdiniz. Minimum keçid balı: {quiz.min_pass_percentage}%
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Təəssüf ki, testi keçə bilmədiniz. Minimum keçid balı: {quiz.min_pass_percentage}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Sual-cavab təfərrüatları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cavab Təfərrüatları</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = attempt.answers[question.id]
                  const isCorrect = results.question_results?.[question.id]?.is_correct

                  return (
                    <Card
                      key={question.id}
                      className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Sual {index + 1}</Badge>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <Badge variant="secondary">{question.points} bal</Badge>
                          </div>
                        </div>

                        <h4 className="font-medium mb-3">{question.question_text}</h4>

                        {question.image_url && (
                          <img
                            src={question.image_url || "/placeholder.svg"}
                            alt="Sual şəkli"
                            className="w-64 h-40 object-cover rounded mb-3"
                          />
                        )}

                        {question.math_formula && (
                          <div className="bg-blue-50 p-3 rounded mb-3">
                            <span className="font-mono">{question.math_formula}</span>
                          </div>
                        )}

                        {question.question_type === "multiple_choice" && (
                          <div className="space-y-2">
                            {question.options.map((option) => {
                              const isUserAnswer = Array.isArray(userAnswer)
                                ? userAnswer.includes(option.id)
                                : userAnswer === option.id
                              const isCorrectOption = results.question_results?.[
                                question.id
                              ]?.correct_options?.includes(option.id)

                              return (
                                <div
                                  key={option.id}
                                  className={`p-2 rounded flex items-center gap-3 ${
                                    isCorrectOption
                                      ? "bg-green-50 border border-green-200"
                                      : isUserAnswer
                                        ? "bg-red-50 border border-red-200"
                                        : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCorrectOption && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    {isUserAnswer && !isCorrectOption && <XCircle className="w-4 h-4 text-red-600" />}
                                  </div>
                                  <span>{option.text}</span>
                                  {option.image_url && (
                                    <img
                                      src={option.image_url || "/placeholder.svg"}
                                      alt="Variant şəkli"
                                      className="w-16 h-12 object-cover rounded"
                                    />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {question.question_type === "open_ended" && (
                          <div className="space-y-2">
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm text-gray-600 mb-1">Sizin cavabınız:</p>
                              <p>{userAnswer || "Cavab verilməyib"}</p>
                            </div>
                            {results.question_results?.[question.id]?.expected_answer && (
                              <div className="bg-green-50 p-3 rounded">
                                <p className="text-sm text-green-700 mb-1">Gözlənilən cavab:</p>
                                <p>{results.question_results[question.id].expected_answer}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-700 mb-1">Açıqlama:</p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push("/quizzes")} variant="outline">
                  Testlərə Qayıt
                </Button>
                <Button onClick={() => window.location.reload()}>Yenidən Cəhd Et</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const currentQuestion = quiz.questions[attempt.currentQuestion]
  const progress = ((attempt.currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-gray-600">
                  {quiz.category} • {quiz.subject}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {timeLeft !== null && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                )}

                <Badge variant="outline">
                  Sual {attempt.currentQuestion + 1} / {quiz.questions.length}
                </Badge>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={attempt.currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">Sual {attempt.currentQuestion + 1}</Badge>
                  <Badge variant="secondary">{currentQuestion.points} bal</Badge>
                </div>

                <CardTitle className="text-xl leading-relaxed">{currentQuestion.question_text}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentQuestion.image_url && (
                  <div className="flex justify-center">
                    <img
                      src={currentQuestion.image_url || "/placeholder.svg"}
                      alt="Sual şəkli"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {currentQuestion.math_formula && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-mono text-lg text-center">{currentQuestion.math_formula}</div>
                  </div>
                )}

                {/* Multiple Choice */}
                {currentQuestion.question_type === "multiple_choice" && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option.id}
                          checked={attempt.answers[currentQuestion.id] === option.id}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className="text-gray-900">{option.text}</span>
                          {option.image_url && (
                            <div className="mt-2">
                              <img
                                src={option.image_url || "/placeholder.svg"}
                                alt={`Variant ${index + 1} şəkli`}
                                className="w-32 h-24 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Open Ended */}
                {currentQuestion.question_type === "open_ended" && (
                  <div className="space-y-2">
                    <Label htmlFor="open-answer">Cavabınızı yazın:</Label>
                    <Textarea
                      id="open-answer"
                      placeholder="Cavabınızı buraya yazın..."
                      rows={4}
                      value={(attempt.answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={attempt.currentQuestion === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Əvvəlki
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Cavablanmış: {Object.keys(attempt.answers).length} / {quiz.questions.length}
                </span>
              </div>

              {attempt.currentQuestion === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? "Göndərilir..." : "Testi Bitir"}
                  <Flag className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  Növbəti
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sual Baxışı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setAttempt((prev) => ({ ...prev, currentQuestion: index }))}
                  className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                    index === attempt.currentQuestion
                      ? "bg-blue-600 text-white"
                      : attempt.answers[quiz.questions[index].id]
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
