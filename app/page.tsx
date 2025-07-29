"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Target,
  Star,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthModal from "@/components/auth/AuthModal"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

const features = [
  {
    icon: BookOpen,
    title: "Ağıllı Test Yaratma",
    description:
      "Çoxvariantlı, açıq cavablı və şəkilli suallarla əhatəli testlər yaradın. LaTeX dəstəyi ilə riyaziyyat sualları əlavə edin.",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Real Vaxt Sessiyaları",
    description:
      "Canlı test sessiyaları ilə tələbələrinizi interaktiv təcrübə ilə tanış edin. Avtomatik saxlama və vaxt izləmə.",
    color: "bg-green-500",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: BarChart3,
    title: "Ətraflı Analitika",
    description:
      "Performans hesabatları və öğrənmə analitikası ilə irəliləyişi izləyin. Sual əsaslı analiz və müqayisə.",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Sual-Cavab Forumu",
    description:
      "Tələbələr və müəllimlər arasında interaktiv sual-cavab platforması. Upvote sistemi və qəbul edilən cavablar.",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Sosial Öğrənmə",
    description:
      "İzləmə sistemi və icma xüsusiyyətləri ilə sosial öğrənmə təcrübəsi. İstifadəçi profilləri və fəaliyyət axını.",
    color: "bg-pink-500",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    icon: Trophy,
    title: "Oyunlaşdırma",
    description: "Nişanlar, liderlik cədvəlləri və uğur sistemi ilə motivasiya. Xal sistemi və səviyyə keçmə.",
    color: "bg-yellow-500",
    gradient: "from-yellow-500 to-yellow-600",
  },
]

const stats = [
  { label: "Aktiv İstifadəçi", value: "25,000+", icon: Users, color: "text-blue-600" },
  { label: "Yaradılmış Test", value: "150,000+", icon: BookOpen, color: "text-green-600" },
  { label: "Tamamlanmış Cəhd", value: "2.5M+", icon: CheckCircle, color: "text-purple-600" },
  { label: "Uğur Nisbəti", value: "%92", icon: Target, color: "text-orange-600" },
]

const testimonials = [
  {
    name: "Dr. Ayşə Qayeva",
    role: "Riyaziyyat Müəllimi",
    avatar: "AQ",
    content: "Squiz ilə tələbələrimin riyaziyyat performansı %40 artdı. Real vaxt analitik xüsusiyyəti əla!",
    rating: 5,
  },
  {
    name: "Prof. Mehmet Dəmir",
    role: "Kompüter Mühəndisliyi",
    content:
      "Proqramlaşdırma dərslərində Squiz istifadə edirəm. Tələbələr çox məmnun, interaktiv xüsusiyyətlər mükəmməl.",
    rating: 5,
  },
  {
    name: "Zeynəb Yılmaz",
    role: "Lise Tələbəsi",
    content: "Test həll etmək artıq çox əyləncəli! Forumda suallarıma dərhal cavab tapıram.",
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: "Pulsuz",
    price: "₼0",
    period: "/ay",
    description: "Fərdi istifadə üçün",
    features: ["5 test yaratma", "50 tələbə limiti", "Əsas analitika", "İcma forumu", "Email dəstək"],
    buttonText: "Pulsuz Başla",
    popular: false,
  },
  {
    name: "Pro",
    price: "₼99",
    period: "/ay",
    description: "Müəllimlər üçün",
    features: ["Limitsiz test", "500 tələbə", "Təkmil analitika", "Xüsusi brending", "Prioritet dəstək", "API girişi"],
    buttonText: "Pro-ya Keç",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₼299",
    period: "/ay",
    description: "Qurumlar üçün",
    features: [
      "Limitsiz hər şey",
      "SSO inteqrasiyası",
      "Xüsusi domen",
      "Dedicated dəstək",
      "SLA zəmanəti",
      "Xüsusi inkişaf",
    ],
    buttonText: "Əlaqə Saxla",
    popular: false,
  },
]

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { user, isLoading } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      window.location.href = "/dashboard"
    } else {
      setAuthMode("register")
      setShowAuthModal(true)
    }
  }

  const handleLogin = () => {
    setAuthMode("login")
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TestHub
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Xüsusiyyətlər
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Qiymətlər
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Rəylər
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Haqqımızda
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Xoş gəldin, {user.name}</span>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" onClick={handleLogin} className="font-medium">
                    Daxil Ol
                  </Button>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Pulsuz Başla
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="container mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 border-0 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Yeni: AI dəstəkli sual yaratma xüsusiyyəti
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Təhsilin Gələcəyi
              </span>
              <br />
              <span className="text-gray-900">Burada Başlayır</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              TestHub ilə test yaratma, tələbə qiymətləndirmə və öğrənmə analitikasını tək platformada birləşdirin.
              Müasir təhsil üçün hazırlanmış əhatəli həll ilə öğrənmə təcrübəsini dönüşdürün.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Pulsuz Başla
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Demo İzlə
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>GDPR Uyğun</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>50+ Ölkədə İstifadə</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 İstifadəçi Qiyməti</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white rounded-full shadow-lg">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Xüsusiyyətlər</Badge>
            <h2 className="text-4xl font-bold mb-4">Güclü Xüsusiyyətlər</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Təhsil prosesini dönüşdürəcək müasir alətlər və xüsusiyyətlər
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md group-hover:-translate-y-2">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Rəylər</Badge>
            <h2 className="text-4xl font-bold mb-4">İstifadəçilərimiz Nə Deyir?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Minlərlə müəllim və tələbə TestHub ilə uğura çatır
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">Qiymətlər</Badge>
            <h2 className="text-4xl font-bold mb-4">Sizə Uyğun Planı Seçin</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ehtiyaclarınıza görə hazırlanmış çevik qiymətləndirmə seçimləri
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Ən Populyar
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full ${plan.popular ? "border-2 border-blue-500 shadow-xl scale-105" : "border shadow-lg"} hover:shadow-xl transition-all duration-300`}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={handleGetStarted}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Təhsil Təcrübənizi Dönüşdürməyə Hazırsınız?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Minlərlə müəllim və tələbə TestHub ilə öğrənmə məqsədlərinə çatır. Siz də bu icmaya qoşulun və fərqi
              dərhal təcrübə edin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dərhal Başla - Pulsuz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
              >
                Demo Tələb Et
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TestHub</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Müasir təhsil üçün hazırlanmış əhatəli test və qiymətləndirmə platforması. Öğrənmə təcrübəsini
                dönüşdürən yenilikçi həllər təqdim edirik.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Twitter
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  LinkedIn
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  GitHub
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Məhsul</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Xüsusiyyətlər
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Qiymətlər
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    İnteqrasiyalar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Təhlükəsizlik
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Dəstək</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sənədlər
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Yardım Mərkəzi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Əlaqə
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    İcma
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Şirkət</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Haqqımızda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Karyera
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Mətbuat
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Məxfilik
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 TestHub. Bütün hüquqlar qorunur.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Məxfilik Siyasəti
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                İstifadə Şərtləri
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Çərəzlər
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
