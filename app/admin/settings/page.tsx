"use client"

import { useState, useEffect } from "react"
import { Save, Shield, Bell, Globe, Database, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface SystemSettings {
  site_name: string
  site_description: string
  site_url: string
  admin_email: string
  maintenance_mode: boolean
  registration_enabled: boolean
  email_verification_required: boolean
  max_quiz_questions: number
  max_file_size_mb: number
  allowed_file_types: string[]
  default_quiz_time_limit: number
  auto_backup_enabled: boolean
  backup_frequency: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  smtp_encryption: string
  notification_email_enabled: boolean
  notification_sms_enabled: boolean
  analytics_enabled: boolean
  cache_enabled: boolean
  debug_mode: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: "TestHub",
    site_description: "Online test və quiz platforması",
    site_url: "https://testhub.az",
    admin_email: "admin@testhub.az",
    maintenance_mode: false,
    registration_enabled: true,
    email_verification_required: true,
    max_quiz_questions: 100,
    max_file_size_mb: 10,
    allowed_file_types: ["jpg", "jpeg", "png", "gif", "pdf"],
    default_quiz_time_limit: 60,
    auto_backup_enabled: true,
    backup_frequency: "daily",
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_username: "",
    smtp_password: "",
    smtp_encryption: "tls",
    notification_email_enabled: true,
    notification_sms_enabled: false,
    analytics_enabled: true,
    cache_enabled: true,
    debug_mode: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Load settings from API
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Mock API call - real implementation would fetch from database
      console.log("Settings loaded")
    } catch (error) {
      console.error("Settings yükləmə xətası:", error)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Mock API call - real implementation would save to database
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Uğurlu",
        description: "Ayarlar saxlanıldı",
      })
    } catch (error) {
      console.error("Settings saxlama xətası:", error)
      toast({
        title: "Xəta",
        description: "Ayarlar saxlanıla bilmədi",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-gray-600 mt-2">Platformun ümumi ayarlarını idarə edin</p>
          </div>
          <Button onClick={saveSettings} disabled={isSaving} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saxlanılır..." : "Ayarları Saxla"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Ümumi</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Təhlükəsizlik</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">E-poçt</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Bildirişlər</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Sistem</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Sayt Ayarları
                </CardTitle>
                <CardDescription>Saytın əsas məlumatlarını və görünüşünü konfiqurasiya edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Sayt Adı</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => updateSetting("site_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_url">Sayt URL</Label>
                    <Input
                      id="site_url"
                      value={settings.site_url}
                      onChange={(e) => updateSetting("site_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">Sayt Açıqlaması</Label>
                  <Textarea
                    id="site_description"
                    rows={3}
                    value={settings.site_description}
                    onChange={(e) => updateSetting("site_description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_email">Admin E-poçt</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={settings.admin_email}
                    onChange={(e) => updateSetting("admin_email", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Ayarları</CardTitle>
                <CardDescription>Test və quiz-lərlə bağlı ümumi ayarlar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_quiz_questions">Maksimum Sual Sayı</Label>
                    <Input
                      id="max_quiz_questions"
                      type="number"
                      min="1"
                      max="500"
                      value={settings.max_quiz_questions}
                      onChange={(e) => updateSetting("max_quiz_questions", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_quiz_time_limit">Standart Vaxt Limiti (dəqiqə)</Label>
                    <Input
                      id="default_quiz_time_limit"
                      type="number"
                      min="1"
                      max="300"
                      value={settings.default_quiz_time_limit}
                      onChange={(e) => updateSetting("default_quiz_time_limit", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_file_size_mb">Maksimum Fayl Ölçüsü (MB)</Label>
                    <Input
                      id="max_file_size_mb"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.max_file_size_mb}
                      onChange={(e) => updateSetting("max_file_size_mb", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>İcazə Verilən Fayl Növləri</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.allowed_file_types.map((type) => (
                      <Badge key={type} variant="secondary">
                        .{type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  İstifadəçi Ayarları
                </CardTitle>
                <CardDescription>Qeydiyyat və istifadəçi təhlükəsizlik ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Qeydiyyat Açıq</Label>
                    <p className="text-sm text-gray-600">Yeni istifadəçilərin qeydiyyatdan keçməsinə icazə ver</p>
                  </div>
                  <Switch
                    checked={settings.registration_enabled}
                    onCheckedChange={(checked) => updateSetting("registration_enabled", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>E-poçt Təsdiqi Tələb Et</Label>
                    <p className="text-sm text-gray-600">Yeni istifadəçilər e-poçt ünvanlarını təsdiq etməlidirlər</p>
                  </div>
                  <Switch
                    checked={settings.email_verification_required}
                    onCheckedChange={(checked) => updateSetting("email_verification_required", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Baxım Rejimi</Label>
                    <p className="text-sm text-gray-600">
                      Saytı baxım rejiminə keçir (yalnız adminlər daxil ola bilər)
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => updateSetting("maintenance_mode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Şifrə Siyasəti</CardTitle>
                <CardDescription>İstifadəçi şifrələri üçün tələblər</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Şifrə Uzunluğu</Label>
                    <Input type="number" min="6" max="20" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Şifrə Keçərlilik Müddəti (gün)</Label>
                    <Input type="number" min="30" max="365" defaultValue="90" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Şifrə Tələbləri</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require_uppercase" defaultChecked />
                      <Label htmlFor="require_uppercase" className="text-sm">
                        Böyük hərf tələb et
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require_lowercase" defaultChecked />
                      <Label htmlFor="require_lowercase" className="text-sm">
                        Kiçik hərf tələb et
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require_numbers" defaultChecked />
                      <Label htmlFor="require_numbers" className="text-sm">
                        Rəqəm tələb et
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require_symbols" />
                      <Label htmlFor="require_symbols" className="text-sm">
                        Xüsusi simvol tələb et
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  SMTP Ayarları
                </CardTitle>
                <CardDescription>E-poçt göndərmə üçün SMTP server ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={settings.smtp_host}
                      onChange={(e) => updateSetting("smtp_host", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={settings.smtp_port}
                      onChange={(e) => updateSetting("smtp_port", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_username">İstifadəçi Adı</Label>
                    <Input
                      id="smtp_username"
                      value={settings.smtp_username}
                      onChange={(e) => updateSetting("smtp_username", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">Şifrə</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={settings.smtp_password}
                      onChange={(e) => updateSetting("smtp_password", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_encryption">Şifrələmə</Label>
                  <Select
                    value={settings.smtp_encryption}
                    onValueChange={(value) => updateSetting("smtp_encryption", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Yoxdur</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button variant="outline">Test E-poçtu Göndər</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildiriş Ayarları
                </CardTitle>
                <CardDescription>Sistem bildirişlərini konfiqurasiya edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>E-poçt Bildirişləri</Label>
                    <p className="text-sm text-gray-600">Sistem bildirişlərini e-poçt ilə göndər</p>
                  </div>
                  <Switch
                    checked={settings.notification_email_enabled}
                    onCheckedChange={(checked) => updateSetting("notification_email_enabled", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Bildirişləri</Label>
                    <p className="text-sm text-gray-600">Vacib bildirişləri SMS ilə göndər</p>
                  </div>
                  <Switch
                    checked={settings.notification_sms_enabled}
                    onCheckedChange={(checked) => updateSetting("notification_sms_enabled", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Bildiriş Növləri</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Yeni istifadəçi qeydiyyatı</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Test yaradılması</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Forum postları</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sistem xətaları</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Sistem Performansı
                </CardTitle>
                <CardDescription>Sistem performansı və optimallaşdırma ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Cache Sistemi</Label>
                    <p className="text-sm text-gray-600">Performansı artırmaq üçün cache-i aktiv et</p>
                  </div>
                  <Switch
                    checked={settings.cache_enabled}
                    onCheckedChange={(checked) => updateSetting("cache_enabled", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Analitika</Label>
                    <p className="text-sm text-gray-600">İstifadəçi davranışı və sistem analitikası</p>
                  </div>
                  <Switch
                    checked={settings.analytics_enabled}
                    onCheckedChange={(checked) => updateSetting("analytics_enabled", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Debug Rejimi</Label>
                    <p className="text-sm text-gray-600">Təkmilləşdirmə üçün ətraflı log-lar</p>
                  </div>
                  <Switch
                    checked={settings.debug_mode}
                    onCheckedChange={(checked) => updateSetting("debug_mode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avtomatik Yedəkləmə</CardTitle>
                <CardDescription>Verilənlərin avtomatik yedəklənməsi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Avtomatik Yedəkləmə</Label>
                    <p className="text-sm text-gray-600">Verilənləri müntəzəm olaraq yedəklə</p>
                  </div>
                  <Switch
                    checked={settings.auto_backup_enabled}
                    onCheckedChange={(checked) => updateSetting("auto_backup_enabled", checked)}
                  />
                </div>

                {settings.auto_backup_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Yedəkləmə Tezliyi</Label>
                    <Select
                      value={settings.backup_frequency}
                      onValueChange={(value) => updateSetting("backup_frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Saatlıq</SelectItem>
                        <SelectItem value="daily">Günlük</SelectItem>
                        <SelectItem value="weekly">Həftəlik</SelectItem>
                        <SelectItem value="monthly">Aylıq</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    İndi Yedəklə
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-2 bg-transparent">
                    Yedəkləri Göstər
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
