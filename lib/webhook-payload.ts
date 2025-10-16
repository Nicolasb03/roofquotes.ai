/**
 * Webhook Payload Builder
 * Creates structured payloads for external webhooks (Make.com, Zapier, etc.)
 */

export interface WebhookPayload {
  // Contact Information
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  
  // Property Information
  property: {
    address: string
    city?: string
    state?: string
    stateCode?: string
    postalCode?: string
    roofArea: number
    buildingHeight: number
    roofShape?: string
    segments?: number
    pitchComplexity?: string
  }
  
  // Project Details
  projectDetails: {
    roofAge: string
    roofMaterial: string
    roofConditions: string[]
    roofIssues: string[]
    propertyAccess: string
    serviceType: string[]
    timeline: string
    contactTime: string
    contactPreference?: string
  }
  
  // Pricing Information
  pricingData: {
    lowEstimate: number
    highEstimate: number
    averageEstimate: number
    pricePerSqFt: number
    materialType: string
    region: string
    state?: string
    stateCode?: string
    zipCode?: string
    complexityScore: number
    factors?: {
      roofComplexity: string
      accessDifficulty: string
      roofAge: string
      specialConditions: number
      materialType: string
    }
  }
  
  // Metadata
  metadata: {
    timestamp: string
    source: string
    leadId?: string
    userAgent?: string
    ipAddress?: string
  }
}

/**
 * Build a complete webhook payload from form data
 */
export function buildWebhookPayload(data: {
  leadData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  roofData: any
  userAnswers: any
  pricingData: any
  metadata?: {
    userAgent?: string
    ipAddress?: string
  }
}): WebhookPayload {
  const { leadData, roofData, userAnswers, pricingData, metadata } = data
  
  // Extract address components from the address string
  const addressParts = extractAddressComponents(roofData.address || '')
  
  // Debug logging
  console.log('🔍 Address parsing:', {
    originalAddress: roofData.address,
    extractedParts: addressParts,
    roofDataZip: roofData.zipCode,
    roofDataPostal: roofData.postalCode,
    pricingDataZip: pricingData.zipCode
  })
  
  // Try to get ZIP code from multiple sources (prioritize roofData.zipCode from Google Places)
  const zipCode = roofData.zipCode ||           // From Google Places API (highest priority)
                  roofData.postalCode ||
                  addressParts.postalCode ||     // From address parsing
                  pricingData.zipCode || 
                  ''
  
  console.log('✅ Final ZIP code selected:', zipCode, 'from sources:', {
    roofDataZip: roofData.zipCode,
    roofDataPostal: roofData.postalCode,
    extractedPostal: addressParts.postalCode,
    pricingZip: pricingData.zipCode
  })
  
  // Try to get state from multiple sources
  const stateCode = addressParts.stateCode || 
                    pricingData.stateCode || 
                    roofData.stateCode || 
                    ''
  
  const state = addressParts.state || 
                pricingData.state || 
                (stateCode ? getStateName(stateCode) : '')
  
  // Calculate average estimate
  const averageEstimate = Math.round(
    (pricingData.lowEstimate + pricingData.highEstimate) / 2
  )
  
  return {
    contact: {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone
    },
    
    property: {
      address: roofData.address || '',
      city: addressParts.city || roofData.city || '',
      state: state,
      stateCode: stateCode,
      postalCode: zipCode,
      roofArea: roofData.roofArea || 0,
      buildingHeight: roofData.buildingHeight || 0,
      roofShape: roofData.roofShape,
      segments: roofData.segments,
      pitchComplexity: roofData.pitchComplexity
    },
    
    projectDetails: {
      roofAge: userAnswers.roofAge || '',
      roofMaterial: userAnswers.roofMaterial || '',
      roofConditions: userAnswers.roofConditions || [],
      roofIssues: userAnswers.roofIssues || [],
      propertyAccess: userAnswers.propertyAccess || '',
      serviceType: userAnswers.serviceType || [],
      timeline: userAnswers.timeline || '',
      contactTime: userAnswers.contactTime || '',
      contactPreference: userAnswers.contactPreference
    },
    
    pricingData: {
      lowEstimate: pricingData.lowEstimate || 0,
      highEstimate: pricingData.highEstimate || 0,
      averageEstimate: averageEstimate,
      pricePerSqFt: pricingData.pricePerSqFt || 0,
      materialType: pricingData.material?.name || pricingData.materialType || 'Standard',
      region: pricingData.region || pricingData.province || 'US',
      state: pricingData.state,
      stateCode: pricingData.stateCode,
      zipCode: pricingData.zipCode || zipCode,
      complexityScore: pricingData.complexityScore || 1.0,
      factors: pricingData.factors
    },
    
    metadata: {
      timestamp: new Date().toISOString(),
      source: 'myroofer.ai',
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress
    }
  }
}

/**
 * Build payload for Google Sheets / Make.com format
 * Maintains backward compatibility with existing webhook structure
 */
