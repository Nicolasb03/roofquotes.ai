import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get("place_id")

    if (!placeId) {
      return NextResponse.json({ error: "Missing place_id" }, { status: 400 })
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_SOLAR_API_KEY

    if (!GOOGLE_API_KEY) {
      console.error("Google API key not configured")
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_API_KEY,
      fields: "address_components,formatted_address",
    })

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    console.log("Making request to Place Details API for place_id:", placeId)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Place Details API HTTP error: ${response.status}`)
      return NextResponse.json(
        { error: `HTTP error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Place Details API response status:", data.status)

    if (data.status !== "OK") {
      console.error("Place Details API error:", data.status, data.error_message)
      return NextResponse.json(
        { error: data.error_message || "Place Details API error" },
        { status: 400 }
      )
    }

    // Extract address components
    const addressComponents = data.result?.address_components || []
    const formattedAddress = data.result?.formatted_address || ""

    // Parse address components into structured data
    const addressData: {
      formattedAddress: string
      streetNumber?: string
      route?: string
      city?: string
      state?: string
      stateCode?: string
      postalCode?: string
      country?: string
      countryCode?: string
    } = {
      formattedAddress,
    }

    addressComponents.forEach((component: any) => {
      const types = component.types || []
      
      if (types.includes("street_number")) {
        addressData.streetNumber = component.long_name
      }
      if (types.includes("route")) {
        addressData.route = component.long_name
      }
      if (types.includes("locality")) {
        addressData.city = component.long_name
      }
      if (types.includes("administrative_area_level_1")) {
        addressData.state = component.long_name
        addressData.stateCode = component.short_name
      }
      if (types.includes("postal_code")) {
        addressData.postalCode = component.long_name
      }
      if (types.includes("country")) {
        addressData.country = component.long_name
        addressData.countryCode = component.short_name
      }
    })

    console.log("Extracted address data:", addressData)

    return NextResponse.json({ addressData })
  } catch (error) {
    console.error("Place Details error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
