"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { RoofAnalysisResults } from "@/components/roof-analysis-results"
import { UserQuestionnaire } from "@/components/user-questionnaire"
import { PricingCalculator } from "@/components/pricing-calculator"
import { LeadCaptureForm } from "@/components/lead-capture-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Zap, Clock, CheckCircle } from 'lucide-react'
import Link from "next/link"
import type { LeadData } from "@/components/lead-capture-popup"

type AnalysisStep = "loading" | "results" | "questionnaire" | "lead-capture" | "pricing"

export default function AnalysisPage() {
  const searchParams = useSearchParams()

  // State declarations need to come before effects to avoid TDZ errors
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("loading")
  const [roofData, setRoofData] = useState<any>(null)
  const [userAnswers, setUserAnswers] = useState<any>(null)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [pricingData, setPricingData] = useState<any>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  // Ensure viewport resets to top on step change (especially when navigating to questionnaire/pricing pages)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [currentStep])

  const address = useMemo(() => searchParams.get("address") || "", [searchParams])
  const dataParam = useMemo(() => searchParams.get("data"), [searchParams])

  useEffect(() => {
    if (hasAnalyzed || !address) return

    const analyzeRoof = async () => {
      setHasAnalyzed(true)

      if (dataParam) {
        try {
          const parsedRoofData = JSON.parse(decodeURIComponent(dataParam))
          setRoofData({ ...parsedRoofData, address })
          setCurrentStep("results")
          return
        } catch (error) {
          console.error("Error parsing roof data from URL:", error)
        }
      }

      try {
        const response = await fetch("/api/roof-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to analyze roof")
        }

        const data = await response.json()
        setRoofData({ ...data.roofData, address })
        setCurrentStep("results")
      } catch (error) {
        console.error("Roof analysis error:", error)
        setCurrentStep("results")
        setRoofData({
          address,
          error: "Unable to analyze this address. Please try a different address.",
          roofArea: 2400,
          segments: 4,
          pitchComplexity: "moderate",
          buildingHeight: 25,
          obstacles: ["minimal obstacles"],
          accessDifficulty: "easy",
          roofShape: "moderate",
        })
      }
    }

    analyzeRoof()
  }, [address, dataParam, hasAnalyzed])

  const getStepProgress = () => {
    switch (currentStep) {
      case "loading":
        return 25
      case "results":
        return 40
      case "questionnaire":
        return 50
      case "lead-capture":
        return 75
      case "pricing":
        return 100
      default:
        return 0
    }
  }

  const getStepInfo = () => {
    switch (currentStep) {
      case "loading":
        return { title: "Analyzing Your Roof", subtitle: "AI processing satellite data", icon: Zap }
      case "results":
        return { title: "Analysis Complete", subtitle: "Review your roof details", icon: CheckCircle }
      case "questionnaire":
        return { title: "Project Details", subtitle: "Tell us about your needs", icon: Clock }
      case "lead-capture":
        return { title: "Connecting Contractors", subtitle: "Matching you with professionals", icon: CheckCircle }
      case "pricing":
        return { title: "Pricing Results", subtitle: "Your personalized estimate", icon: CheckCircle }
      default:
        return { title: "Processing", subtitle: "Please wait", icon: Clock }
    }
  }

  const handleQuestionnaireComplete = (answers: any, capturedLeadData: LeadData, pricingData: any) => {
    setUserAnswers(answers)
    setLeadData(capturedLeadData)
    setPricingData(pricingData)
    // Skip lead-capture step entirely since webhook was triggered from popup
    setCurrentStep("pricing")
  }

  const handleLeadCaptureComplete = (pricing: any) => {
    setPricingData(pricing)
    setCurrentStep("pricing")
  }

  const stepInfo = getStepInfo()
  const StepIcon = stepInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 max-w-xs truncate">{address}</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <StepIcon className="w-3 h-3 mr-1" />
                {stepInfo.title}
              </Badge>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className={currentStep === "loading" ? "text-blue-600 font-medium" : ""}>Analysis</span>
              <span className={currentStep === "results" ? "text-blue-600 font-medium" : ""}>Results</span>
              <span className={currentStep === "questionnaire" ? "text-blue-600 font-medium" : ""}>Questions</span>
              <span className={currentStep === "lead-capture" ? "text-blue-600 font-medium" : ""}>Connect</span>
              <span className={currentStep === "pricing" ? "text-blue-600 font-medium" : ""}>Pricing</span>
            </div>
            <Progress value={getStepProgress()} className="h-3 bg-gray-200" />
            <p className="text-xs text-gray-500 mt-1 text-center">{stepInfo.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === "loading" && (
          <Card className="max-w-3xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">AI Analyzing Your Roof...</CardTitle>
              <p className="text-gray-600 text-lg">Processing satellite imagery and market data</p>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Satellite Data Retrieved</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-4 rounded-xl">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Analyzing Roof Structure</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-400 bg-gray-50 p-4 rounded-xl">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Calculating Complexity</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-blue-100">
                  <p className="text-gray-600 mb-2">
                    <strong>Advanced AI Technology</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Our system analyzes 47+ data points including roof pitch, obstacles, access difficulty, and local
                    market conditions to provide the most accurate estimate possible.
                  </p>
                </div>
                <p className="text-gray-500">This usually takes 30-60 seconds...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "results" && roofData && (
          <RoofAnalysisResults roofData={roofData} onContinue={() => setCurrentStep("questionnaire")} />
        )}

        {currentStep === "questionnaire" && roofData && (
          <UserQuestionnaire roofData={roofData} onComplete={handleQuestionnaireComplete} />
        )}

        {currentStep === "lead-capture" && roofData && userAnswers && leadData && (
          <LeadCaptureForm roofData={roofData} userAnswers={userAnswers} leadData={leadData} onComplete={handleLeadCaptureComplete} />
        )}

        {currentStep === "pricing" && roofData && userAnswers && pricingData && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Request Sent Successfully!</h1>
              <p className="text-xl text-gray-600 mb-6">
                Your information has been sent to contractors. Here's your personalized estimate:
              </p>
              
              {/* CTA Button */}
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get 3 Precise Quotes from Local Roofers
              </Link>
            </div>

            {/* Pricing Results */}
            <Card className="shadow-2xl border-0 mb-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl">Your Personalized Quote</CardTitle>
                <p className="text-gray-600">Based on your roof analysis and preferences</p>
              </CardHeader>
              <CardContent className="p-8">
                {/* Investment Range */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl mb-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Estimated Investment</h3>
                  <div className="text-5xl font-bold mb-2">
                    ${pricingData.lowEstimate?.toLocaleString()} - ${pricingData.highEstimate?.toLocaleString()}
                  </div>
                  <p className="text-blue-100">Professional installation included</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{roofData.roofArea}</div>
                    <div className="text-gray-600">sq ft of roofing</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{pricingData.materialType || 'Standard'}</div>
                    <div className="text-gray-600">Recommended material</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">24-48h</div>
                    <div className="text-gray-600">Response time</div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span>Contractors will review your project details</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span>You'll receive calls/emails from interested contractors</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span>Schedule on-site evaluations for detailed quotes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span>Compare quotes and choose your preferred contractor</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info Confirmation */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Your Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {leadData?.firstName} {leadData?.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {leadData?.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {leadData?.phone}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {roofData.address}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
