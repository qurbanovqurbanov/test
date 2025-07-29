"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"

interface AuthModalProps {
  mode: "login" | "register"
  onClose: () => void
  onSwitchMode: (mode: "login" | "register") => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")
  const { login, register, isLoading } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "E-poçt ünvanı tələb olunur"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Şifrə tələb olunur"
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifrə ən azı 6 simvol olmalıdır"
    }

    // Name validation for register
    if (mode === "register") {
      if (!formData.name) {
        newErrors.name = "Ad soyad tələb olunur"
      } else if (formData.name.length < 2) {
        newErrors.name = "Ad soyad ən azı 2 simvol olmalıdır"
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Şifrə təkrarı tələb olunur"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Şifrələr uyğun gəlmir"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess("")

    if (!validateForm()) return

    try {
      if (mode === "login") {
        await login(formData.email, formData.password)
        setSuccess("Giriş uğurlu! Yönləndirilirsiniz...")
        setTimeout(() => {
          onClose()
          window.location.href = "/dashboard"
        }, 1500)
      } else {
        await register(formData.email, formData.password, formData.name)
        setSuccess("Hesab uğurla yaradıldı! Daxil olunur...")
        setTimeout(() => {
          onClose()
          window.location.href = "/dashboard"
        }, 1500)
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Xəta baş verdi" })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Zəif", color: "text-red-500" }
    if (password.length < 8) return { strength: 2, text: "Orta", color: "text-yellow-500" }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 3, text: "Güclü", color: "text-green-500" }
    }
    return { strength: 2, text: "Orta", color: "text-yellow-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="relative text-center pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>

            <CardTitle className="text-2xl">{mode === "login" ? "Yenidən Xoş Gəldin!" : "Hesab Yarat"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Hesabınıza daxil olun və öğrənməyə davam edin"
                : "Yeni hesabınızı yaradın və TestHub-a qoşulun"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Adınızı və soyadınızı daxil edin"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-10 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-poçt</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-poçt ünvanınızı daxil edin"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifrə</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrənizi daxil edin"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {mode === "register" && formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Şifrə gücü:</span>
                      <span className={passwordStrength.color}>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1
                            ? "w-1/3 bg-red-500"
                            : passwordStrength.strength === 2
                              ? "w-2/3 bg-yellow-500"
                              : passwordStrength.strength === 3
                                ? "w-full bg-green-500"
                                : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Şifrə Təkrarı</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Şifrənizi təkrar daxil edin"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Yüklənir...
                  </div>
                ) : mode === "login" ? (
                  "Daxil Ol"
                ) : (
                  "Hesab Yarat"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">və ya</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {mode === "login" ? "Hesabınız yoxdur?" : "Artıq hesabınız var?"}{" "}
                <Button
                  variant="link"
                  onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                >
                  {mode === "login" ? "Hesab yarat" : "Daxil ol"}
                </Button>
              </p>
            </div>

            {mode === "register" && (
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Hesab yaratmaqla{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  İstifadə Şərtləri
                </Link>{" "}
                və{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Məxfilik Siyasəti
                </Link>
                ni qəbul etmiş olursunuz.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
