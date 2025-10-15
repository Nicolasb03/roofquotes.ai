#!/bin/bash

# Test the /api/webhook endpoint directly
# Replace YOUR_DOMAIN with your actual Vercel domain

DOMAIN="www.myroofer.ai"

echo "🧪 Testing /api/webhook endpoint..."
echo "🌐 Domain: $DOMAIN"
echo ""

# Create test payload matching the expected structure
curl -X POST "https://$DOMAIN/api/webhook" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "timestamp": "2025-10-14T20:20:00.000Z",
    "leadId": "TEST-CURL-123",
    "contact": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "test@example.com",
      "phone": "555-1234"
    },
    "property": {
      "address": "123 Test St, Test City, CA 12345",
      "postalCode": "12345",
      "city": "Test City",
      "roofArea": 2000,
      "buildingHeight": 20
    },
    "projectDetails": {
      "roofConditions": ["Good condition"],
      "roofAge": "5-10 years",
      "roofMaterial": "Asphalt",
      "propertyAccess": "Easy",
      "serviceType": ["Replacement"],
      "timeline": "Within 3 months",
      "contactPreference": "Email",
      "contactTime": "Morning"
    },
    "pricingData": {
      "lowEstimate": 12000,
      "highEstimate": 18000,
      "averageEstimate": 15000,
      "materialType": "Asphalt"
    },
    "metadata": {
      "leadId": "TEST-CURL-123",
      "userAgent": "curl-test",
      "ipAddress": "127.0.0.1"
    },
    "source": "curl-test"
  }' \
  -w "\n\n📊 Response Status: %{http_code}\n" \
  -v

echo ""
echo "✅ Test complete!"
