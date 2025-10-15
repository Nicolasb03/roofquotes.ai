import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const input = searchParams.get("input")
    const region = searchParams.get("region") || "us" // Default to US

    if (!input || input.length < 3) {
      return NextResponse.json({ predictions: [] })
    }

    // Prefer a dedicated Places key but fall back to the Solar key if you are sharing one locally
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_SOLAR_API_KEY

    if (!GOOGLE_API_KEY) {
      console.error("Google API key not configured")
      return NextResponse.json(
        {
          error: "API key not configured",
          predictions: [],
        },
        { status: 200 },
      ) // Return 200 to avoid breaking the UI
    }

    // Configure based on region
    const isCanada = region === 'canada'
    const countryCode = isCanada ? 'ca' : 'us'
    const centerCoords = isCanada ? '56.1304,-106.3468' : '39.8283,-98.5795' // Canada center vs US center
    const radiusKm = isCanada ? '2500000' : '2000000' // Larger radius for Canada
    
    const params = new URLSearchParams({
      input: input,
      key: GOOGLE_API_KEY,
      types: "address",
      components: `country:${countryCode}`,
      language: "en",
      region: countryCode,
      location: centerCoords,
      radius: radiusKm,
    })

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
    console.log("Making request to Places API:", url.replace(GOOGLE_API_KEY, "***"))

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Places API HTTP error: ${response.status}`)
      return NextResponse.json(
        {
          error: `HTTP error: ${response.status}`,
          predictions: [],
        },
        { status: 200 },
      )
    }

    const data = await response.json()
    console.log("Places API response status:", data.status)

    if (data.status === "REQUEST_DENIED") {
      console.error("Places API REQUEST_DENIED:", data.error_message)
      // Return fallback suggestions based on region
      const fallbackSuggestions = getFallbackSuggestions(input, isCanada)
      return NextResponse.json({
        predictions: fallbackSuggestions,
        fallback: true,
        error: "API key issue - using fallback suggestions",
      })
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API error:", data.status, data.error_message)
      const fallbackSuggestions = getFallbackSuggestions(input, isCanada)
      return NextResponse.json({
        predictions: fallbackSuggestions,
        fallback: true,
        error: data.error_message || "Places API error",
      })
    }

    // Filter and format predictions for better US results
    const predictions = (data.predictions || []).map((prediction: any) => ({
      place_id: prediction.place_id,
      description: prediction.description,
      main_text: prediction.structured_formatting?.main_text || "",
      secondary_text: prediction.structured_formatting?.secondary_text || "",
      types: prediction.types || [],
    }))

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error("Autocomplete error:", error)
    const input = new URL(request.url).searchParams.get("input") || ""
    const region = new URL(request.url).searchParams.get("region") || "us"
    const isCanada = region === 'canada'
    const fallbackSuggestions = getFallbackSuggestions(input, isCanada)
    return NextResponse.json({
      predictions: fallbackSuggestions,
      fallback: true,
      error: "Network error - using fallback suggestions",
    })
  }
}

// Fallback suggestions for common locations
function getFallbackSuggestions(input: string, isCanada: boolean = false) {
  const commonUSCities = [
    "New York, NY, USA",
    "Los Angeles, CA, USA",
    "Chicago, IL, USA",
    "Houston, TX, USA",
    "Phoenix, AZ, USA",
    "Philadelphia, PA, USA",
    "San Antonio, TX, USA",
    "San Diego, CA, USA",
    "Dallas, TX, USA",
    "San Jose, CA, USA",
    "Austin, TX, USA",
    "Jacksonville, FL, USA",
    "Fort Worth, TX, USA",
    "Columbus, OH, USA",
    "Charlotte, NC, USA",
    "San Francisco, CA, USA",
    "Indianapolis, IN, USA",
    "Seattle, WA, USA",
    "Denver, CO, USA",
    "Boston, MA, USA",
  ]
  
  const commonCanadianCities = [
    "Toronto, ON, Canada",
    "Montreal, QC, Canada",
    "Vancouver, BC, Canada",
    "Calgary, AB, Canada",
    "Edmonton, AB, Canada",
    "Ottawa, ON, Canada",
    "Winnipeg, MB, Canada",
    "Quebec City, QC, Canada",
    "Hamilton, ON, Canada",
    "Kitchener, ON, Canada",
    "London, ON, Canada",
    "Victoria, BC, Canada",
    "Halifax, NS, Canada",
    "Oshawa, ON, Canada",
    "Windsor, ON, Canada",
    "Saskatoon, SK, Canada",
    "Regina, SK, Canada",
    "St. John's, NL, Canada",
    "Kelowna, BC, Canada",
    "Barrie, ON, Canada",
  ]

  const cities = isCanada ? commonCanadianCities : commonUSCities

  const filtered = cities
    .filter((city) => city.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5)
    .map((city, index) => ({
      place_id: `fallback_${index}`,
      description: city,
      main_text: city.split(",")[0],
      secondary_text: city.split(",").slice(1).join(",").trim(),
      types: ["locality", "political"],
      fallback: true,
    }))

  return filtered
}
