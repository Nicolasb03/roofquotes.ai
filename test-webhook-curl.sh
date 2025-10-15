#!/bin/bash

# Test Webhook - POST Request
# Envoie un lead de test à l'API

echo "🚀 Envoi d'un lead de test au webhook..."
echo ""

curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "roofData": {
      "address": "44932 Bellflower Ln, Temecula, CA 92592",
      "city": "Temecula",
      "state": "California",
      "postalCode": "92592",
      "roofArea": 2000,
      "buildingHeight": 25,
      "roofShape": "complex",
      "segments": 4,
      "pitchComplexity": "moderate"
    },
    "userAnswers": {
      "roofAge": "10-15 years",
      "roofMaterial": "asphalt",
      "roofConditions": ["Missing shingles", "Visible damage"],
      "roofIssues": [],
      "propertyAccess": "easy",
      "serviceType": ["Complete roof replacement", "Roof repair"],
      "timeline": "1-3 months",
      "contactTime": "morning",
      "contactPreference": "phone"
    },
    "pricingData": {
      "lowEstimate": 10626,
      "highEstimate": 21252,
      "averageEstimate": 15939,
      "pricePerSqFt": 7.97,
      "materialType": "Asphalt",
      "region": "US",
      "state": "California",
      "stateCode": "CA",
      "complexityScore": 1.16,
      "factors": {
        "roofComplexity": "moderate",
        "accessDifficulty": "easy",
        "roofAge": "10-15 years",
        "specialConditions": 2,
        "materialType": "asphalt"
      }
    }
  }' | jq '.'

echo ""
echo "✅ Requête envoyée!"
