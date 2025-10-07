/**
 * US State-Based Roofing Price Ranges ($/sq ft)
 * Data source: Industry pricing data 2024
 * Prices include materials and labor
 * Multiplier column represents regional cost adjustment factor
 */

export interface StatePricingData {
  state: string
  stateCode: string
  asphaltShingles: { min: number; max: number }
  metal: { min: number; max: number }
  membraneFlatRoof: { min: number; max: number }
  cedarWood: { min: number; max: number }
  tile: { min: number; max: number }
  regionalMultiplier: number
}

export const usStatePricing: StatePricingData[] = [
  {
    state: "Alabama",
    stateCode: "AL",
    asphaltShingles: { min: 3.52, max: 7.04 },
    metal: { min: 7.04, max: 17.60 },
    membraneFlatRoof: { min: 4.40, max: 12.32 },
    cedarWood: { min: 5.28, max: 8.80 },
    tile: { min: 7.04, max: 13.20 },
    regionalMultiplier: 0.88
  },
  {
    state: "Alaska",
    stateCode: "AK",
    asphaltShingles: { min: 5.00, max: 10.00 },
    metal: { min: 10.00, max: 25.00 },
    membraneFlatRoof: { min: 6.25, max: 17.50 },
    cedarWood: { min: 7.50, max: 12.50 },
    tile: { min: 10.00, max: 18.75 },
    regionalMultiplier: 1.25
  },
  {
    state: "Arizona",
    stateCode: "AZ",
    asphaltShingles: { min: 3.44, max: 6.88 },
    metal: { min: 6.88, max: 17.20 },
    membraneFlatRoof: { min: 4.30, max: 12.04 },
    cedarWood: { min: 5.16, max: 8.60 },
    tile: { min: 6.88, max: 12.90 },
    regionalMultiplier: 0.86
  },
  {
    state: "Arkansas",
    stateCode: "AR",
    asphaltShingles: { min: 3.20, max: 6.40 },
    metal: { min: 6.40, max: 16.00 },
    membraneFlatRoof: { min: 4.00, max: 11.20 },
    cedarWood: { min: 4.80, max: 8.00 },
    tile: { min: 6.40, max: 12.00 },
    regionalMultiplier: 0.8
  },
  {
    state: "California",
    stateCode: "CA",
    asphaltShingles: { min: 4.60, max: 9.20 },
    metal: { min: 9.20, max: 23.00 },
    membraneFlatRoof: { min: 5.75, max: 16.10 },
    cedarWood: { min: 6.90, max: 11.50 },
    tile: { min: 9.20, max: 17.25 },
    regionalMultiplier: 1.15
  },
  {
    state: "Colorado",
    stateCode: "CO",
    asphaltShingles: { min: 3.64, max: 7.28 },
    metal: { min: 7.28, max: 18.20 },
    membraneFlatRoof: { min: 4.55, max: 12.74 },
    cedarWood: { min: 5.46, max: 9.10 },
    tile: { min: 7.28, max: 13.65 },
    regionalMultiplier: 0.91
  },
  {
    state: "Connecticut",
    stateCode: "CT",
    asphaltShingles: { min: 4.72, max: 9.44 },
    metal: { min: 9.44, max: 23.60 },
    membraneFlatRoof: { min: 5.90, max: 16.52 },
    cedarWood: { min: 7.08, max: 11.80 },
    tile: { min: 9.44, max: 17.70 },
    regionalMultiplier: 1.18
  },
  {
    state: "Delaware",
    stateCode: "DE",
    asphaltShingles: { min: 4.24, max: 8.48 },
    metal: { min: 8.40, max: 21.00 },
    membraneFlatRoof: { min: 5.25, max: 14.70 },
    cedarWood: { min: 6.30, max: 10.50 },
    tile: { min: 8.40, max: 15.75 },
    regionalMultiplier: 1.05
  },
  {
    state: "District of Columbia",
    stateCode: "DC",
    asphaltShingles: { min: 4.08, max: 8.16 },
    metal: { min: 8.16, max: 20.40 },
    membraneFlatRoof: { min: 5.10, max: 14.28 },
    cedarWood: { min: 6.12, max: 10.20 },
    tile: { min: 8.16, max: 15.30 },
    regionalMultiplier: 1.02
  },
  {
    state: "Florida",
    stateCode: "FL",
    asphaltShingles: { min: 3.40, max: 6.80 },
    metal: { min: 6.80, max: 17.00 },
    membraneFlatRoof: { min: 4.25, max: 11.90 },
    cedarWood: { min: 5.10, max: 8.50 },
    tile: { min: 6.80, max: 12.75 },
    regionalMultiplier: 0.85
  },
  {
    state: "Georgia",
    stateCode: "GA",
    asphaltShingles: { min: 3.52, max: 7.04 },
    metal: { min: 7.04, max: 17.60 },
    membraneFlatRoof: { min: 4.40, max: 12.32 },
    cedarWood: { min: 5.28, max: 8.80 },
    tile: { min: 7.04, max: 13.20 },
    regionalMultiplier: 0.88
  },
  {
    state: "Hawaii",
    stateCode: "HI",
    asphaltShingles: { min: 4.80, max: 9.60 },
    metal: { min: 9.60, max: 24.00 },
    membraneFlatRoof: { min: 6.00, max: 16.80 },
    cedarWood: { min: 7.20, max: 12.00 },
    tile: { min: 9.60, max: 18.00 },
    regionalMultiplier: 1.2
  },
  {
    state: "Idaho",
    stateCode: "ID",
    asphaltShingles: { min: 3.52, max: 7.04 },
    metal: { min: 7.04, max: 17.60 },
    membraneFlatRoof: { min: 4.40, max: 12.32 },
    cedarWood: { min: 5.28, max: 8.80 },
    tile: { min: 7.04, max: 13.20 },
    regionalMultiplier: 0.88
  },
  {
    state: "Illinois",
    stateCode: "IL",
    asphaltShingles: { min: 4.40, max: 8.80 },
    metal: { min: 8.80, max: 22.00 },
    membraneFlatRoof: { min: 5.50, max: 15.40 },
    cedarWood: { min: 6.60, max: 11.00 },
    tile: { min: 8.80, max: 16.50 },
    regionalMultiplier: 1.1
  },
  {
    state: "Indiana",
    stateCode: "IN",
    asphaltShingles: { min: 3.60, max: 7.20 },
    metal: { min: 7.20, max: 18.00 },
    membraneFlatRoof: { min: 4.50, max: 12.60 },
    cedarWood: { min: 5.40, max: 9.00 },
    tile: { min: 7.20, max: 13.50 },
    regionalMultiplier: 0.9
  },
  {
    state: "Iowa",
    stateCode: "IA",
    asphaltShingles: { min: 3.88, max: 7.76 },
    metal: { min: 7.76, max: 19.40 },
    membraneFlatRoof: { min: 4.85, max: 13.58 },
    cedarWood: { min: 5.82, max: 9.70 },
    tile: { min: 7.76, max: 14.55 },
    regionalMultiplier: 0.97
  },
  {
    state: "Kansas",
    stateCode: "KS",
    asphaltShingles: { min: 3.60, max: 7.20 },
    metal: { min: 7.20, max: 18.00 },
    membraneFlatRoof: { min: 4.50, max: 12.60 },
    cedarWood: { min: 5.40, max: 9.00 },
    tile: { min: 7.20, max: 13.50 },
    regionalMultiplier: 0.9
  },
  {
    state: "Kentucky",
    stateCode: "KY",
    asphaltShingles: { min: 3.48, max: 6.96 },
    metal: { min: 6.96, max: 17.40 },
    membraneFlatRoof: { min: 4.35, max: 12.18 },
    cedarWood: { min: 5.22, max: 8.70 },
    tile: { min: 6.96, max: 13.05 },
    regionalMultiplier: 0.87
  },
  {
    state: "Louisiana",
    stateCode: "LA",
    asphaltShingles: { min: 3.28, max: 6.56 },
    metal: { min: 6.56, max: 16.40 },
    membraneFlatRoof: { min: 4.10, max: 11.48 },
    cedarWood: { min: 4.92, max: 8.20 },
    tile: { min: 6.56, max: 12.30 },
    regionalMultiplier: 0.82
  },
  {
    state: "Maine",
    stateCode: "ME",
    asphaltShingles: { min: 3.44, max: 6.88 },
    metal: { min: 6.88, max: 17.20 },
    membraneFlatRoof: { min: 4.30, max: 12.04 },
    cedarWood: { min: 5.16, max: 8.60 },
    tile: { min: 6.88, max: 12.90 },
    regionalMultiplier: 0.86
  },
  {
    state: "Maryland",
    stateCode: "MD",
    asphaltShingles: { min: 3.72, max: 7.44 },
    metal: { min: 7.44, max: 18.60 },
    membraneFlatRoof: { min: 4.65, max: 13.02 },
    cedarWood: { min: 5.58, max: 9.30 },
    tile: { min: 7.44, max: 13.95 },
    regionalMultiplier: 0.93
  },
  {
    state: "Massachusetts",
    stateCode: "MA",
    asphaltShingles: { min: 4.72, max: 9.44 },
    metal: { min: 9.44, max: 23.60 },
    membraneFlatRoof: { min: 5.90, max: 16.52 },
    cedarWood: { min: 7.08, max: 11.80 },
    tile: { min: 9.44, max: 17.70 },
    regionalMultiplier: 1.18
  },
  {
    state: "Michigan",
    stateCode: "MI",
    asphaltShingles: { min: 4.12, max: 8.24 },
    metal: { min: 8.24, max: 20.60 },
    membraneFlatRoof: { min: 5.15, max: 14.42 },
    cedarWood: { min: 6.18, max: 10.30 },
    tile: { min: 8.24, max: 15.45 },
    regionalMultiplier: 1.03
  },
  {
    state: "Minnesota",
    stateCode: "MN",
    asphaltShingles: { min: 4.24, max: 8.48 },
    metal: { min: 8.48, max: 21.20 },
    membraneFlatRoof: { min: 5.30, max: 14.84 },
    cedarWood: { min: 6.36, max: 10.60 },
    tile: { min: 8.48, max: 15.90 },
    regionalMultiplier: 1.06
  },
  {
    state: "Mississippi",
    stateCode: "MS",
    asphaltShingles: { min: 3.20, max: 6.40 },
    metal: { min: 6.40, max: 16.00 },
    membraneFlatRoof: { min: 4.00, max: 11.20 },
    cedarWood: { min: 4.80, max: 8.00 },
    tile: { min: 6.40, max: 12.00 },
    regionalMultiplier: 0.8
  },
  {
    state: "Missouri",
    stateCode: "MO",
    asphaltShingles: { min: 3.80, max: 7.60 },
    metal: { min: 7.60, max: 19.00 },
    membraneFlatRoof: { min: 4.75, max: 13.30 },
    cedarWood: { min: 5.70, max: 9.50 },
    tile: { min: 7.60, max: 14.25 },
    regionalMultiplier: 0.95
  },
  {
    state: "Montana",
    stateCode: "MT",
    asphaltShingles: { min: 3.64, max: 7.28 },
    metal: { min: 7.28, max: 18.20 },
    membraneFlatRoof: { min: 4.55, max: 12.74 },
    cedarWood: { min: 5.46, max: 9.10 },
    tile: { min: 7.28, max: 13.65 },
    regionalMultiplier: 0.91
  },
  {
    state: "Nebraska",
    stateCode: "NE",
    asphaltShingles: { min: 3.52, max: 7.04 },
    metal: { min: 7.04, max: 17.60 },
    membraneFlatRoof: { min: 4.40, max: 12.32 },
    cedarWood: { min: 5.28, max: 8.80 },
    tile: { min: 7.04, max: 13.20 },
    regionalMultiplier: 0.88
  },
  {
    state: "Nevada",
    stateCode: "NV",
    asphaltShingles: { min: 3.80, max: 7.60 },
    metal: { min: 7.60, max: 19.00 },
    membraneFlatRoof: { min: 4.75, max: 13.30 },
    cedarWood: { min: 5.70, max: 9.50 },
    tile: { min: 7.60, max: 14.25 },
    regionalMultiplier: 0.95
  },
  {
    state: "New Hampshire",
    stateCode: "NH",
    asphaltShingles: { min: 3.72, max: 7.44 },
    metal: { min: 7.44, max: 18.60 },
    membraneFlatRoof: { min: 4.65, max: 13.02 },
    cedarWood: { min: 5.58, max: 9.30 },
    tile: { min: 7.44, max: 13.95 },
    regionalMultiplier: 0.93
  },
  {
    state: "New Jersey",
    stateCode: "NJ",
    asphaltShingles: { min: 4.44, max: 8.88 },
    metal: { min: 8.88, max: 22.20 },
    membraneFlatRoof: { min: 5.55, max: 15.54 },
    cedarWood: { min: 6.66, max: 11.10 },
    tile: { min: 8.88, max: 16.65 },
    regionalMultiplier: 1.11
  },
  {
    state: "New Mexico",
    stateCode: "NM",
    asphaltShingles: { min: 3.52, max: 7.04 },
    metal: { min: 7.04, max: 17.60 },
    membraneFlatRoof: { min: 4.40, max: 12.32 },
    cedarWood: { min: 5.28, max: 8.80 },
    tile: { min: 7.04, max: 13.20 },
    regionalMultiplier: 0.88
  },
  {
    state: "New York",
    stateCode: "NY",
    asphaltShingles: { min: 4.72, max: 9.44 },
    metal: { min: 9.44, max: 23.60 },
    membraneFlatRoof: { min: 5.90, max: 16.52 },
    cedarWood: { min: 7.08, max: 11.80 },
    tile: { min: 9.44, max: 17.70 },
    regionalMultiplier: 1.18
  },
  {
    state: "North Carolina",
    stateCode: "NC",
    asphaltShingles: { min: 3.20, max: 6.40 },
    metal: { min: 6.40, max: 16.00 },
    membraneFlatRoof: { min: 4.00, max: 11.20 },
    cedarWood: { min: 4.80, max: 8.00 },
    tile: { min: 6.40, max: 12.00 },
    regionalMultiplier: 0.8
  },
  {
    state: "North Dakota",
    stateCode: "ND",
    asphaltShingles: { min: 3.68, max: 7.36 },
    metal: { min: 7.36, max: 18.40 },
    membraneFlatRoof: { min: 4.60, max: 12.88 },
    cedarWood: { min: 5.52, max: 9.20 },
    tile: { min: 7.36, max: 13.80 },
    regionalMultiplier: 0.92
  },
  {
    state: "Ohio",
    stateCode: "OH",
    asphaltShingles: { min: 3.68, max: 7.36 },
    metal: { min: 7.36, max: 18.40 },
    membraneFlatRoof: { min: 4.60, max: 12.88 },
    cedarWood: { min: 5.52, max: 9.20 },
    tile: { min: 7.36, max: 13.80 },
    regionalMultiplier: 0.92
  },
  {
    state: "Oklahoma",
    stateCode: "OK",
    asphaltShingles: { min: 3.32, max: 6.64 },
    metal: { min: 6.64, max: 16.60 },
    membraneFlatRoof: { min: 4.15, max: 11.62 },
    cedarWood: { min: 4.98, max: 8.30 },
    tile: { min: 6.64, max: 12.45 },
    regionalMultiplier: 0.83
  },
  {
    state: "Oregon",
    stateCode: "OR",
    asphaltShingles: { min: 4.32, max: 8.64 },
    metal: { min: 8.64, max: 21.60 },
    membraneFlatRoof: { min: 5.40, max: 15.12 },
    cedarWood: { min: 6.48, max: 10.80 },
    tile: { min: 8.64, max: 16.20 },
    regionalMultiplier: 1.08
  },
  {
    state: "Pennsylvania",
    stateCode: "PA",
    asphaltShingles: { min: 3.84, max: 7.68 },
    metal: { min: 7.68, max: 19.20 },
    membraneFlatRoof: { min: 4.80, max: 13.44 },
    cedarWood: { min: 5.76, max: 9.60 },
    tile: { min: 7.68, max: 14.40 },
    regionalMultiplier: 0.96
  },
  {
    state: "Rhode Island",
    stateCode: "RI",
    asphaltShingles: { min: 4.28, max: 8.56 },
    metal: { min: 8.56, max: 21.40 },
    membraneFlatRoof: { min: 5.35, max: 14.98 },
    cedarWood: { min: 6.42, max: 10.70 },
    tile: { min: 8.56, max: 16.05 },
    regionalMultiplier: 1.07
  },
  {
    state: "South Carolina",
    stateCode: "SC",
    asphaltShingles: { min: 3.44, max: 6.88 },
    metal: { min: 6.88, max: 17.20 },
    membraneFlatRoof: { min: 4.30, max: 12.04 },
    cedarWood: { min: 5.16, max: 8.60 },
    tile: { min: 6.88, max: 12.90 },
    regionalMultiplier: 0.86
  },
  {
    state: "South Dakota",
    stateCode: "SD",
    asphaltShingles: { min: 3.56, max: 7.12 },
    metal: { min: 7.12, max: 17.80 },
    membraneFlatRoof: { min: 4.45, max: 12.46 },
    cedarWood: { min: 5.34, max: 8.90 },
    tile: { min: 7.12, max: 13.35 },
    regionalMultiplier: 0.89
  },
  {
    state: "Tennessee",
    stateCode: "TN",
    asphaltShingles: { min: 3.40, max: 6.80 },
    metal: { min: 6.80, max: 17.00 },
    membraneFlatRoof: { min: 4.25, max: 11.90 },
    cedarWood: { min: 5.10, max: 8.50 },
    tile: { min: 6.80, max: 12.75 },
    regionalMultiplier: 0.85
  },
  {
    state: "Texas",
    stateCode: "TX",
    asphaltShingles: { min: 3.28, max: 6.56 },
    metal: { min: 6.56, max: 16.40 },
    membraneFlatRoof: { min: 4.10, max: 11.48 },
    cedarWood: { min: 4.92, max: 8.20 },
    tile: { min: 6.56, max: 12.30 },
    regionalMultiplier: 0.82
  },
  {
    state: "Utah",
    stateCode: "UT",
    asphaltShingles: { min: 3.56, max: 7.12 },
    metal: { min: 7.12, max: 17.80 },
    membraneFlatRoof: { min: 4.45, max: 12.46 },
    cedarWood: { min: 5.34, max: 8.90 },
    tile: { min: 7.12, max: 13.35 },
    regionalMultiplier: 0.89
  },
  {
    state: "Vermont",
    stateCode: "VT",
    asphaltShingles: { min: 3.40, max: 6.80 },
    metal: { min: 6.80, max: 17.00 },
    membraneFlatRoof: { min: 4.25, max: 11.90 },
    cedarWood: { min: 5.10, max: 8.50 },
    tile: { min: 6.80, max: 12.75 },
    regionalMultiplier: 0.85
  },
  {
    state: "Virginia",
    stateCode: "VA",
    asphaltShingles: { min: 3.40, max: 6.80 },
    metal: { min: 6.80, max: 17.00 },
    membraneFlatRoof: { min: 4.25, max: 11.90 },
    cedarWood: { min: 5.10, max: 8.50 },
    tile: { min: 6.80, max: 12.75 },
    regionalMultiplier: 0.85
  },
  {
    state: "Washington",
    stateCode: "WA",
    asphaltShingles: { min: 4.20, max: 8.40 },
    metal: { min: 8.40, max: 21.00 },
    membraneFlatRoof: { min: 5.25, max: 14.70 },
    cedarWood: { min: 6.30, max: 10.50 },
    tile: { min: 8.40, max: 15.75 },
    regionalMultiplier: 1.05
  },
  {
    state: "West Virginia",
    stateCode: "WV",
    asphaltShingles: { min: 3.72, max: 7.44 },
    metal: { min: 7.44, max: 18.60 },
    membraneFlatRoof: { min: 4.65, max: 13.02 },
    cedarWood: { min: 5.58, max: 9.30 },
    tile: { min: 7.44, max: 13.95 },
    regionalMultiplier: 0.93
  },
  {
    state: "Wisconsin",
    stateCode: "WI",
    asphaltShingles: { min: 3.96, max: 7.92 },
    metal: { min: 7.92, max: 19.80 },
    membraneFlatRoof: { min: 4.95, max: 13.86 },
    cedarWood: { min: 5.94, max: 9.90 },
    tile: { min: 7.92, max: 14.85 },
    regionalMultiplier: 0.99
  },
  {
    state: "Wyoming",
    stateCode: "WY",
    asphaltShingles: { min: 3.60, max: 7.20 },
    metal: { min: 7.20, max: 18.00 },
    membraneFlatRoof: { min: 4.50, max: 12.60 },
    cedarWood: { min: 5.40, max: 9.00 },
    tile: { min: 7.20, max: 13.50 },
    regionalMultiplier: 0.9
  }
]

