"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MathEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MathEditor({ value, onChange, placeholder = "Riyazi ifadə daxil edin..." }: MathEditorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  // Genişləndirilmiş riyazi simvollar və şablonlar
  const mathSymbols = {
    basic: [
      { symbol: "√", template: "√{}", name: "Kvadrat kök", example: "√16 = 4" },
      { symbol: "∛", template: "∛{}", name: "Kub kök", example: "∛8 = 2" },
      { symbol: "∜", template: "∜{}", name: "Dördüncü kök", example: "∜16 = 2" },
      { symbol: "²", template: "²", name: "Kvadrat", example: "x²" },
      { symbol: "³", template: "³", name: "Kub", example: "x³" },
      { symbol: "ⁿ", template: "^{n}", name: "n-ci dərəcə", example: "x^n" },
      { symbol: "₁", template: "₁", name: "Alt indeks 1", example: "x₁" },
      { symbol: "₂", template: "₂", name: "Alt indeks 2", example: "x₂" },
      { symbol: "ₙ", template: "_{n}", name: "Alt indeks n", example: "x_n" },
    ],
    fractions: [
      { symbol: "½", template: "1/2", name: "Yarım", example: "½" },
      { symbol: "⅓", template: "1/3", name: "Üçdə bir", example: "⅓" },
      { symbol: "¼", template: "1/4", name: "Dörddə bir", example: "¼" },
      { symbol: "¾", template: "3/4", name: "Dörddə üç", example: "¾" },
      { symbol: "⅔", template: "2/3", name: "Üçdə iki", example: "⅔" },
      { symbol: "⅛", template: "1/8", name: "Səkkizdə bir", example: "⅛" },
      { symbol: "⅜", template: "3/8", name: "Səkkizdə üç", example: "⅜" },
      { symbol: "⅝", template: "5/8", name: "Səkkizdə beş", example: "⅝" },
      { symbol: "⅞", template: "7/8", name: "Səkkizdə yeddi", example: "⅞" },
    ],
    advanced: [
      { symbol: "∑", template: "∑_{i=1}^{n}", name: "Cəm", example: "∑_{i=1}^{n} i" },
      { symbol: "∏", template: "∏_{i=1}^{n}", name: "Hasil", example: "∏_{i=1}^{n} i" },
      { symbol: "∫", template: "∫_{a}^{b}", name: "İnteqral", example: "∫_{0}^{1} x dx" },
      { symbol: "∮", template: "∮", name: "Kontur inteqralı", example: "∮ F·dr" },
      { symbol: "∂", template: "∂/∂x", name: "Qismən törəmə", example: "∂f/∂x" },
      { symbol: "∇", template: "∇", name: "Nabla", example: "∇f" },
      { symbol: "∆", template: "∆", name: "Delta", example: "∆x" },
      { symbol: "lim", template: "lim_{x→∞}", name: "Limit", example: "lim_{x→∞} f(x)" },
    ],
    greek: [
      { symbol: "α", template: "α", name: "Alfa", example: "α = 30°" },
      { symbol: "β", template: "β", name: "Beta", example: "β-decay" },
      { symbol: "γ", template: "γ", name: "Qamma", example: "γ-ray" },
      { symbol: "δ", template: "δ", name: "Delta", example: "δx" },
      { symbol: "ε", template: "ε", name: "Epsilon", example: "ε > 0" },
      { symbol: "θ", template: "θ", name: "Teta", example: "θ = 45°" },
      { symbol: "λ", template: "λ", name: "Lambda", example: "λ = 550nm" },
      { symbol: "μ", template: "μ", name: "Mu", example: "μ = 0.5" },
      { symbol: "π", template: "π", name: "Pi", example: "π ≈ 3.14159" },
      { symbol: "σ", template: "σ", name: "Sigma", example: "σ² = variance" },
      { symbol: "φ", template: "φ", name: "Fi", example: "φ = golden ratio" },
      { symbol: "ω", template: "ω", name: "Omega", example: "ω = angular velocity" },
    ],
    operators: [
      { symbol: "±", template: "±", name: "Plus-minus", example: "x = ±5" },
      { symbol: "∓", template: "∓", name: "Minus-plus", example: "x = ∓5" },
      { symbol: "×", template: "×", name: "Vurma", example: "3 × 4 = 12" },
      { symbol: "÷", template: "÷", name: "Bölmə", example: "12 ÷ 3 = 4" },
      { symbol: "≤", template: "≤", name: "Kiçik bərabər", example: "x ≤ 5" },
      { symbol: "≥", template: "≥", name: "Böyük bərabər", example: "x ≥ 0" },
      { symbol: "≠", template: "≠", name: "Bərabər deyil", example: "x ≠ 0" },
      { symbol: "≈", template: "≈", name: "Təxminən", example: "π ≈ 3.14" },
      { symbol: "≡", template: "≡", name: "Eynidir", example: "a ≡ b (mod n)" },
      { symbol: "∝", template: "∝", name: "Mütənasibdir", example: "F ∝ ma" },
    ],
    geometry: [
      { symbol: "°", template: "°", name: "Dərəcə", example: "90°" },
      { symbol: "∠", template: "∠", name: "Bucaq", example: "∠ABC" },
      { symbol: "△", template: "△", name: "Üçbucaq", example: "△ABC" },
      { symbol: "□", template: "□", name: "Kvadrat", example: "□ABCD" },
      { symbol: "○", template: "○", name: "Dairə", example: "○O" },
      { symbol: "⊥", template: "⊥", name: "Perpendikulyar", example: "AB ⊥ CD" },
      { symbol: "∥", template: "∥", name: "Paralel", example: "AB ∥ CD" },
      { symbol: "≅", template: "≅", name: "Konqruent", example: "△ABC ≅ △DEF" },
      { symbol: "∼", template: "∼", name: "Bənzər", example: "△ABC ∼ △DEF" },
    ],
    functions: [
      { symbol: "sin", template: "sin()", name: "Sinus", example: "sin(30°) = 0.5" },
      { symbol: "cos", template: "cos()", name: "Kosinus", example: "cos(60°) = 0.5" },
      { symbol: "tan", template: "tan()", name: "Tangens", example: "tan(45°) = 1" },
      { symbol: "cot", template: "cot()", name: "Kotangens", example: "cot(45°) = 1" },
      { symbol: "sec", template: "sec()", name: "Sekans", example: "sec(60°) = 2" },
      { symbol: "csc", template: "csc()", name: "Kosekans", example: "csc(30°) = 2" },
      { symbol: "log", template: "log()", name: "Loqarifm", example: "log₁₀(100) = 2" },
      { symbol: "ln", template: "ln()", name: "Təbii loqarifm", example: "ln(e) = 1" },
      { symbol: "exp", template: "exp()", name: "Eksponensial", example: "exp(1) = e" },
    ],
  }

  // Şablon ifadələr
  const templates = [
    { name: "Kvadrat formula", template: "x = (-b ± √(b² - 4ac)) / (2a)", example: "Kvadrat tənliyin həlli" },
    { name: "Pifaqor teoremi", template: "a² + b² = c²", example: "Düzbucaqlı üçbucaq" },
    { name: "Sahə (dairə)", template: "S = πr²", example: "Dairənin sahəsi" },
    { name: "Həcm (kürə)", template: "V = (4/3)πr³", example: "Kürənin həcmi" },
    { name: "Kinetic enerji", template: "E_k = (1/2)mv²", example: "Fizika formulası" },
    { name: "Ohm qanunu", template: "V = IR", example: "Elektrik qanunu" },
    { name: "Einstein tənliyi", template: "E = mc^2", example: "Nisbilik nəzəriyyəsi" },
    { name: "Kəsr şablonu", template: "(a + b) / (c + d)", example: "Ümumi kəsr" },
    { name: "Kök ifadəsi", template: "√(x² + y²)", example: "Məsafə formulası" },
    { name: "İnteqral", template: "∫₀¹ e^(-x²) dx = √π/2", example: "Qauss inteqralı" },
  ]

  const insertSymbol = (template: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    // Şablonda {} varsa, kursoru oraya yerləşdir
    const cursorOffset = template.includes("{}") ? template.indexOf("{}") : template.length
    const newText = before + template + after

    onChange(newText)

    // Kursoru düzgün yerə yerləşdir
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertTemplate = (template: string) => {
    insertSymbol(template)
  }

  // Riyazi ifadəni render etmək üçün sadə parser
  const renderMathPreview = (text: string) => {
    if (!text) return "Önizləmə burada görünəcək..."

    // Sadə render - real tətbiqdə MathJax və ya KaTeX istifadə ediləcək
    const rendered = text
      .replace(/\^{([^}]+)}/g, "<sup>$1</sup>")
      .replace(/_{([^}]+)}/g, "<sub>$1</sub>")
      .replace(/√{([^}]+)}/g, "√($1)")
      .replace(/∫_{([^}]+)}\^{([^}]+)}/g, "∫<sub>$1</sub><sup>$2</sup>")
      .replace(/∑_{([^}]+)}\^{([^}]+)}/g, "∑<sub>$1</sub><sup>$2</sup>")
      .replace(/lim_{([^}]+)}/g, "lim<sub>$1</sub>")

    return rendered
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Riyazi İfadə Editoru</Label>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-24 p-3 border rounded-lg resize-none font-mono text-sm"
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement
            setCursorPosition(target.selectionStart)
          }}
        />
      </div>

      {/* Önizləmə */}
      {value && (
        <div className="p-3 bg-blue-50 rounded-lg border">
          <Label className="text-sm text-blue-700 mb-2 block">Önizləmə:</Label>
          <div
            className="text-lg font-serif bg-white p-3 rounded border min-h-[60px] flex items-center"
            dangerouslySetInnerHTML={{ __html: renderMathPreview(value) }}
          />
        </div>
      )}

      {/* Simvollar və Şablonlar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Riyazi Simvollar və Şablonlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4">
              <TabsTrigger value="basic" className="text-xs">
                Əsas
              </TabsTrigger>
              <TabsTrigger value="fractions" className="text-xs">
                Kəsr
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                Qabaqcıl
              </TabsTrigger>
              <TabsTrigger value="greek" className="text-xs">
                Yunan
              </TabsTrigger>
              <TabsTrigger value="operators" className="text-xs">
                Operator
              </TabsTrigger>
              <TabsTrigger value="geometry" className="text-xs">
                Həndəsə
              </TabsTrigger>
              <TabsTrigger value="functions" className="text-xs">
                Funksiya
              </TabsTrigger>
            </TabsList>

            {Object.entries(mathSymbols).map(([category, symbols]) => (
              <TabsContent key={category} value={category} className="space-y-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {symbols.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => insertSymbol(item.template)}
                      className="h-12 flex flex-col items-center justify-center hover:bg-blue-50 group"
                      title={`${item.name} - ${item.example}`}
                    >
                      <span className="text-lg font-serif">{item.symbol}</span>
                      <span className="text-xs text-gray-500 group-hover:text-blue-600">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Şablon İfadələr */}
          <div className="mt-6 space-y-3">
            <Label className="text-sm font-medium">Hazır Şablonlar</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => insertTemplate(template.template)}
                  className="h-auto p-3 flex flex-col items-start text-left hover:bg-green-50"
                  title={template.example}
                >
                  <span className="font-medium text-sm">{template.name}</span>
                  <span className="font-mono text-xs text-gray-600 mt-1">{template.template}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Kömək məlumatı */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">İpucu:</Label>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Dərəcə üçün: x^{2} → x²</p>
              <p>• Alt indeks üçün: x_{1} → x₁</p>
              <p>• Kök üçün: √{16} → √16</p>
              <p>• Kəsr üçün: (a+b)/(c+d)</p>
              <p>
                • İnteqral üçün: ∫_{0}^{1}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
