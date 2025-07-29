"use client"

import type React from "react"

import { useState } from "react"
import { Save, User, Calendar, Shield, Key, Camera, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface AdminProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  location: string
  website: string
  joined_date: string
  last_login: string
  role: string
  permissions: string[]
  two_factor_enabled: boolean
  login_history: Array<{
    date: string
    ip: string
    location: string
    device: string
  }>
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>({
    id: "admin_1",
    name: "Admin İstifadəçi",
    email: "admin@testhub.az",
    phone: "+994 50 123 45 67",
    avatar: "",
    bio: "TestHub platformasının baş administratoru. Sistem idarəetməsi və istifadəçi dəstəyi ilə məşğulam.",
    location: "Bakı, Azərbaycan",
    website: "https://testhub.az",
    joined_date: "2024-01-15T00:00:00Z",
    last_login: "2025-01-29T14:30:00Z",
    role: "Super Admin",
    permissions: [
      "user_management",
      "quiz_management",
      "system_settings",
      "analytics_view",
      "backup_restore",
      "security_settings",
    ],
    two_factor_enabled: true,
    login_history: [
      {
        date: "2025-01-29T14:30:00Z",
        ip: "192.168.1.100",
        location: "Bakı, AZ",
        device: "Chrome on Windows",
      },
      {
        date: "2025-01-28T09:15:00Z",
        ip: "192.168.1.100",
        location: "Bakı, AZ",
        device: "Chrome on Windows",
      },
      {
        date: "2025-01-27T16:45:00Z",
        ip: "10.0.0.50",
        location: "Bakı, AZ",
        device: "Safari on iPhone",
      },
    ],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Mock API call - real implementation would save to database
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsEditing(false)
      toast({
        title: "Uğurlu",
        description: "Profil məlumatları yeniləndi",
      })
    } catch (error) {
      console.error("Profil saxlama xətası:", error)
      toast({
        title: "Xəta",
        description: "Profil saxlanıla bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Xəta",
        description: "Şifrələr uyğun gəlmir",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Xəta",
        description: "Şifrə ən azı 8 simvol olmalıdır",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setNewPassword("")
      setConfirmPassword("")
      setCurrentPassword("")

      toast({
        title: "Uğurlu",
        description: "Şifrə dəyişdirildi",
      })
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Şifrə dəyişdirilə bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPermissionName = (permission: string) => {
    const names: Record<string, string> = {
      user_management: "İstifadəçi İdarəetməsi",
      quiz_management: "Test İdarəetməsi",
      system_settings: "Sistem Ayarları",
      analytics_view: "Analitika Görüntüləmə",
      backup_restore: "Yedəkləmə və Bərpa",
      security_settings: "Təhlükəsizlik Ayarları",
    }
    return names[permission] || permission
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Profili</h1>
            <p className="text-gray-600 mt-2">Şəxsi məlumatlarınızı və hesab ayarlarınızı idarə edin</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                  Ləğv Et
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saxlanılır..." : "Saxla"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-2" />
                Redaktə Et
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Təhlükəsizlik</TabsTrigger>
            <TabsTrigger value="permissions">İcazələr</TabsTrigger>
            <TabsTrigger value="activity">Fəaliyyət</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Şəxsi Məlumatlar
                </CardTitle>
                <CardDescription>Profil məlumatlarınızı yeniləyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
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
                          className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500">{profile.role}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-poçt</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Yer</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="website">Veb sayt</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Haqqında</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Şifrə Dəyişdirmə
                </CardTitle>
                <CardDescription>Hesabınızın təhlükəsizliyi üçün güclü şifrə seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Cari Şifrə</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Yeni Şifrə</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Şifrə Təkrarı</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={!currentPassword || !newPassword || !confirmPassword || isSaving}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? "Dəyişdirilir..." : "Şifrəni Dəyişdir"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  İki Faktorlu Doğrulama
                </CardTitle>
                <CardDescription>Hesabınızın təhlükəsizliyini artırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">İki Faktorlu Doğrulama</p>
                    <p className="text-sm text-gray-600">{profile.two_factor_enabled ? "Aktiv" : "Deaktiv"}</p>
                  </div>
                  <Badge variant={profile.two_factor_enabled ? "default" : "secondary"}>
                    {profile.two_factor_enabled ? "Aktiv" : "Deaktiv"}
                  </Badge>
                </div>

                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  {profile.two_factor_enabled ? "Deaktiv Et" : "Aktiv Et"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin İcazələri</CardTitle>
                <CardDescription>Bu hesabın malik olduğu icazələr</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{getPermissionName(permission)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hesab Məlumatları</CardTitle>
                <CardDescription>Hesabınızla bağlı ümumi məlumatlar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                      <p className="font-medium">{formatDate(profile.joined_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Son Giriş</p>
                      <p className="font-medium">{formatDate(profile.last_login)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giriş Tarixçəsi</CardTitle>
                <CardDescription>Son giriş fəaliyyətləriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.login_history.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{formatDate(login.date)}</p>
                          <p className="text-sm text-gray-600">{login.device}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{login.location}</p>
                        <p className="text-xs text-gray-500">{login.ip}</p>
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
