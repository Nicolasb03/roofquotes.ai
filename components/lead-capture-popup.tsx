"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Loader2, Shield, Clock, Star, Gift } from 'lucide-react'

interface LeadCapturePopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (leadData: LeadData) => void
  isSubmitting?: boolean
}

export interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  agreeToTerms: boolean
  agreeToContact: boolean
}

export function LeadCapturePopup({ isOpen, onClose, onSubmit, isSubmitting = false }: LeadCapturePopupProps) {
  const [formData, setFormData] = useState<LeadData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agreeToTerms: false,
    agreeToContact: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      onSubmit(formData)
    }
  }

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.agreeToTerms &&
      formData.agreeToContact
    )
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden border-0 shadow-2xl p-6">
        {/* Header with value proposition */}
        <DialogHeader className="text-center pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Gift className="w-3 h-3 mr-1" />
              Limited Time Offer
            </Badge>
            {!isSubmitting && (
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Unlock Your Instant Roof Quote</DialogTitle>
          <DialogDescription className="text-gray-600">
            Get priority access to certified contractors + exclusive pricing insights
          </DialogDescription>
        </DialogHeader>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 py-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Shield className="w-4 h-4" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <Clock className="w-4 h-4" />
            <span>60 sec setup</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-purple-700">
            <Star className="w-4 h-4" />
            <span>Premium Access</span>
          </div>
        </div>

        {/* Form container with max width to keep content contained */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                disabled={isSubmitting}
                className="mt-1 border-2 focus:border-blue-500 rounded-lg"
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                disabled={isSubmitting}
                className="mt-1 border-2 focus:border-blue-500 rounded-lg"
                placeholder="Smith"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              disabled={isSubmitting}
              className="mt-1 border-2 focus:border-blue-500 rounded-lg"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              disabled={isSubmitting}
              className="mt-1 border-2 focus:border-blue-500 rounded-lg"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          {/* Benefits reminder */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2">What you'll get instantly:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Detailed roof analysis report</li>
              <li>Accurate price estimates</li>
              <li>3-5 certified contractors matched</li>
              <li>Priority customer support</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                disabled={isSubmitting}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                *
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="contact"
                checked={formData.agreeToContact}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToContact: checked as boolean }))}
                disabled={isSubmitting}
                className="mt-1"
              />
              <Label htmlFor="contact" className="text-sm leading-relaxed text-gray-600">
                I consent to be contacted by qualified roofing contractors regarding my project *
              </Label>
            </div>
          </div>

          {/* Action buttons: stack on small screens, side-by-side on md+ and allow text to wrap without overflow */}
          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full md:flex-1 border-2 bg-transparent min-w-0"
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="w-full md:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-w-0 whitespace-normal text-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>Get My Free Quote Now</>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center space-x-4">
          <span>SSL Secured</span>
          <span>No Spam</span>
          <span>Instant Results</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