/**
 * Get pricing data for a specific state
 */
export function getStatePricing(stateCode: string): StatePricingData | null {
  return usStatePricing.find(s => s.stateCode.toUpperCase() === stateCode.toUpperCase()) || null
}

/**
 * Calculate roofing cost based on US state pricing
 */
export function calculateUSStatePricing(
  roofArea: number,
  materialType: 'asphalt' | 'metal' | 'membrane' | 'cedar' | 'tile',
  stateCode: string,
  complexityFactor = 1.0,
  accessFactor = 1.0,
  conditionFactor = 1.0
): {
  lowEstimate: number
  highEstimate: number
  pricePerSqFt: number
  state: string
  materialType: string
} {
  const statePricing = getStatePricing(stateCode)
  
  if (!statePricing) {
    // Fallback to national average if state not found
    const nationalAverage = {
      asphalt: { min: 3.75, max: 7.50 },
      metal: { min: 7.50, max: 18.75 },
      membrane: { min: 4.70, max: 13.15 },
      cedar: { min: 5.65, max: 9.40 },
      tile: { min: 7.50, max: 14.05 }
    }
    
    const range = nationalAverage[materialType]
    const avgPrice = (range.min + range.max) / 2
    const adjustedPrice = avgPrice * complexityFactor * accessFactor * conditionFactor
    
    return {
      lowEstimate: Math.round(range.min * roofArea * complexityFactor * accessFactor * conditionFactor),
      highEstimate: Math.round(range.max * roofArea * complexityFactor * accessFactor * conditionFactor),
      pricePerSqFt: adjustedPrice,
      state: 'National Average',
      materialType
    }
  }
  
  // Get material-specific pricing
  let priceRange: { min: number; max: number }
  switch (materialType) {
    case 'asphalt':
      priceRange = statePricing.asphaltShingles
      break
    case 'metal':
      priceRange = statePricing.metal
      break
    case 'membrane':
      priceRange = statePricing.membraneFlatRoof
      break
    case 'cedar':
      priceRange = statePricing.cedarWood
      break
    case 'tile':
      priceRange = statePricing.tile
      break
    default:
      priceRange = statePricing.asphaltShingles
  }
  
  // Apply all factors
  const totalMultiplier = complexityFactor * accessFactor * conditionFactor
  const adjustedMin = priceRange.min * totalMultiplier
  const adjustedMax = priceRange.max * totalMultiplier
  const avgPrice = (adjustedMin + adjustedMax) / 2
  
  return {
    lowEstimate: Math.round(adjustedMin * roofArea),
    highEstimate: Math.round(adjustedMax * roofArea),
    pricePerSqFt: avgPrice,
    state: statePricing.state,
    materialType
  }
}

/**
 * Extract state code from address string
 */
export function extractStateFromAddress(address: string): string | null {
  const statePattern = /\b([A-Z]{2})\b/g
  const matches = address.match(statePattern)
  
  if (!matches) return null
  
  // Return the last 2-letter code (most likely the state)
  const lastMatch = matches[matches.length - 1]
  const stateCodes = usStatePricing.map(s => s.stateCode)
  
  return stateCodes.includes(lastMatch) ? lastMatch : null
}
