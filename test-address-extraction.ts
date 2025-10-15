/**
 * Test Address Extraction
 * Vérifie que le code postal est bien extrait de l'adresse
 */

// Simulate the extraction function
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
  
  // Extract state code
  const stateMatch = address.match(/,\s*([A-Z]{2})(?:\s+\d{5}|\s*,|\s*$)/)
  if (stateMatch) {
    result.stateCode = stateMatch[1]
  }
  
  // Extract city
  const cityMatch = address.match(/,\s*([^,]+?),\s*[A-Z]{2}/)
  if (cityMatch) {
    result.city = cityMatch[1].trim()
  }
  
  return result
}

// Test addresses
const testAddresses = [
  "44932 Bellflower Ln, Temecula, CA 92592",
  "123 Main St, Los Angeles, CA 90001",
  "456 Oak Ave, New York, NY 10001",
  "789 Pine Rd, Houston, TX 77001",
  "321 Elm St, Chicago, IL 60601-1234", // With ZIP+4
]

console.log('🧪 TEST D\'EXTRACTION D\'ADRESSE\n')
console.log('='.repeat(80))

testAddresses.forEach((address, index) => {
  console.log(`\n${index + 1}. Adresse: ${address}`)
  const components = extractAddressComponents(address)
  console.log(`   ✅ Ville: ${components.city || 'NON TROUVÉ'}`)
  console.log(`   ✅ État: ${components.stateCode || 'NON TROUVÉ'}`)
  console.log(`   ✅ Code postal: ${components.postalCode || '❌ NON TROUVÉ'}`)
})

console.log('\n' + '='.repeat(80))
console.log('\n✅ Test terminé!\n')
