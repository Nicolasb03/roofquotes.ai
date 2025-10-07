"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, DollarSign, TrendingUp, AlertCircle, CheckCircle, Star, Clock } from "lucide-react"
import type { LeadData } from "@/components/lead-capture-popup"

interface PricingCalculatorProps {
  roofData: any
  userAnswers: any
  leadData: LeadData
  onComplete: (pricing: any) => void
}

export function PricingCalculator({ roofData, userAnswers, leadData, onComplete }: PricingCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(true)
  const [pricingData, setPricingData] = useState<any>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [showSellingQuestion, setShowSellingQuestion] = useState(false)
  const [sellingHouse, setSellingHouse] = useState(null)

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
            province: "US",
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
          province: "US",
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
    if (!showSellingQuestion) {
      setShowSellingQuestion(true)
      return
    }
    
    if (pricingData && sellingHouse !== null) {
      const enhancedPricing = {
        ...pricingData,
        sellingHouse: sellingHouse
      }
      onComplete(enhancedPricing)
    }
  }

  const handleSellingHouseResponse = async (response: string) => {
    setSellingHouse(response)
    
    try {
      const sellingHousePayload = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        roofData,
        userAnswers,
        pricingData: {
          ...pricingData,
          sellingHouse: response
        },
        webhookType: "selling_house_update" 
      }
      
      console.log('CALLING /api/leads with selling house update:', sellingHousePayload)
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellingHousePayload),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('SELLING HOUSE WEBHOOK SUBMITTED SUCCESSFULLY:', result)
      } else {
        console.error('Selling house webhook failed:', response.status)
      }
      
    } catch (error) {
      console.error('Selling house webhook error:', error)
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
            <CardTitle className="text-2xl font-bold text-gray-900">AI Analysis in Progress...</CardTitle>
            <CardDescription className="text-gray-600">
              Processing 47 data points to generate your personalized quote
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-6">
              <Progress value={75} className="h-4 bg-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Satellite analysis complete</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Calculating market rates</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Calculator className="w-4 h-4" />
                  <span>Matching contractors</span>
                </div>
              </div>
              <p className="text-gray-500">This usually takes 30-60 seconds...</p>
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
            <p className="text-gray-600 mb-4">Unable to calculate pricing. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
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
          Analysis complete for {leadData.firstName}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Personalized Roofing Quote</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Based on AI analysis of your {roofData.roofArea?.toLocaleString()} sq ft roof and current market data
        </p>
      </div>

      {/* Main Pricing Card - Enhanced */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">Investment Range</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Professional installation in the US
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-300 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-blue-100">Premium quality guaranteed</p>
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
              (${pricingData.pricePerSqFt?.low || "N/A"} - ${pricingData.pricePerSqFt?.high || "N/A"} per sq ft)
            </div>
            <Badge className="mt-4 bg-white/20 text-white border-white/30 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Competitive market rate
            </Badge>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-2">Smart Pricing Insight</p>
                <p className="text-sm text-blue-100 leading-relaxed">
                  This estimate includes premium materials, professional installation, permits, and warranty. Final pricing will depend on chosen materials and specific factors discovered during inspection.
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
              <span>Price Breakdown</span>
            </CardTitle>
            <CardDescription>Factors influencing your quote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Roof Complexity</span>
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
              <span className="font-medium text-gray-700">Access Difficulty</span>
              <Badge variant={pricingData.factors?.accessDifficulty === "easy" ? "default" : "secondary"}>
                {pricingData.factors?.accessDifficulty || "easy"}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Current Roof Age</span>
              <span className="font-semibold text-gray-900">{pricingData.factors?.roofAge || "unknown"}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Special Conditions</span>
              <span className="font-semibold text-gray-900">{pricingData.factors?.specialConditions || 0} factors</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>What's Included</span>
            </CardTitle>
            <CardDescription>Complete roofing solution</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { text: "High-quality materials and labor" },
                { text: "Permits and inspections" },
                { text: "Complete cleanup and disposal" },
                { text: "Manufacturer warranty" },
                { text: "Workmanship guarantee" },
                { text: "Insurance coverage" },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Connect with Top-Rated Contractors?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get detailed quotes from 3-5 certified professionals in your area. Compare options and choose the best fit for your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Verified Contractors</h4>
              <p className="text-sm text-gray-600">Licensed, insured, and verified</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Fast Response</h4>
              <p className="text-sm text-gray-600">Contractors contact you within 24 hours</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Best Value</h4>
              <p className="text-sm text-gray-600">Compare multiple quotes to save money</p>
            </div>
          </div>

          {showSellingQuestion ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Are you selling your house in the next 12 months?</p>
              <Button
                size="lg"
                onClick={() => handleSellingHouseResponse('yes')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mr-4"
              >
                Yes
              </Button>
              <Button
                size="lg"
                onClick={() => handleSellingHouseResponse('no')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={handleContinue}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Connect Me with Contractors Now
            </Button>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Free to connect • No obligation • Your information stays private
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
