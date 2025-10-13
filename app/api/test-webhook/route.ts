import { NextResponse } from "next/server"

export async function GET() {
  console.log('🧪 Testing Make.com webhook with minimal payload...')
  
  const webhookUrl = process.env.WEBHOOK_URLS
  
  if (!webhookUrl) {
    console.error('❌ WEBHOOK_URLS environment variable not configured')
    return NextResponse.json({
      success: false,
      error: 'WEBHOOK_URLS environment variable not configured'
    }, { status: 500 })
  }
  
  // Get first webhook URL if multiple are configured
  const firstWebhookUrl = webhookUrl.split(',')[0].trim()
  
  // Ultra simple test payload
  const testPayload = {
    message: "test from api",
    timestamp: new Date().toISOString()
  }
  
  try {
    console.log('📤 Sending test to:', firstWebhookUrl)
    console.log('📦 Payload:', JSON.stringify(testPayload))
    
    const response = await fetch(firstWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    })
    
    const responseText = await response.text()
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response body:', responseText)
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      responseBody: responseText,
      sentPayload: testPayload,
      message: response.ok ? 'Webhook test successful!' : 'Webhook test failed'
    })
    
  } catch (error) {
    console.error('❌ Test webhook error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
