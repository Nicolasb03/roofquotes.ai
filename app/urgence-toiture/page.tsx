"use client"

import { AddressInput } from "@/components/address-input"
import { useLanguage } from "@/lib/language-context"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Shield, Clock, Users, CheckCircle, Award } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UrgenceToiturePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [address, setAddress] = useState("")

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/images/logo-fr.png" alt="Soumission Toiture AI" className="h-[80px] w-auto" />
          </div>
          <Badge className="bg-orange-500 text-white border-orange-500 px-4 py-2">
            Comparateur #1 au Québec
          </Badge>
        </div>
      </header>

      {/* Hero Section - Craver Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('/images/heroimage.jpg?v=${Date.now()}')`
          }}
        />
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 flex items-center justify-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            
            {/* Left Side - Content */}
            <div className="text-white">
              <div className="mb-6">
                <Badge className="bg-orange-500 text-white border-orange-500 px-4 py-2 text-sm font-medium">
                  Réparation Toiture Spécialisée
                </Badge>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Réparation de
                <br />
                <span className="text-orange-400">Toiture</span> au Québec
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Comparez les prix de réparation de toiture et obtenez les meilleures soumissions d'entrepreneurs certifiés au Québec.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Estimation Gratuite</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Économisez 30%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Entrepreneurs Certifiés</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Résultats en 60 Secondes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Aucune Inscription</span>
                </div>
              </div>
            </div>

            {/* Right Side - Solid Box Form */}
            <div className="w-full">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    Comparez les Prix de Réparation
                  </h2>
                  <p className="text-gray-600">
                    Obtenez 3-5 soumissions d'entrepreneurs spécialisés en réparation de toiture
                  </p>
                </div>

                {/* Address Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Entrez votre adresse
                  </label>
                  <AddressInput
                    onAddressSelect={setAddress}
                    onAnalyze={() => {
                      if (address.trim()) {
                        router.push(`/analysis?address=${encodeURIComponent(address)}`)
                      }
                    }}
                  />
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Analyse IA de votre toiture</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Spécialistes en réparation</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Comparaison transparente des prix</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Vos données sont protégées et sécurisées</span>
                  </div>
                  <p>Service 100% gratuit • Aucune inscription requise</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Repair Types Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Types de Réparations Couvertes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos entrepreneurs partenaires sont spécialisés dans tous types de réparations de toiture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fuites et Infiltrations",
                description: "Réparation rapide des fuites d'eau et infiltrations dans votre toiture",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                title: "Bardeaux Endommagés",
                description: "Remplacement de bardeaux cassés, décollés ou manquants",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                title: "Gouttières",
                description: "Réparation et nettoyage de gouttières et descentes pluviales",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                title: "Isolation",
                description: "Amélioration de l'isolation pour réduire les pertes énergétiques",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                title: "Ventilation",
                description: "Installation et réparation de systèmes de ventilation de toiture",
                color: "text-indigo-500",
                bgColor: "bg-indigo-50"
              },
              {
                title: "Urgences",
                description: "Interventions rapides pour dommages causés par intempéries",
                color: "text-red-500",
                bgColor: "bg-red-50"
              }
            ].map((repair, index) => (
              <div key={index} className={`${repair.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <h3 className={`text-xl font-bold ${repair.color} mb-3`}>{repair.title}</h3>
                <p className="text-gray-600">{repair.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Besoin de Réparations Rapidement?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Comparez les prix et trouvez le meilleur entrepreneur pour vos réparations de toiture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Estimation Gratuite</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <CheckCircle className="w-5 h-5" />
              <span>Entrepreneurs Vérifiés</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-400">
              <CheckCircle className="w-5 h-5" />
              <span>Économisez 30%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