export function buildGoogleSheetsPayload(webhookPayload: WebhookPayload) {
  return {
    // Column A-Q format for Google Sheets
    "Prénom (A)": webhookPayload.contact.firstName,
    "Nom (B)": webhookPayload.contact.lastName,
    "Adresse courriel (C)": webhookPayload.contact.email,
    "Téléphone (D)": webhookPayload.contact.phone,
    "Adresse (E)": webhookPayload.property.address,
    "Code postal (F)": webhookPayload.property.postalCode || '',
    "Ville (G)": webhookPayload.property.city || '',
    "État (H)": webhookPayload.property.state || '',
    "Superficie du toit (I)": webhookPayload.property.roofArea,
    "Hauteur du bâtiment (J)": webhookPayload.property.buildingHeight,
    "Conditions particulières (K)": webhookPayload.projectDetails.roofConditions.join(", "),
    "Âge du toit (L)": webhookPayload.projectDetails.roofAge,
    "Matériau du toit (M)": webhookPayload.projectDetails.roofMaterial,
    "Accès (N)": webhookPayload.projectDetails.propertyAccess,
    "Type de service (O)": webhookPayload.projectDetails.serviceType.join(", "),
    "Date du projet (P)": webhookPayload.projectDetails.timeline,
    "Meilleur moment (Q)": webhookPayload.projectDetails.contactTime,
    
    // Additional pricing fields
    "Estimation basse (R)": webhookPayload.pricingData.lowEstimate,
    "Estimation haute (S)": webhookPayload.pricingData.highEstimate,
    "Estimation moyenne (T)": webhookPayload.pricingData.averageEstimate,
    "Prix par pied carré (U)": webhookPayload.pricingData.pricePerSqFt,
    "Type de matériau (V)": webhookPayload.pricingData.materialType,
    "État/Province (W)": webhookPayload.pricingData.state || webhookPayload.property.state || '',
    "Score de complexité (X)": webhookPayload.pricingData.complexityScore,
    
    // Metadata
    "Timestamp (Y)": webhookPayload.metadata.timestamp,
    "Source (Z)": webhookPayload.metadata.source
  }
}

/**
 * Extract address components from full address string
 * Enhanced to better parse US addresses from Google Places format
 */
function extractAddressComponents(address: string): {
  city?: string
  state?: string
  stateCode?: string
  postalCode?: string
} {
  const result: {
    city?: string
    state?: string
    stateCode?: string
    postalCode?: string
  } = {}
  
  // Extract ZIP code (5 digits or ZIP+4 format)
  // Try multiple patterns to catch different formats
  // Priority: patterns that are more specific (after state code) first
  const zipPatterns = [
    /[A-Z]{2}\s+(\d{5}(?:-\d{4})?)\b/,  // After state: CA 92592 or CA 92592-1234
    /,\s*[A-Z]{2}\s+(\d{5}(?:-\d{4})?)\b/, // After comma and state: , CA 92592
    /\s(\d{5}(?:-\d{4})?)\s*$/,         // At end of string: 92592
    /,\s*(\d{5}(?:-\d{4})?)\s*$/,       // After comma at end: , 92592
  ]
  
  for (const pattern of zipPatterns) {
    const zipMatch = address.match(pattern)
    if (zipMatch && zipMatch[1]) {
      result.postalCode = zipMatch[1]
      break
    }
  }
  
  // Extract state code (2 uppercase letters, not at start of string)
  const stateMatch = address.match(/,\s*([A-Z]{2})(?:\s+\d{5}|\s*,|\s*$)/)
  if (stateMatch) {
    result.stateCode = stateMatch[1]
    result.state = getStateName(stateMatch[1])
  }
  
  // Extract city (text between commas before state code)
  // Pattern: "123 Street, City, ST 12345"
  const cityMatch = address.match(/,\s*([^,]+?),\s*[A-Z]{2}/)
  if (cityMatch) {
    result.city = cityMatch[1].trim()
  } else {
    // Alternative: try to get city from "City, ST" pattern
    const altCityMatch = address.match(/,\s*([^,]+?)\s+[A-Z]{2}\s/)
    if (altCityMatch) {
      result.city = altCityMatch[1].trim()
    }
  }
  
  return result
}

/**
 * Get full state name from state code
 */
function getStateName(stateCode: string): string {
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
  }
  
  return stateNames[stateCode.toUpperCase()] || stateCode
}

/**
 * Validate webhook payload before sending
 */
export function validateWebhookPayload(payload: WebhookPayload): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Validate contact info
  if (!payload.contact.firstName) errors.push('Missing first name')
  if (!payload.contact.lastName) errors.push('Missing last name')
  if (!payload.contact.email) errors.push('Missing email')
  if (!payload.contact.phone) errors.push('Missing phone')
  
  // Validate property info
  if (!payload.property.address) errors.push('Missing address')
  if (!payload.property.roofArea || payload.property.roofArea <= 0) {
    errors.push('Invalid roof area')
  }
  
  // Validate pricing
  if (!payload.pricingData.lowEstimate || !payload.pricingData.highEstimate) {
    errors.push('Missing pricing estimates')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
