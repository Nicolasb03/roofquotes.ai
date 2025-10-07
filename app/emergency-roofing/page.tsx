"use client"

import { AddressInput } from "@/components/address-input"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Shield, Clock, Users, CheckCircle, Award, AlertTriangle } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EmergencyRoofingPage() {
  const router = useRouter()
  const [address, setAddress] = useState("")

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/images/myroofer.png" alt="My Roofer.ai" className="h-[80px] w-auto" />
          </div>
          <Badge className="bg-red-500 text-white border-red-500 px-4 py-2">
            24/7 Emergency Service
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
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
                <Badge className="bg-red-500 text-white border-red-500 px-4 py-2 text-sm font-medium">
                  Emergency Roofing Specialists
                </Badge>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Emergency
                <br />
                <span className="text-red-400">Roof Repair</span> Services
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Fast emergency roof repair services from certified contractors. Get immediate help for storm damage, leaks, and urgent roofing issues.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <span className="text-sm font-medium">24/7 Response</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Save Up to 30%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Licensed Contractors</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Free Quotes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Insurance Claims Help</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 max-w-lg mx-auto border-2 border-red-100">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 mr-2" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Emergency Roof Repair
                    </h2>
                  </div>
                  <p className="text-gray-600">
                    Get immediate help from emergency roofing specialists in your area
                  </p>
                </div>

                {/* Address Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter your address for immediate help
                  </label>
                  <AddressInput
                    onAddressSelect={setAddress}
                    onAnalyze={() => {
                      if (address.trim()) {
                        router.push(`/analysis?address=${encodeURIComponent(address)}&emergency=true`)
                      }
                    }}
                  />
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>AI roof damage assessment</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Emergency repair specialists</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Insurance claim assistance</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Your information is secure and protected</span>
                  </div>
                  <p>100% free service • No registration required</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Emergency Roofing Services We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our network of emergency contractors specializes in all types of urgent roofing repairs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Storm Damage Repair",
                description: "Immediate response to wind, hail, and storm damage with emergency tarping and repairs",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                title: "Leak Detection & Repair",
                description: "Fast leak detection and emergency sealing to prevent water damage",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                title: "Missing Shingles",
                description: "Quick replacement of missing or damaged shingles and roofing materials",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                title: "Gutter Emergencies",
                description: "Emergency gutter repair and cleaning to prevent water damage",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                title: "Structural Damage",
                description: "Emergency structural repairs and temporary reinforcement solutions",
                color: "text-indigo-500",
                bgColor: "bg-indigo-50"
              },
              {
                title: "Tree Damage",
                description: "Immediate response to tree damage with debris removal and roof repair",
                color: "text-red-500",
                bgColor: "bg-red-50"
              }
            ].map((service, index) => (
              <div key={index} className={`${service.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <h3 className={`text-xl font-bold ${service.color} mb-3`}>{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Need Emergency Roof Repair Now?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't wait - get immediate help from emergency roofing specialists in your area
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>24/7 Emergency Response</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <CheckCircle className="w-5 h-5" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-400">
              <CheckCircle className="w-5 h-5" />
              <span>Insurance Claims Help</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
