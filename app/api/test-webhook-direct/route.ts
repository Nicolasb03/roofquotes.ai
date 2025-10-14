import { NextResponse } from "next/server"

export async function GET() {
  console.log('🧪 DIRECT WEBHOOK TEST STARTED')
  console.log('🕐 Timestamp:', new Date().toISOString())
  
  // Check environment variable
  const webhookUrl = process.env.WEBHOOK_URLS
  console.log('🔍 WEBHOOK_URLS env var:', webhookUrl ? 'CONFIGURED' : 'NOT CONFIGURED')
  console.log('🔗 Webhook URL value:', webhookUrl)
  
  if (!webhookUrl) {
    return NextResponse.json({
      success: false,
      error: 'WEBHOOK_URLS environment variable is NOT configured in Vercel',
      message: 'Please add WEBHOOK_URLS to your Vercel environment variables'
    }, { status: 500 })
  }
  
  const firstWebhookUrl = webhookUrl.split(',')[0].trim()
  
  // Create a minimal test payload matching Make.com format
  const testPayload = {
    "Prénom (A)": "Test",
    "Nom (B)": "User",
    "Adresse courriel (C)": "test@example.com",
    "Téléphone (D)": "555-1234",
    "Adresse (E)": "123 Test St",
    "Zip code (F)": "12345",
    "Ville (G)": "Test City",
    "Superficie du toit (H)": 2000,
    "Hauteur du bâtiment (I)": 20,
    "Condition particulières (J)": "Test condition",
    "Âge du toit (K)": "5-10 years",
    "Matériau du toit (L)": "Asphalt",
    "Accès (M)": "Easy",
    "Type de service (N)": "Replacement",
    "Date du projet (O)": "Within 3 months",
    "Méthode de contact (P)": "Email",
    "Meilleur moment (Q)": "Morning",
    "Valeur estimée (R)": 15000,
    "Souhaitez recevoir une estimation pa... (S)": "true",
    "UTM Source (T)": "test",
    "UTM Campaign (U)": "test-campaign",
    "UTM Content (V)": "test-content",
    "UTM Medium (W)": "test",
    "UTM Term (X)": "TEST-" + Date.now(),
    "Lead ID (Y)": "TEST-" + Date.now(),
    "Webhook Type (Z)": "test"
  }
  
  try {
    console.log('📤 Sending test webhook to:', firstWebhookUrl)
    console.log('📦 Payload:', JSON.stringify(testPayload, null, 2))
    
    const startTime = Date.now()
    
    const response = await fetch(firstWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Roofquotes-Test/1.0',
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(30000)
    })
    
    const duration = Date.now() - startTime
    const responseText = await response.text().catch(() => 'Could not read response')
    
    console.log('📥 Response received in', duration, 'ms')
    console.log('📥 Status:', response.status)
    console.log('📥 Status Text:', response.statusText)
    console.log('📥 Response Body:', responseText)
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ WEBHOOK TEST SUCCESSFUL!')
      return NextResponse.json({
        success: true,
        message: '✅ Webhook is working! Make.com received the data.',
        details: {
          webhookUrl: firstWebhookUrl,
          status: response.status,
          duration: `${duration}ms`,
          responseBody: responseText,
          testPayload: testPayload
        }
      })
    } else {
      console.error('❌ WEBHOOK TEST FAILED')
      return NextResponse.json({
        success: false,
        message: '❌ Webhook call failed',
        error: {
          webhookUrl: firstWebhookUrl,
          status: response.status,
          statusText: response.statusText,
          responseBody: responseText,
          duration: `${duration}ms`
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('💥 WEBHOOK TEST ERROR:', error)
    return NextResponse.json({
      success: false,
      message: '💥 Webhook test threw an error',
      error: error instanceof Error ? error.message : 'Unknown error',
      webhookUrl: firstWebhookUrl
    }, { status: 500 })
  }
}
