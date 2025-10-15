import { type NextRequest, NextResponse } from "next/server"
import { initializeMeta, isMetaConfigured } from "@/lib/meta-config"
import { trackLead } from "@/lib/meta-conversion-api"

export async function POST(request: NextRequest) {
  console.log('🚨🚨🚨 WEBHOOK ENDPOINT CALLED - THIS SHOULD APPEAR IN LOGS 🚨🚨🚨')
  console.log('🕐 Timestamp:', new Date().toISOString())
  console.log('🌍 Request URL:', request.url)
  console.log('📍 Request method:', request.method)
  console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))
  
  // Check for Vercel automation bypass
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  if (bypassSecret) {
    console.log('🔓 Vercel bypass secret configured')
  }
  
  try {
    console.log('📖 About to parse request body...')
    const leadData = await request.json()
    console.log('📦 Raw request body received, size:', JSON.stringify(leadData).length, 'bytes')
    console.log('✅ Request body parsed successfully')
    
    console.log('🎯 WEBHOOK ENDPOINT: RECEIVED PAYLOAD FROM LEADS API:')
    console.log('📥 WEBHOOK: Full received payload:', JSON.stringify(leadData, null, 2))
    console.log('📏 WEBHOOK: Received payload size:', JSON.stringify(leadData).length, 'characters')

    // Validate required nested fields
    if (!leadData.contact || !leadData.contact.firstName || !leadData.contact.lastName || 
        !leadData.contact.email || !leadData.contact.phone) {
      return NextResponse.json({ 
        error: "Missing required contact fields: firstName, lastName, email, phone" 
      }, { status: 400 })
    }

    if (!leadData.property || !leadData.projectDetails) {
      return NextResponse.json({ 
        error: "Missing required fields: property, projectDetails" 
      }, { status: 400 })
    }

    // Initialize Meta Conversion API and track Lead event
    initializeMeta()
    if (isMetaConfigured()) {
      // Calculate estimated project value for Meta tracking
      const estimatedValue = leadData.pricingData?.totalCost || 
                           (leadData.property.roofArea ? leadData.property.roofArea * 10 : 5000) // Fallback estimation

      // Get client information from request headers
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      request.ip || 
                      '127.0.0.1'
      const userAgent = request.headers.get('user-agent') || ''
      const sourceUrl = request.headers.get('referer') || 'https://soumission-toiture.ai'

      console.log('📊 Meta Lead Tracking - Client Info:', {
        clientIp: clientIp,
        userAgent: userAgent,
        sourceUrl: sourceUrl,
        estimatedValue: estimatedValue
      })

      trackLead({
        email: leadData.contact.email,
        phone: leadData.contact.phone,
        firstName: leadData.contact.firstName,
        lastName: leadData.contact.lastName,
        value: estimatedValue,
        clientIp: clientIp,
        userAgent: userAgent,
        sourceUrl: sourceUrl
      })
        .then(result => {
          if (result.success) {
            console.log('✅ Meta Lead event tracked successfully for:', leadData.contact.email)
          } else {
            console.error('❌ Meta Lead tracking failed:', result.error)
          }
        })
        .catch(error => {
          console.error('❌ Meta Lead tracking error:', error)
        })
    } else {
      console.warn('⚠️ Meta Conversion API not configured - skipping lead tracking')
    }

    // Prepare webhook payload to match Google Sheets structure (exact format from Make.com)
    const roofConditions = leadData.projectDetails.roofConditions 
      ? (Array.isArray(leadData.projectDetails.roofConditions) 
          ? leadData.projectDetails.roofConditions.join(", ") 
          : leadData.projectDetails.roofConditions)
      : ""
    
    const webhookPayload = {
      "Prénom (A)": leadData.contact.firstName,
      "Nom (B)": leadData.contact.lastName,
      "Adresse courriel (C)": leadData.contact.email,
      "Téléphone (D)": leadData.contact.phone,
      "Adresse (E)": leadData.property.address || "",
      "Zip code (F)": leadData.property.postalCode || leadData.pricingData?.zipCode || "",
      "Ville (G)": leadData.property.city || "",
      "État (H)": leadData.property.state || leadData.property.stateCode || "",
      "Superficie du toit (I)": leadData.property.roofArea || 0,
      "Hauteur du bâtiment (J)": leadData.property.buildingHeight || 0,
      "Condition particulières (K)": roofConditions,
      "Âge du toit (L)": leadData.projectDetails.roofAge || "",
      "Matériau du toit (M)": leadData.projectDetails.roofMaterial || "",
      "Accès (N)": leadData.projectDetails.propertyAccess || "",
      "Type de service (O)": Array.isArray(leadData.projectDetails.serviceType) 
        ? leadData.projectDetails.serviceType.join(", ") 
        : leadData.projectDetails.serviceType || "",
      "Date du projet (P)": leadData.projectDetails.timeline || "",
      "Méthode de contact (Q)": leadData.projectDetails.contactPreference || "",
      "Meilleur moment (R)": leadData.projectDetails.contactTime || "",
      "Valeur estimée (S)": leadData.pricingData?.averageEstimate || leadData.pricingData?.highEstimate || 0,
      "Souhaitez recevoir une estimation pa... (T)": "true",
      "UTM Source (U)": "fb",
      "UTM Campaign (V)": "Lead campaign - Par région - Copy",
      "UTM Content (W)": "Ad 1",
      "UTM Medium (X)": "paid",
      "UTM Term (Y)": leadData.metadata?.leadId || "",
      "Lead ID (Z)": leadData.leadId || leadData.metadata?.leadId || "",
      "Webhook Type (AA)": "initial_contact"
    }

    // Get webhook URLs from environment
    const webhookUrlsEnv = process.env.WEBHOOK_URLS
    console.log('🔍 Environment check - WEBHOOK_URLS configured:', webhookUrlsEnv ? 'YES' : 'NO')
    console.log('🔗 Using webhook URL:', webhookUrlsEnv)
    
    if (!webhookUrlsEnv) {
      console.error('❌ WEBHOOK: No webhook URLs configured')
      return NextResponse.json({
        success: false,
        message: "❌ WEBHOOK ENDPOINT ERROR: WEBHOOK_URLS NOT CONFIGURED ❌",
        error: "No webhook URLs set",
        debugInfo: {
          timestamp: new Date().toISOString(),
          endpoint: "/api/webhook/route.ts",
          version: "WEBHOOK_ERROR"
        }
      })
    }

    const webhookUrls = webhookUrlsEnv.split(',').map(url => url.trim()).filter(url => url.length > 0)
    console.log('🌐 WEBHOOK: Webhook URLs configured:', webhookUrls.length)
    console.log('📋 WEBHOOK: Webhook URLs:', webhookUrls)

    // Send to external webhook URLs (configured in environment variables)
    const webhookPromises = webhookUrls.map(async (url, index) => {
      const trimmedUrl = url.trim()
      if (!trimmedUrl) return null
      
      try {
        const startTime = Date.now()
        
        // Log the exact payload being sent
        const payloadString = JSON.stringify(webhookPayload, null, 2)
        console.log(`📤 Sending webhook ${index + 1}/${webhookUrls.length} to:`, trimmedUrl)
        console.log(`📦 Full payload being sent:`, payloadString)
        
        const response = await fetch(trimmedUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Soumission-Toiture-AI/1.0',
          },
          body: payloadString,
          // Increase timeout to 30 seconds
          signal: AbortSignal.timeout(30000)
        })

        const duration = Date.now() - startTime
        
        // Always try to read response body for debugging
        const responseText = await response.text().catch(() => 'Could not read response body')
        
        // Enhanced debugging for Make.com
        if (trimmedUrl.includes('make.com')) {
          console.log('🔧 MAKE.COM DETAILED DEBUG:')
          console.log('📤 Request URL:', trimmedUrl)
          console.log('📤 Request Method: POST')
          console.log('📤 Request Headers:', {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Soumission-Toiture-AI/1.0'
          })
          console.log('📤 Payload sent to Make.com:', payloadString)
          console.log('📤 Payload length:', payloadString.length)
          console.log('📥 Make.com response status:', response.status)
          console.log('📥 Make.com response headers:', Object.fromEntries(response.headers.entries()))
          console.log('📥 Make.com response body:', responseText)
          console.log('📥 Response is HTML?', responseText.includes('<!doctype') || responseText.includes('<html'))
          
          if (responseText.includes('<!doctype') || responseText.includes('<html')) {
            console.log('⚠️  Make.com returned HTML instead of JSON - this usually means:')
            console.log('   1. The webhook URL is incorrect or expired')
            console.log('   2. The payload format is not accepted')
            console.log('   3. Make.com is redirecting the request')
            console.log('   4. There is an authentication issue')
          }
        }
        
        console.log(`✅ Webhook ${index + 1} response:`, {
          url: trimmedUrl,
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          headers: Object.fromEntries(response.headers.entries()),
          responseBody: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
        })

        if (!response.ok) {
          console.error(`❌ Webhook ${index + 1} failed:`, {
            status: response.status,
            statusText: response.statusText,
            body: responseText,
            url: trimmedUrl
          })
          
          // Don't throw error, just return error status
          return {
            url: trimmedUrl,
            status: 'error',
            statusCode: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`,
            responseBody: responseText,
            duration
          }
        }

        return {
          url: trimmedUrl,
          status: 'success',
          statusCode: response.status,
          duration,
          responseBody: responseText
        }
      } catch (error) {
        console.error(`Webhook error for ${trimmedUrl}:`, error)
        return {
          url: trimmedUrl,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    const results = await Promise.all(webhookPromises)
    const successfulWebhooks = results.filter(r => r?.status === 'success').length
    const failedWebhooks = results.filter(r => r?.status === 'error').length

    return NextResponse.json({
      success: true,
      message: "🚨 WEBHOOK ENDPOINT CONFIRMED - RESPONSE FROM /api/webhook/route.ts 🚨",
      webhookResults: results,
      debugInfo: {
        timestamp: new Date().toISOString(),
        endpoint: "/api/webhook/route.ts",
        version: "WEBHOOK_DEBUG_VERSION_2.0",
        webhookUrlsCount: webhookUrls.length,
        payloadSent: webhookPayload,
        makeComResponses: results.map(r => ({
          url: r.url,
          status: r.status,
          success: r.success,
          responseBody: r.responseBody
        }))
      }
    })

  } catch (error) {
    console.error("💥💥💥 WEBHOOK ENDPOINT ERROR:", error)
    console.error("Error type:", typeof error)
    console.error("Error name:", error instanceof Error ? error.name : 'Unknown')
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: "Internal server error in webhook endpoint",
      details: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.name : typeof error,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function TEST(request: NextRequest) {
  try {
    const webhookUrlsEnv = process.env.WEBHOOK_URLS
    console.log('🔍 Environment check - WEBHOOK_URLS configured:', webhookUrlsEnv ? 'YES' : 'NO')
    console.log('🔗 Using webhook URL:', webhookUrlsEnv)
    
    if (!webhookUrlsEnv) {
      console.error('❌ WEBHOOK: No webhook URLs configured')
      return NextResponse.json({
        success: false,
        message: "❌ WEBHOOK ENDPOINT ERROR: WEBHOOK_URLS NOT CONFIGURED ❌",
        error: "No webhook URLs set",
        debugInfo: {
          timestamp: new Date().toISOString(),
          endpoint: "/api/webhook/route.ts",
          version: "WEBHOOK_ERROR"
        }
      })
    }

    const webhookUrls = webhookUrlsEnv.split(',').map(url => url.trim()).filter(url => url.length > 0)
    console.log('🌐 WEBHOOK: Webhook URLs configured:', webhookUrls.length)
    console.log('📋 WEBHOOK: Webhook URLs:', webhookUrls)

    const testWebhookPayload = {
      "Prénom (A)": "John",
      "Nom (B)": "Doe",
      "Adresse courriel (C)": "john.doe@example.com",
      "Téléphone (D)": "123-456-7890",
      "Adresse (E)": "",
      "Code postal (F)": "",
      "Ville (G)": "",
      "Superficie du toit (H)": 0,
      "Hauteur du bâtiment (I)": 0,
      "Condition particulières (J)": "",
      "Âge du toit (K)": "",
      "Matériau du toit (L)": "",
      "Accès (M)": "",
      "Type de service (N)": "",
      "Date du projet (O)": "",
      "Méthode de contact (P)": "",
      "Meilleur moment (Q)": ""
    }

    const webhookPromises = webhookUrls.map(async (url, index) => {
      const trimmedUrl = url.trim()
      if (!trimmedUrl) return null
      
      try {
        const startTime = Date.now()
        
        // Log the exact payload being sent
        const payloadString = JSON.stringify(testWebhookPayload, null, 2)
        console.log(`📤 Sending test webhook ${index + 1}/${webhookUrls.length} to:`, trimmedUrl)
        console.log(`📦 Full payload being sent:`, payloadString)
        
        const response = await fetch(trimmedUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Soumission-Toiture-AI/1.0',
          },
          body: payloadString,
          // Increase timeout to 30 seconds
          signal: AbortSignal.timeout(30000)
        })

        const duration = Date.now() - startTime
        
        // Always try to read response body for debugging
        const responseText = await response.text().catch(() => 'Could not read response body')
        
        console.log(`✅ Test Webhook ${index + 1} response:`, {
          url: trimmedUrl,
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          headers: Object.fromEntries(response.headers.entries()),
          responseBody: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
        })

        if (!response.ok) {
          console.error(`❌ Test Webhook ${index + 1} failed:`, {
            status: response.status,
            statusText: response.statusText,
            body: responseText,
            url: trimmedUrl
          })
          
          // Don't throw error, just return error status
          return {
            url: trimmedUrl,
            status: 'error',
            statusCode: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`,
            responseBody: responseText,
            duration
          }
        }

        return {
          url: trimmedUrl,
          status: 'success',
          statusCode: response.status,
          duration,
          responseBody: responseText
        }
      } catch (error) {
        console.error(`Test Webhook error for ${trimmedUrl}:`, error)
        return {
          url: trimmedUrl,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    const results = await Promise.all(webhookPromises)
    const successfulWebhooks = results.filter(r => r?.status === 'success').length
    const failedWebhooks = results.filter(r => r?.status === 'error').length

    return NextResponse.json({
      success: true,
      message: "🚨 TEST WEBHOOK ENDPOINT CONFIRMED - RESPONSE FROM /api/webhook/route.ts 🚨",
      webhookResults: results,
      debugInfo: {
        timestamp: new Date().toISOString(),
        endpoint: "/api/webhook/route.ts",
        version: "WEBHOOK_DEBUG_VERSION_2.0",
        webhookUrlsCount: webhookUrls.length,
        payloadSent: testWebhookPayload,
        makeComResponses: results.map(r => ({
          url: r.url,
          status: r.status,
          success: r.success,
          responseBody: r.responseBody
        }))
      }
    })

  } catch (error) {
    console.error("Test Webhook endpoint error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
