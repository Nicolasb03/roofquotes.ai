import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const input = searchParams.get("input")

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

    // Configure for US addresses
    const params = new URLSearchParams({
      input: input,
      key: GOOGLE_API_KEY,
      types: "address",
      components: "country:us", // Restrict to United States
      language: "en", // English language for US
      region: "us", // US region
      // Bias towards US center coordinates
      location: "39.8283,-98.5795", // Geographic center of US
      radius: "2000000", // 2000km radius to cover entire US
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
      // Return fallback suggestions for common US cities
      const fallbackSuggestions = getFallbackSuggestions(input)
      return NextResponse.json({
        predictions: fallbackSuggestions,
        fallback: true,
        error: "API key issue - using fallback suggestions",
      })
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API error:", data.status, data.error_message)
      const fallbackSuggestions = getFallbackSuggestions(input)
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
    const fallbackSuggestions = getFallbackSuggestions(input)
    return NextResponse.json({
      predictions: fallbackSuggestions,
      fallback: true,
      error: "Network error - using fallback suggestions",
    })
  }
}

// Fallback suggestions for common US locations
function getFallbackSuggestions(input: string) {
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
    "El Paso, TX, USA",
    "Nashville, TN, USA",
    "Detroit, MI, USA",
    "Oklahoma City, OK, USA",
    "Portland, OR, USA",
    "Las Vegas, NV, USA",
    "Memphis, TN, USA",
    "Louisville, KY, USA",
    "Baltimore, MD, USA",
    "Milwaukee, WI, USA",
  ]

  const filtered = commonUSCities
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
