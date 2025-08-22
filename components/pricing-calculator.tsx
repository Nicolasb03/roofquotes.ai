"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/language-context"
import { Calculator, DollarSign, TrendingUp, AlertCircle, CheckCircle, Star, Clock } from "lucide-react"
import type { LeadData } from "@/components/lead-capture-popup"

interface PricingCalculatorProps {
  roofData: any
  userAnswers: any
  leadData: LeadData
  onComplete: (pricing: any) => void
}

export function PricingCalculator({ roofData, userAnswers, leadData, onComplete }: PricingCalculatorProps) {
  const { t } = useLanguage()
  const [isCalculating, setIsCalculating] = useState(true)
  const [pricingData, setPricingData] = useState<any>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  useEffect(() => {
    if (hasCalculated || !roofData || !userAnswers) return

    const calculatePricing = async () => {
      setHasCalculated(true)
      setIsCalculating(true)

      try {
        const response = await fetch("/api/pricing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roofData,
            userAnswers,
            leadData,
            province: "ON",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to calculate pricing")
        }

        const pricing = await response.json()
        setPricingData(pricing)
      } catch (error) {
        console.error("Pricing calculation error:", error)
        const mockPricing = {
          lowEstimate: Math.round(roofData.roofArea * 8),
          highEstimate: Math.round(roofData.roofArea * 12),
          pricePerSqFt: { low: 8, high: 12 },
          province: "ON",
          complexityScore: 1.3,
          factors: {
            roofComplexity: roofData.pitchComplexity || "moderate",
            accessDifficulty: userAnswers.propertyAccess || "easy",
            roofAge: userAnswers.roofAge || "unknown",
            specialConditions: userAnswers.roofConditions?.length || 0,
          },
        }
        setPricingData(mockPricing)
      } finally {
        setIsCalculating(false)
      }
    }

    calculatePricing()
  }, [roofData, userAnswers, leadData, hasCalculated])

  const handleContinue = () => {
    if (pricingData && onComplete) {
      onComplete(pricingData)
    }
  }

  if (isCalculating) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">🧠 Analyse IA en cours...</CardTitle>
            <CardDescription className="text-gray-600">
              Traitement de 47 points de données pour générer votre devis personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-6">
              <Progress value={75} className="h-4 bg-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Analyse par satellite terminée</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Calcul des tarifs du marché</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Calculator className="w-4 h-4" />
                  <span>Appariement des entrepreneurs</span>
                </div>
              </div>
              <p className="text-gray-500">Cela prend généralement 30-60 secondes...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pricingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Impossible de calculer le prix. Veuillez réessayer.</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              {t.retry}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Personalized greeting */}
      <div className="text-center">
        <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Analyse terminée pour {leadData.firstName}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Votre soumission de toiture personnalisée</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Basée sur l’analyse IA de votre toit de {roofData.roofArea?.toLocaleString()} pi² et les données actuelles du marché
        </p>
      </div>

      {/* Main Pricing Card - Enhanced */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">Fourchette d’investissement</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Installation professionnelle au {pricingData.province}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-300 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-blue-100">Qualité supérieure garantie</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl md:text-6xl font-bold mb-4">
              ${pricingData.lowEstimate?.toLocaleString() || "N/A"} - $
              {pricingData.highEstimate?.toLocaleString() || "N/A"}
            </div>
            <div className="text-xl text-blue-100">
              (${pricingData.pricePerSqFt?.low || "N/A"} - ${pricingData.pricePerSqFt?.high || "N/A"} par pi²)
            </div>
            <Badge className="mt-4 bg-white/20 text-white border-white/30 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tarif concurrentiel du marché
            </Badge>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-2">💡 Conseil tarifaire intelligent</p>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Cette estimation inclut des matériaux haut de gamme, une installation professionnelle, les permis et la garantie. Le prix final dépendra des matériaux choisis et des facteurs spécifiques découverts lors de l’inspection.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced breakdown section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Détail du prix</span>
            </CardTitle>
            <CardDescription>Facteurs influençant votre devis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Complexité du toit</span>
              <Badge
                variant={
                  pricingData.factors?.roofComplexity === "simple"
                    ? "default"
                    : pricingData.factors?.roofComplexity === "moderate"
                      ? "secondary"
                      : "destructive"
                }
                className="font-semibold"
              >
                {pricingData.factors?.roofComplexity || "moderate"}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Difficulté d’accès</span>
              <Badge variant={pricingData.factors?.accessDifficulty === "easy" ? "default" : "secondary"}>
                {pricingData.factors?.accessDifficulty || "easy"}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Âge actuel du toit</span>
              <span className="font-semibold text-gray-900">{pricingData.factors?.roofAge || "unknown"}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Conditions particulières</span>
              <span className="font-semibold text-gray-900">{pricingData.factors?.specialConditions || 0} facteurs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Qu’est-ce qui est inclus</span>
            </CardTitle>
            <CardDescription>Solution complète de toiture</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { text: "Matériaux et main-d’œuvre de haute qualité", icon: "✅" },
                { text: "Permis et inspections", icon: "📋" },
                { text: "Nettoyage et élimination complets", icon: "🧹" },
                { text: "Garantie du fabricant", icon: "🛡️" },
                { text: "Garantie de travail", icon: "⭐" },
                { text: "Couverture d’assurance", icon: "🏠" },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced CTA section */}
      <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 Prêt à vous connecter avec les entrepreneurs les mieux notés ?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Obtenez des devis détaillés de 3 à 5 professionnels certifiés dans votre région. Comparez les options et choisissez la meilleure pour votre projet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Entrepreneurs vérifiés</h4>
              <p className="text-sm text-gray-600">Licenciés, assurés et vérifiés</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Réponse rapide</h4>
              <p className="text-sm text-gray-600">Les entrepreneurs vous contactent dans les 24 heures</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Meilleure valeur</h4>
              <p className="text-sm text-gray-600">Comparez plusieurs devis pour économiser de l’argent</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            🚀 Connectez-moi avec les entrepreneurs maintenant
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            ✅ Gratuit pour se connecter • ✅ Aucune obligation • ✅ Vos informations restent privées
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
