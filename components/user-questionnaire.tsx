"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LeadCapturePopup, type LeadData } from "@/components/lead-capture-popup"
import { CheckCircle, Clock, Zap, AlertCircle } from "lucide-react"

interface UserQuestionnaireProps {
  roofData: any
  onComplete: (answers: any, leadData: LeadData, pricingData: any) => void
}

export function UserQuestionnaire({ roofData, onComplete }: UserQuestionnaireProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    roofConditions: [] as string[],
    roofAge: "",
    roofMaterial: "",
    roofIssues: [] as string[],
    propertyAccess: "",
    serviceType: [] as string[],
    timeline: "",
    contactTime: "",
  })

  const steps = [
    { title: "Roof Conditions", key: "roofConditions" },
    { title: "Property Details", key: "details" },
    { title: "Service Needs", key: "services" },
    { title: "Timeline & Contact", key: "contact" },
  ]

  const getProgress = () => {
    let completed = 0
    if (answers.roofConditions.length > 0) completed++
    if (answers.roofAge && answers.roofMaterial && answers.propertyAccess) completed++
    if (answers.serviceType.length > 0) completed++
    if (answers.timeline && answers.contactTime) completed++
    return (completed / 4) * 100
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      roofConditions: checked
        ? [...prev.roofConditions, condition]
        : prev.roofConditions.filter((c) => c !== condition),
    }))
  }

  const handleIssueChange = (issue: string, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      roofIssues: checked ? [...prev.roofIssues, issue] : prev.roofIssues.filter((i) => i !== issue),
    }))
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      serviceType: checked ? [...prev.serviceType, service] : prev.serviceType.filter((s) => s !== service),
    }))
  }

  const handleGetPricing = () => {
    if (isFormValid()) {
      setShowLeadCapture(true)
    }
  }

  const handleLeadSubmit = async (leadData: LeadData) => {
    setIsSubmittingLead(true)
    console.log('POPUP FORM SUBMITTED! Starting webhook process...')
    console.log('Lead data:', leadData)
    console.log('Roof data:', roofData)
    console.log('User answers:', answers)

    try {
      // First calculate pricing
      console.log('Calculating pricing first...')
      let pricingData = null
      
      try {
        const pricingResponse = await fetch('/api/pricing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roofData,
            userAnswers: answers
          }),
        })
        
        if (pricingResponse.ok) {
          pricingData = await pricingResponse.json()
          console.log('PRICING CALCULATED:', pricingData)
        } else {
          console.error('Pricing calculation failed, using fallback')
          // Use fallback pricing if API fails
          pricingData = {
            lowEstimate: roofData.roofArea * 8, // $8 per sq ft
            highEstimate: roofData.roofArea * 12, // $12 per sq ft
            materialType: 'Standard',
            complexity: roofData.pitchComplexity || 'moderate'
          }
        }
      } catch (pricingError) {
        console.error('Pricing calculation error, using fallback:', pricingError)
        // Use fallback pricing if request fails
        pricingData = {
          lowEstimate: roofData.roofArea * 8,
          highEstimate: roofData.roofArea * 12,
          materialType: 'Standard',
          complexity: roofData.pitchComplexity || 'moderate'
        }
      }

      // Now prepare complete lead data with pricing included
      const leadPayload = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        roofData,
        userAnswers: answers,
        pricingData // Include pricing data in webhook payload
      }
      
      console.log('CALLING /api/leads with payload (including pricing):', leadPayload)
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadPayload),
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API ERROR - Status:', response.status)
        console.error('API ERROR - Text:', errorText)
        throw new Error(`API call failed: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('WEBHOOK SUBMITTED SUCCESSFULLY:', result)
      
      setShowLeadCapture(false)
      // Pass answers, leadData, and pricingData to complete the flow
      onComplete(answers, leadData, pricingData)
      
    } catch (error) {
      console.error('CRITICAL ERROR in popup submission:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      // Still proceed with fallback pricing to avoid blocking the user
      const fallbackPricing = {
        lowEstimate: roofData.roofArea * 8,
        highEstimate: roofData.roofArea * 12,
        materialType: 'Standard',
        complexity: roofData.pitchComplexity || 'moderate'
      }
      setShowLeadCapture(false)
      onComplete(answers, leadData, fallbackPricing)
    } finally {
      setIsSubmittingLead(false)
      console.log('Popup submission process COMPLETED')
    }
  }

  const isFormValid = () => {
    return (
      answers.roofAge &&
      answers.roofMaterial &&
      answers.propertyAccess &&
      answers.serviceType.length > 0 &&
      answers.timeline &&
      answers.contactTime
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Progress */}
        <div className="text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Step 2 of 3 - Almost Done!
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tell Us About Your Project</h1>
          <p className="text-xl text-gray-600 mb-6">
            Help us provide the most accurate pricing for your specific needs
          </p>

          {/* Enhanced Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Analysis</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Questions</span>
              </span>
              <span className="text-gray-400">Quotes</span>
            </div>
            <Progress value={getProgress()} className="h-3 bg-gray-200" />
            <p className="text-sm text-gray-500 mt-2">{Math.round(getProgress())}% Complete</p>
          </div>
        </div>

        {/* Step 1: Roof Conditions */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <CardTitle className="text-xl">Roof Conditions</CardTitle>
                  <CardDescription>Select all that apply</CardDescription>
                </div>
              </div>
              {answers.roofConditions.length > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "treesShading", text: "Trees shading the roof" },
                { key: "multipleLevels", text: "Multiple roof levels" },
                { key: "skylightsObstacles", text: "Skylights or obstacles" },
                { key: "steepPitch", text: "Steep roof pitch" },
                { key: "easyAccess", text: "Easy street access" },
              ].map((condition) => (
                <div
                  key={condition.key}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    answers.roofConditions.includes(condition.text)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleConditionChange(condition.text, !answers.roofConditions.includes(condition.text))
                  }}
                >
                  <Checkbox
                    id={condition.key}
                    checked={answers.roofConditions.includes(condition.text)}
                    onCheckedChange={(checked) => handleConditionChange(condition.text, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={condition.key} className="text-sm font-medium cursor-pointer flex-1 pointer-events-none">
                    {condition.text}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Property Details */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <CardTitle className="text-xl">Property Details</CardTitle>
                  <CardDescription>Tell us about your roof</CardDescription>
                </div>
              </div>
              {answers.roofAge && answers.roofMaterial && answers.propertyAccess && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Roof Age
                </Label>
                <Select
                  value={answers.roofAge}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, roofAge: value }))}
                >
                  <SelectTrigger className="border-2 focus:border-green-500">
                    <SelectValue placeholder="Select roof age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<5">Less than 5 years</SelectItem>
                    <SelectItem value="5-15">5-15 years</SelectItem>
                    <SelectItem value="15-25">15-25 years</SelectItem>
                    <SelectItem value=">25">More than 25 years</SelectItem>
                    <SelectItem value="unknown">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Roof Material
                </Label>
                <Select
                  value={answers.roofMaterial}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, roofMaterial: value }))}
                >
                  <SelectTrigger className="border-2 focus:border-green-500">
                    <SelectValue placeholder="Select roof material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asphalt">Asphalt shingles</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="tile">Tile</SelectItem>
                    <SelectItem value="cedar">Cedar shakes</SelectItem>
                    <SelectItem value="slate">Slate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Property Access
                </Label>
                <RadioGroup
                  value={answers.propertyAccess}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, propertyAccess: value }))}
                  className="space-y-2"
                >
                  <div 
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                      answers.propertyAccess === "easy" 
                        ? "bg-green-50 border-green-500" 
                        : "border-transparent hover:bg-green-50 hover:border-green-200"
                    }`}
                    onClick={() => setAnswers((prev) => ({ ...prev, propertyAccess: "easy" }))}
                  >
                    <RadioGroupItem value="easy" id="easy" onClick={(e) => e.stopPropagation()} />
                    <Label htmlFor="easy" className="text-sm cursor-pointer flex-1 pointer-events-none">
                      Easy street access
                    </Label>
                  </div>
                  <div 
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                      answers.propertyAccess === "narrow" 
                        ? "bg-green-50 border-green-500" 
                        : "border-transparent hover:bg-green-50 hover:border-green-200"
                    }`}
                    onClick={() => setAnswers((prev) => ({ ...prev, propertyAccess: "narrow" }))}
                  >
                    <RadioGroupItem value="narrow" id="narrow" onClick={(e) => e.stopPropagation()} />
                    <Label htmlFor="narrow" className="text-sm cursor-pointer flex-1 pointer-events-none">
                      Narrow driveway
                    </Label>
                  </div>
                  <div 
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                      answers.propertyAccess === "difficult" 
                        ? "bg-green-50 border-green-500" 
                        : "border-transparent hover:bg-green-50 hover:border-green-200"
                    }`}
                    onClick={() => setAnswers((prev) => ({ ...prev, propertyAccess: "difficult" }))}
                  >
                    <RadioGroupItem value="difficult" id="difficult" onClick={(e) => e.stopPropagation()} />
                    <Label htmlFor="difficult" className="text-sm cursor-pointer flex-1 pointer-events-none">
                      Difficult access
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Service Type */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <CardTitle className="text-xl">Service Type</CardTitle>
                  <CardDescription>What services are you interested in?</CardDescription>
                </div>
              </div>
              {answers.serviceType.length > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "completeReplacement", text: "Complete roof replacement", popular: true },
                { key: "roofRepair", text: "Roof repair" },
                { key: "roofInspection", text: "Roof inspection" },
                { key: "gutterWork", text: "Gutter work" },
                { key: "justEstimates", text: "Just estimates" },
              ].map((service) => (
                <div
                  key={service.key}
                  className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    answers.serviceType.includes(service.text)
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleServiceChange(service.text, !answers.serviceType.includes(service.text))
                  }}
                >
                  {service.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs pointer-events-none">Most Popular</Badge>
                  )}
                  <Checkbox
                    id={service.key}
                    checked={answers.serviceType.includes(service.text)}
                    onCheckedChange={(checked) => handleServiceChange(service.text, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={service.key} className="text-sm font-medium cursor-pointer flex-1 pointer-events-none">
                    {service.text}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Timeline & Contact */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <CardTitle className="text-xl">Timeline & Contact</CardTitle>
                  <CardDescription>When should contractors contact you?</CardDescription>
                </div>
              </div>
              {answers.timeline && answers.contactTime && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Timeline
                </Label>
                <RadioGroup
                  value={answers.timeline}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, timeline: value }))}
                  className="space-y-2"
                >
                  {[
                    { value: "urgent", text: "Urgent (ASAP)" },
                    { value: "soon", text: "Within 1-2 months" },
                    { value: "planning", text: "Planning ahead (3-6 months)" },
                    { value: "exploring", text: "Just exploring options" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        answers.timeline === option.value
                          ? "bg-orange-50 border-orange-500"
                          : "border-transparent hover:bg-orange-50 hover:border-orange-200"
                      }`}
                      onClick={() => setAnswers((prev) => ({ ...prev, timeline: option.value }))}
                    >
                      <RadioGroupItem value={option.value} id={option.value} onClick={(e) => e.stopPropagation()} />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer flex-1 pointer-events-none">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Best Time to Contact
                </Label>
                <RadioGroup
                  value={answers.contactTime}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, contactTime: value }))}
                  className="space-y-2"
                >
                  {[
                    { value: "morning", text: "Morning (8AM-12PM)" },
                    { value: "afternoon", text: "Afternoon (12PM-5PM)" },
                    { value: "evening", text: "Evening (5PM-8PM)" },
                    { value: "anytime", text: "Anytime" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        answers.contactTime === option.value
                          ? "bg-orange-50 border-orange-500"
                          : "border-transparent hover:bg-orange-50 hover:border-orange-200"
                      }`}
                      onClick={() => setAnswers((prev) => ({ ...prev, contactTime: option.value }))}
                    >
                      <RadioGroupItem value={option.value} id={`time-${option.value}`} onClick={(e) => e.stopPropagation()} />
                      <Label htmlFor={`time-${option.value}`} className="text-sm cursor-pointer flex-1 pointer-events-none">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced CTA */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">You're Almost Done!</h2>
              <p className="text-xl text-blue-100 mb-4">
                Get your personalized quote and connect with top-rated contractors
              </p>
              {!isFormValid() && (
                <div className="flex items-center justify-center space-x-2 text-yellow-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Please complete all required fields above</span>
                </div>
              )}
            </div>

            <Button
              size="lg"
              onClick={handleGetPricing}
              disabled={!isFormValid()}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Zap className="w-6 h-6 mr-3" />
              {isFormValid() ? "Get My Personalized Quote" : "Complete Form to Continue"}
            </Button>
            <p className="text-sm text-blue-100 mt-4">
              Instant results • 100% secure • No spam calls
            </p>
          </CardContent>
        </Card>
      </div>

      <LeadCapturePopup
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSubmit={handleLeadSubmit}
        isSubmitting={isSubmittingLead}
      />
    </>
  )
}
