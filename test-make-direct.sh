#!/bin/bash

# Test Direct vers Make.com
# Envoie directement le payload au format attendu

echo "🚀 Test direct vers Make.com..."
echo ""

# Remplacez cette URL par votre URL Make.com
MAKE_URL="https://hook.us2.make.com/hkh6cvtrgbswwecam6gmul9plxtgk98m"

echo "📤 Envoi vers: $MAKE_URL"
echo ""

curl -X POST "$MAKE_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "User-Agent: MyRoofer.ai/1.0" \
  -v \
  -d '{
    "Prénom (A)": "John",
    "Nom (B)": "Doe",
    "Adresse courriel (C)": "john.doe@example.com",
    "Téléphone (D)": "(555) 123-4567",
    "Adresse (E)": "44932 Bellflower Ln, Temecula, CA 92592",
    "Zip code (F)": "92592",
    "Ville (G)": "Temecula",
    "Superficie du toit (H)": 2000,
    "Hauteur du bâtiment (I)": 25,
    "Condition particulières (J)": "Missing shingles, Visible damage",
    "Âge du toit (K)": "10-15 years",
    "Matériau du toit (L)": "asphalt",
    "Accès (M)": "easy",
    "Type de service (N)": "Complete roof replacement, Roof repair",
    "Date du projet (O)": "1-3 months",
    "Méthode de contact (P)": "phone",
    "Meilleur moment (Q)": "morning",
    "Valeur estimée (R)": 15939,
    "Souhaitez recevoir une estimation pa... (S)": "true",
    "UTM Source (T)": "fb",
    "UTM Campaign (U)": "Lead campaign - Par région - Copy",
    "UTM Content (V)": "Ad 1",
    "UTM Medium (W)": "paid",
    "UTM Term (X)": "TEST-123",
    "Lead ID (Y)": "LEAD-TEST-123",
    "Webhook Type (Z)": "initial_contact"
  }'

echo ""
echo ""
echo "✅ Requête envoyée!"
echo ""
echo "Vérifiez dans Make.com si le webhook a été reçu."
