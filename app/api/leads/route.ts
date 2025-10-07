import { type NextRequest, NextResponse } from "next/server"
import { buildWebhookPayload, buildGoogleSheetsPayload, validateWebhookPayload } from "@/lib/webhook-payload"

console.log('🔥🔥🔥 LEADS API FILE LOADED - THIS SHOULD SHOW ON SERVER START 🔥🔥🔥')

export async function POST(request: NextRequest) {
  console.log('🚨🚨🚨 LEADS API ENDPOINT CALLED - START OF FUNCTION 🚨🚨🚨')
  console.log('🕐 TIMESTAMP:', new Date().toISOString())
  console.log('🌍 REQUEST URL:', request.url)
  console.log('📍 REQUEST METHOD:', request.method)
  
  try {
    const leadData = await request.json()
    console.log('🔥 LEADS API: Received lead data:', JSON.stringify(leadData, null, 2))

    // Check if this is a selling house update webhook
    const isSellingHouseUpdate = leadData.webhookType === "selling_house_update"
    
    if (isSellingHouseUpdate) {
      console.log('🏠 LEADS API: Processing selling house update webhook')
      
      // Generate leadId for selling house update
      const leadId = `SELLING-UPDATE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Send selling house update to webhook
      try {
        const baseUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        
        const webhookPayload = {
          timestamp: new Date().toISOString(),
          leadId: leadId,
          webhookType: "selling_house_update",
          contact: {
            firstName: leadData.firstName,
            lastName: leadData.lastName,
            email: leadData.email,
            phone: leadData.phone,
          },
          sellingHouseData: {
            response: leadData.pricingData?.sellingHouse,
            timestamp: new Date().toISOString()
          },
          source: "soumission-toiture-ai-selling-update",
        }
        
        console.log('🏠 LEADS API: Selling house webhook payload:', JSON.stringify(webhookPayload, null, 2))
        
        const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
        let webhookUrl = `${baseUrl}/api/webhook`
        
        if (bypassSecret) {
          const url = new URL('/api/webhook', baseUrl)
          url.searchParams.set('vercel-protection-bypass', bypassSecret)
          webhookUrl = url.toString()
        }
        
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })
        
        if (webhookResponse.ok) {
          const webhookResult = await webhookResponse.json()
          console.log('✅ LEADS API: Selling house webhook sent successfully:', webhookResult.summary)
          
          return NextResponse.json({
            success: true,
            leadId: leadId,
            message: "🏠 SELLING HOUSE UPDATE WEBHOOK SENT SUCCESSFULLY 🏠",
            webhookResponse: webhookResult,
            debugInfo: {
              timestamp: new Date().toISOString(),
              endpoint: "/api/leads/route.ts",
              version: "SELLING_HOUSE_UPDATE",
              webhookStatus: webhookResponse.status,
              webhookOk: webhookResponse.ok
            }
          })
        } else {
          console.error('❌ LEADS API: Selling house webhook failed:', await webhookResponse.text())
          return NextResponse.json({
            success: false,
            leadId: leadId,
            message: "❌ SELLING HOUSE WEBHOOK FAILED ❌",
            error: await webhookResponse.text()
          })
        }
      } catch (webhookError) {
        console.error('💥 LEADS API: Selling house webhook error:', webhookError)
        return NextResponse.json({
          success: false,
          message: "Selling house webhook error",
          error: webhookError.message
        })
      }
    }

    // Original webhook logic for regular lead submissions
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "roofData", "userAnswers", "pricingData"]
    for (const field of requiredFields) {
      if (!leadData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate leadId once for use throughout the function
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Send to webhook endpoints
    try {
      console.log('🚨 LEADS API: ENTERING WEBHOOK TRY BLOCK')
      
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      console.log('🌐 LEADS API: Base URL:', baseUrl)
      console.log('📞 LEADS API: Calling webhook at:', `${baseUrl}/api/webhook`)
      console.log('🚨🚨🚨 LEADS API: ABOUT TO CALL WEBHOOK - THIS SHOULD APPEAR 🚨🚨🚨')
      console.log('🔍 LEADS API: Environment check - VERCEL_URL:', process.env.VERCEL_URL)
      console.log('🔍 LEADS API: Environment check - NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
      
      // Get client metadata
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      '127.0.0.1'
      const userAgent = request.headers.get('user-agent') || ''
      
      // Build structured webhook payload using the new builder
      const structuredPayload = buildWebhookPayload({
        leadData: {
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone
        },
        roofData: leadData.roofData,
        userAnswers: leadData.userAnswers,
        pricingData: leadData.pricingData,
        metadata: {
          userAgent,
          ipAddress: clientIp
        }
      })
      
      // Add leadId and timestamp
      structuredPayload.metadata.leadId = leadId
      
      // Validate payload
      const validation = validateWebhookPayload(structuredPayload)
      if (!validation.valid) {
        console.error('❌ LEADS API: Invalid webhook payload:', validation.errors)
        return NextResponse.json({ 
          error: 'Invalid lead data', 
          details: validation.errors 
        }, { status: 400 })
      }
      
      // Prepare webhook payload in the format expected by /api/webhook
      const webhookPayload = {
        timestamp: new Date().toISOString(),
        leadId: leadId,
        contact: structuredPayload.contact,
        property: structuredPayload.property,
        projectDetails: structuredPayload.projectDetails,
        pricingData: structuredPayload.pricingData,
        metadata: structuredPayload.metadata,
        source: "myroofer.ai",
      }
      
      console.log('🔍 LEADS API: WEBHOOK PAYLOAD:')
      console.log('📦 LEADS API: Payload:', JSON.stringify(webhookPayload, null, 2))
      console.log('📏 LEADS API: Payload size:', JSON.stringify(webhookPayload).length, 'characters')
      console.log('✅ LEADS API: Contact fields present:', {
        firstName: !!webhookPayload.contact.firstName,
        lastName: !!webhookPayload.contact.lastName,
        email: !!webhookPayload.contact.email,
        phone: !!webhookPayload.contact.phone
      })
      
      // Add bypass parameter for internal webhook call
      const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      let webhookUrl = `${baseUrl}/api/webhook`
      
      if (bypassSecret) {
        // Construct URL with proper query parameter (avoid double encoding)
        const url = new URL('/api/webhook', baseUrl)
        url.searchParams.set('vercel-protection-bypass', bypassSecret)
        webhookUrl = url.toString()
      }
      
      console.log('🔗 LEADS API: Calling webhook at:', webhookUrl)
      console.log('🔍 LEADS API: Bypass secret configured:', bypassSecret ? 'YES' : 'NO')
      
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })
      
      console.log('📥 LEADS API: Webhook response status:', webhookResponse.status)
      console.log('📥 LEADS API: Webhook response ok:', webhookResponse.ok)
      
      if (webhookResponse.ok) {
        const webhookResult = await webhookResponse.json()
        console.log('✅ LEADS API: Webhook sent successfully:', webhookResult.summary)
        
        // Return the actual webhook response instead of mock response
        return NextResponse.json({
          success: true,
          leadId: leadId,
          message: "🔥 LEADS API: RETURNING ACTUAL WEBHOOK RESPONSE 🔥",
          webhookResponse: webhookResult,
          debugInfo: {
            timestamp: new Date().toISOString(),
            endpoint: "/api/leads/route.ts",
            version: "LEADS_RETURNING_WEBHOOK_RESPONSE",
            webhookStatus: webhookResponse.status,
            webhookOk: webhookResponse.ok
          }
        })
      } else {
        const errorText = await webhookResponse.text()
        console.error('❌ LEADS API: Webhook failed:', errorText)
        
        // Return webhook error details
        return NextResponse.json({
          success: false,
          leadId: leadId,
          message: "❌ LEADS API: WEBHOOK FAILED ❌",
          error: errorText,
          debugInfo: {
            timestamp: new Date().toISOString(),
            endpoint: "/api/leads/route.ts",
            version: "LEADS_WEBHOOK_ERROR",
            webhookStatus: webhookResponse.status,
            webhookOk: webhookResponse.ok
          }
        })
      }
    } catch (webhookError) {
      console.error('💥 LEADS API: Webhook error:', webhookError)
      // Don't fail the main request if webhook fails
    }

    // Mock lead processing
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock contractor matching based on location
    const mockContractors = [
      {
        id: "CONT-001",
        businessName: "Superior Roofing Solutions",
        rating: 4.8,
        reviewCount: 127,
        serviceAreas: ["Toronto", "Mississauga", "Brampton"],
        specialties: ["Residential", "Commercial", "Emergency Repairs"],
        verified: true,
      },
      // ... autres entrepreneurs
    ]

    // Return mock response with lead confirmation
    return NextResponse.json({
      success: true,
      leadId: leadId,
      message: "🚨 LEADS API ENDPOINT CONFIRMED - RESPONSE FROM /api/leads/route.ts 🚨",
      estimatedResponseTime: "24-48 hours",
      matchedContractors: mockContractors.length,
      usableArea: leadData.roofData.usableArea || 1347,
      segments: leadData.roofData.segments || 2,
      pitchComplexity: "complex",
      debugInfo: {
        timestamp: new Date().toISOString(),
        endpoint: "/api/leads/route.ts",
        version: "DEBUG_VERSION_2.0"
      }
    })
  } catch (error) {
    console.error("Lead submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}