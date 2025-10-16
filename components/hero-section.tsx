"use client"

import { AddressInput } from "@/components/address-input"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Shield, Clock, Users, CheckCircle, MapPin, Search } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  region?: 'us' | 'canada'
}

export function HeroSection({ region = 'us' }: HeroSectionProps) {
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [addressData, setAddressData] = useState<any>(null)
  
  const isCanada = region === 'canada'
  const badgeText = isCanada ? '#1 Roofing Quote Platform in Canada' : '#1 Roofing Quote Platform in USA'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('/images/heroimage.jpg')`,
          isolation: 'isolate'
        }}
      />
      
      {/* Main Content - Mobile Optimized */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 flex items-center justify-center min-h-screen py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl w-full">
          
          {/* Left Side - Content */}
          <div className="text-white text-center lg:text-left order-2 lg:order-1">
            <div className="mb-4 lg:mb-6">
              <Badge className="bg-orange-500 text-white border-orange-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
                {badgeText}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight">
              Get Your AI Roofing Estimate in <span className="text-orange-400">60 Seconds</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Instantly analyze your roof using advanced satellite data and get 3 verified contractor quotes without the hassle.
            </p>

            {/* Key Benefits - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 lg:mb-8">
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Free Estimates</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Save Up to 30%</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Licensed Contractors</span>
              </div>
            </div>

            {/* Trust Indicators - Mobile Optimized */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 sm:gap-4 mb-6 lg:mb-8 text-xs sm:text-sm">
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span>50,000+ Comparisons</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form - Mobile Optimized */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md mx-auto lg:mx-0">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Enter your address
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Get your estimate in 60 seconds
                </p>
              </div>

              <form className="space-y-4 sm:space-y-6">
                {/* Address Input - Mobile Optimized */}
                <div className="relative">
                  <AddressInput 
                    region={region}
                    onAddressSelect={(selectedAddress, data) => {
                      setAddress(selectedAddress)
                      setAddressData(data)
                      console.log('📍 Address data captured:', data)
                    }}
                    onAnalyze={() => {
                      if (address.trim()) {
                        const analysisPath = isCanada ? '/ca/analysis' : '/analysis'
                        const params = new URLSearchParams({
                          address: address
                        })
                        if (addressData) {
                          params.set('addressData', JSON.stringify(addressData))
                        }
                        router.push(`${analysisPath}?${params.toString()}`)
                      }
                    }}
                    className="w-full"
                  />
                </div>
                                {/* Submit Button - Mobile Optimized */}
                                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    if (address.trim()) {
                      const analysisPath = isCanada ? '/ca/analysis' : '/analysis'
                      const params = new URLSearchParams({
                        address: address
                      })
                      if (addressData) {
                        params.set('addressData', JSON.stringify(addressData))
                      }
                      router.push(`${analysisPath}?${params.toString()}`)
                    }
                  }}
                  disabled={!address.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Get My Free Estimate</span>
                  </div>
                </button>

                {/* Trust Features - Mobile Optimized */}
                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-green-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">AI roof analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-green-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">3-5 contractor quotes</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-green-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Transparent price comparison</span>
                  </div>
                </div>

                {/* Privacy Notice - Mobile Optimized */}
                <div className="flex items-center justify-center space-x-2 pt-3 sm:pt-4 border-t border-gray-100">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    Your data is protected and secure
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
