"use client"

import { AddressInput } from "@/components/address-input"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Shield, Clock, Users, MapPin, CheckCircle, Award } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

function RoofingContractorsPage() {
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
          <Badge className="bg-orange-500 text-white border-orange-500 px-4 py-2">
            #1 Roofing Platform in USA
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
                <Badge className="bg-orange-500 text-white border-orange-500 px-4 py-2 text-sm font-medium">
                  Trusted Local Contractors
                </Badge>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Find Top
                <br />
                <span className="text-orange-400">Roofing</span> Contractors
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Compare quotes from the best roofing contractors in your area. 
                Get multiple free estimates in minutes from licensed professionals.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Free Estimates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Save Up to 30%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">Local Contractors</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>10,000+ Completed Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Quick Response</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    Get Free Roofing Quotes
                  </h2>
                  <p className="text-gray-600">
                    Compare prices from the best local roofing contractors
                  </p>
                </div>

                {/* Address Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter your address
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
                    <span>Licensed local contractors</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>AI-powered roof analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Competitive pricing guaranteed</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>All contractors are licensed and insured</span>
                  </div>
                  <p>100% free service • No registration required</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Local Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Local Roofing Contractors?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Local contractors understand your area's climate, building codes, and provide personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Local Climate Expertise",
                description: "Deep understanding of your area's weather patterns and roofing challenges",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                title: "Quick Response Time",
                description: "Fast service and emergency repairs from contractors in your neighborhood",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                title: "Competitive Pricing",
                description: "Fair local rates without high travel costs or markup fees",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                title: "Quality Materials",
                description: "Access to materials suited for your local climate and building requirements",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                title: "Local References",
                description: "Verifiable work history and references from neighbors in your community",
                color: "text-indigo-500",
                bgColor: "bg-indigo-50"
              },
              {
                title: "Ongoing Support",
                description: "Long-term warranties and service from established local businesses",
                color: "text-red-500",
                bgColor: "bg-red-50"
              }
            ].map((advantage, index) => (
              <div key={index} className={`${advantage.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <h3 className={`text-xl font-bold ${advantage.color} mb-3`}>{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Homeowners Nationwide
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real customers across America
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold text-orange-500 mb-3">10,000+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold text-green-500 mb-3">500+</div>
              <div className="text-gray-600 font-medium">Verified Contractors</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold text-blue-500 mb-3">4.9★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold text-purple-500 mb-3">30%</div>
              <div className="text-gray-600 font-medium">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Your Roofing Quotes?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with the best roofing contractors in your area and save on your project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <CheckCircle className="w-5 h-5" />
              <span>Competitive Pricing</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-400">
              <CheckCircle className="w-5 h-5" />
              <span>100% Free Service</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RoofingContractorsPage;
