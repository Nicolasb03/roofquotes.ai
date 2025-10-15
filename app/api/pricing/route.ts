import { NextResponse } from "next/server"
import { calculateQuebecPricing, quebecRoofingMaterials } from "@/lib/quebec-pricing-data"
import { calculateUSStatePricing, extractStateFromAddress, extractZipCodeFromAddress, usStatePricing } from "@/lib/us-state-pricing-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { roofData, userAnswers } = body

    if (!roofData || !userAnswers) {
      return new NextResponse("Missing roof data or user answers", { status: 400 })
    }

    // Validate roofArea to prevent NaN errors
    const roofArea = roofData.roofArea
    if (!roofArea || isNaN(roofArea) || roofArea <= 0) {
      console.error('[PRICING_POST] Invalid roof area:', roofArea)
      return new NextResponse("Invalid roof area data", { status: 400 })
    }

    // Extract state and ZIP from address
    const address = roofData.address || userAnswers.address || ""
    const stateCode = extractStateFromAddress(address)
    const zipCode = extractZipCodeFromAddress(address)
    
    console.log('[PRICING_POST] Detected state:', stateCode, 'ZIP:', zipCode, 'from address:', address)

    // Map front-end material choices to internal IDs
    const MATERIAL_MAP: Record<string, string> = {
      asphalt: "asphalt-shingles",
      metal: "metal-steel-aluminum",
      tile: "clay-concrete-tiles",
      cedar: "cedar-shingles",
      slate: "slate",
      other: "asphalt-shingles", // fallback
      elastomeric: "elastomeric-membrane",
    }
    
    // US material type mapping
    const US_MATERIAL_MAP: Record<string, 'asphalt' | 'metal' | 'membrane' | 'cedar' | 'tile'> = {
      asphalt: "asphalt",
      metal: "metal",
      tile: "tile",
      cedar: "cedar",
      slate: "tile",
      other: "asphalt",
      elastomeric: "membrane",
    }

    const rawMaterialPref = userAnswers.materialPreference || userAnswers.roofMaterial || ""

    // Determine material id; fall back to roof type default if none
    const materialType =
      MATERIAL_MAP[rawMaterialPref] ||
      (roofData.roofType === "flat" ? "elastomeric-membrane" : "asphalt-shingles")
    
    const usMaterialType = US_MATERIAL_MAP[rawMaterialPref] || 
      (roofData.roofType === "flat" ? "membrane" : "asphalt")

    // Calculate complexity factor
    let complexityFactor = 1.0
    if (roofData.pitchComplexity === "simple") complexityFactor = 0.9
    else if (roofData.pitchComplexity === "complex") complexityFactor = 1.3
    else complexityFactor = 1.1 // moderate

    // Calculate access factor
    let accessFactor = 1.0
    if (userAnswers.propertyAccess === "easy") accessFactor = 1.0
    else if (userAnswers.propertyAccess === "difficult") accessFactor = 1.2
    else accessFactor = 1.1 // moderate

    // Calculate condition factor
    let conditionFactor = 1.0
    const specialConditions = userAnswers.roofConditions?.length || 0
    if (specialConditions > 2) conditionFactor = 1.15
    else if (specialConditions > 0) conditionFactor = 1.05

    console.log('[PRICING_POST] Calculation inputs:', {
      roofArea,
      materialType,
      usMaterialType,
      stateCode,
      complexityFactor,
      accessFactor,
      conditionFactor
    })

    // Use US state-based pricing if state detected, otherwise fall back to Quebec pricing
    let pricing
    
    if (stateCode) {
      // Calculate US state-specific pricing
      const usPricing = calculateUSStatePricing(
        roofArea,
        usMaterialType,
        stateCode,
        complexityFactor,
        accessFactor,
        conditionFactor
      )
      
      pricing = {
        lowEstimate: usPricing.lowEstimate,
        highEstimate: usPricing.highEstimate,
        pricePerSqFt: usPricing.pricePerSqFt,
        material: {
          name: usMaterialType.charAt(0).toUpperCase() + usMaterialType.slice(1),
          nameFr: usMaterialType.charAt(0).toUpperCase() + usMaterialType.slice(1)
        },
        state: usPricing.state,
        stateCode: stateCode,
        zipCode: zipCode,
        region: "US",
        complexityScore: complexityFactor * accessFactor * conditionFactor,
        factors: {
          roofComplexity: roofData.pitchComplexity || "moderate",
          accessDifficulty: userAnswers.propertyAccess || "easy",
          roofAge: userAnswers.roofAge || "unknown",
          specialConditions: specialConditions,
          materialType: usMaterialType,
        },
        availableMaterials: [
          { name: "Asphalt Shingles", type: "asphalt", description: "Most economical, 15-25 years" },
          { name: "Metal Roofing", type: "metal", description: "Very durable, 40-70 years" },
          { name: "Flat Roof Membrane", type: "membrane", description: "For flat roofs, 20-30 years" },
          { name: "Cedar/Wood", type: "cedar", description: "Natural look, 25-30 years" },
          { name: "Tile", type: "tile", description: "Premium durability, 50+ years" }
        ]
      }
    } else {
      // Fall back to Quebec pricing
      const quebecPricing = calculateQuebecPricing(
        roofArea,
        materialType,
        complexityFactor,
        accessFactor,
        conditionFactor,
      )

      pricing = {
        lowEstimate: quebecPricing.lowEstimate,
        highEstimate: quebecPricing.highEstimate,
        pricePerSqFt: quebecPricing.pricePerSqFt,
        material: quebecPricing.material,
        province: "QC",
        region: "CA",
        complexityScore: complexityFactor * accessFactor * conditionFactor,
        factors: {
          roofComplexity: roofData.pitchComplexity || "moderate",
          accessDifficulty: userAnswers.propertyAccess || "easy",
          roofAge: userAnswers.roofAge || "unknown",
          specialConditions: specialConditions,
          materialType: quebecPricing.material.nameFr,
        },
        availableMaterials: quebecRoofingMaterials.map((m) => ({
          name: m.nameFr,
          nameEn: m.name,
          priceRange: m.priceRange,
          durability: m.durability,
        })),
      }
    }

    return NextResponse.json(pricing)
  } catch (error: any) {
    console.error("[PRICING_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
