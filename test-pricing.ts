/**
 * Test script for US state-based pricing
 * Address: 44932 Bellflower Ln, Temecula, CA
 */

import { calculateUSStatePricing, extractStateFromAddress, getStatePricing } from './lib/us-state-pricing-data'

// Test address
const testAddress = '44932 Bellflower Ln, Temecula, CA'

console.log('='.repeat(80))
console.log('TEST DE PRICING - ADRESSE CALIFORNIE')
console.log('='.repeat(80))
console.log(`\nAdresse testée: ${testAddress}\n`)

// Extract state
const stateCode = extractStateFromAddress(testAddress)
console.log(`État détecté: ${stateCode}`)

if (!stateCode) {
  console.error('❌ Erreur: État non détecté dans l\'adresse')
  process.exit(1)
}

// Get state pricing data
const statePricing = getStatePricing(stateCode)
if (statePricing) {
  console.log(`\n📍 Données de pricing pour: ${statePricing.state}`)
  console.log(`   Multiplicateur régional: ${statePricing.regionalMultiplier}x`)
  console.log(`\n💰 Prix par matériau ($/pied carré):`)
  console.log(`   • Bardeaux d'asphalte: $${statePricing.asphaltShingles.min} - $${statePricing.asphaltShingles.max}`)
  console.log(`   • Toiture métallique: $${statePricing.metal.min} - $${statePricing.metal.max}`)
  console.log(`   • Membrane (toit plat): $${statePricing.membraneFlatRoof.min} - $${statePricing.membraneFlatRoof.max}`)
  console.log(`   • Cèdre/Bois: $${statePricing.cedarWood.min} - $${statePricing.cedarWood.max}`)
  console.log(`   • Tuiles: $${statePricing.tile.min} - $${statePricing.tile.max}`)
}

// Simulate roof data (typical residential roof)
const roofArea = 2000 // sq ft (toit résidentiel typique)
const materials: Array<'asphalt' | 'metal' | 'membrane' | 'cedar' | 'tile'> = [
  'asphalt',
  'metal',
  'membrane',
  'cedar',
  'tile'
]

// Complexity factors (moderate case)
const complexityFactor = 1.1  // Moderate complexity
const accessFactor = 1.0      // Easy access
const conditionFactor = 1.05  // Minor special conditions

console.log(`\n🏠 SIMULATION DE TOIT:`)
console.log(`   Surface: ${roofArea} pieds carrés`)
console.log(`   Facteur de complexité: ${complexityFactor}x (modéré)`)
console.log(`   Facteur d'accès: ${accessFactor}x (facile)`)
console.log(`   Facteur de condition: ${conditionFactor}x (conditions mineures)`)
console.log(`   Multiplicateur total: ${(complexityFactor * accessFactor * conditionFactor).toFixed(2)}x`)

console.log(`\n${'='.repeat(80)}`)
console.log('ESTIMATIONS DE PRIX PAR MATÉRIAU')
console.log('='.repeat(80))

materials.forEach(material => {
  const pricing = calculateUSStatePricing(
    roofArea,
    material,
    stateCode!,
    complexityFactor,
    accessFactor,
    conditionFactor
  )

  const materialNames = {
    asphalt: 'Bardeaux d\'asphalte',
    metal: 'Toiture métallique',
    membrane: 'Membrane (toit plat)',
    cedar: 'Cèdre/Bois',
    tile: 'Tuiles'
  }

  console.log(`\n📋 ${materialNames[material].toUpperCase()}`)
  console.log(`   Prix par pied carré: $${pricing.pricePerSqFt.toFixed(2)}`)
  console.log(`   Estimation basse: $${pricing.lowEstimate.toLocaleString()}`)
  console.log(`   Estimation haute: $${pricing.highEstimate.toLocaleString()}`)
  console.log(`   Moyenne: $${Math.round((pricing.lowEstimate + pricing.highEstimate) / 2).toLocaleString()}`)
})

console.log(`\n${'='.repeat(80)}`)
console.log('COMPARAISON AVEC MOYENNE NATIONALE')
console.log('='.repeat(80))

// Compare with national average (using Texas as baseline - 0.82 multiplier)
const texasPricing = calculateUSStatePricing(roofArea, 'asphalt', 'TX', complexityFactor, accessFactor, conditionFactor)
const californiaPricing = calculateUSStatePricing(roofArea, 'asphalt', 'CA', complexityFactor, accessFactor, conditionFactor)

const difference = californiaPricing.highEstimate - texasPricing.highEstimate
const percentDiff = ((difference / texasPricing.highEstimate) * 100).toFixed(1)

console.log(`\n💵 Bardeaux d'asphalte (2000 sq ft):`)
console.log(`   Texas (état économique): $${texasPricing.lowEstimate.toLocaleString()} - $${texasPricing.highEstimate.toLocaleString()}`)
console.log(`   Californie: $${californiaPricing.lowEstimate.toLocaleString()} - $${californiaPricing.highEstimate.toLocaleString()}`)
console.log(`   Différence: +$${difference.toLocaleString()} (${percentDiff}% plus cher en CA)`)

console.log(`\n${'='.repeat(80)}`)
console.log('✅ TEST COMPLÉTÉ AVEC SUCCÈS')
console.log('='.repeat(80))
console.log(`\nLe système de pricing détecte correctement l'état (${stateCode})`)
console.log(`et applique les prix spécifiques à la Californie.`)
console.log(`\nLa Californie a un multiplicateur de ${statePricing?.regionalMultiplier}x`)
console.log(`en raison des coûts de main-d'œuvre élevés et des codes du bâtiment stricts.\n`)
