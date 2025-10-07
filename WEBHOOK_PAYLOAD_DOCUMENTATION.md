# Webhook Payload Documentation

## Vue d'ensemble

Le système de webhook envoie maintenant un payload structuré et complet lorsque l'utilisateur soumet le formulaire de lead. Le payload est envoyé automatiquement au moment où l'utilisateur clique sur le bouton de confirmation dans le popup de capture de leads.

## Flux de Données

```
1. Utilisateur remplit le questionnaire
2. Utilisateur clique sur "Get Your Free Quotes" 
3. Popup de capture de leads s'affiche
4. Utilisateur entre ses coordonnées et clique sur "Confirm"
5. ✅ WEBHOOK ENVOYÉ AUTOMATIQUEMENT avec toutes les données
6. Pricing calculé et affiché à l'utilisateur
```

## Structure du Payload

Le webhook reçoit un payload avec **3 formats** pour maximum de compatibilité:

### 1. Format Google Sheets (Colonnes A-Z)

Compatible avec Make.com, Zapier, Google Sheets, etc.

```json
{
  "Prénom (A)": "John",
  "Nom (B)": "Doe",
  "Adresse courriel (C)": "john@example.com",
  "Téléphone (D)": "(555) 123-4567",
  "Adresse (E)": "44932 Bellflower Ln, Temecula, CA 92592",
  "Code postal (F)": "92592",
  "Ville (G)": "Temecula",
  "État (H)": "California",
  "Superficie du toit (I)": 2000,
  "Hauteur du bâtiment (J)": 25,
  "Conditions particulières (K)": "Missing shingles, Visible damage",
  "Âge du toit (L)": "10-15 years",
  "Matériau du toit (M)": "asphalt",
  "Accès (N)": "easy",
  "Type de service (O)": "Full replacement, Repair",
  "Date du projet (P)": "1-3 months",
  "Meilleur moment (Q)": "morning",
  "Estimation basse (R)": 10626,
  "Estimation haute (S)": 21252,
  "Estimation moyenne (T)": 15939,
  "Prix par pied carré (U)": 7.97,
  "Type de matériau (V)": "Asphalt",
  "État/Province (W)": "California",
  "Score de complexité (X)": 1.16,
  "Timestamp (Y)": "2025-10-06T20:30:00.000Z",
  "Source (Z)": "myroofer.ai"
}
```

### 2. Format Structuré (_structured)

Format moderne et structuré pour intégrations avancées:

```json
{
  "_structured": {
    "contact": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "(555) 123-4567"
    },
    "property": {
      "address": "44932 Bellflower Ln, Temecula, CA 92592",
      "city": "Temecula",
      "state": "California",
      "stateCode": "CA",
      "postalCode": "92592",
      "roofArea": 2000,
      "buildingHeight": 25,
      "roofShape": "complex",
      "segments": 4,
      "pitchComplexity": "moderate"
    },
    "projectDetails": {
      "roofAge": "10-15 years",
      "roofMaterial": "asphalt",
      "roofConditions": ["Missing shingles", "Visible damage"],
      "roofIssues": [],
      "propertyAccess": "easy",
      "serviceType": ["Full replacement", "Repair"],
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
    },
    "metadata": {
      "timestamp": "2025-10-06T20:30:00.000Z",
      "source": "myroofer.ai",
      "leadId": "LEAD-1728254400000-abc123",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "192.168.1.1"
    }
  }
}
```

### 3. Format Legacy (_legacy)

Format de compatibilité avec l'ancien système:

```json
{
  "_legacy": {
    "timestamp": "2025-10-06T20:30:00.000Z",
    "leadId": "LEAD-1728254400000-abc123",
    "contact": { ... },
    "property": { ... },
    "projectDetails": { ... },
    "pricingData": { ... },
    "source": "myroofer.ai"
  }
}
```

## Données Incluses

### Informations de Contact ✅
- Prénom et nom
- Email
- Téléphone

### Informations de Propriété ✅
- Adresse complète
- Ville, État, Code postal
- Surface du toit (pieds carrés)
- Hauteur du bâtiment
- Forme du toit
- Nombre de segments
- Complexité de la pente

### Détails du Projet ✅
- Âge du toit
- Matériau actuel du toit
- Conditions du toit (liste)
- Problèmes identifiés
- Facilité d'accès à la propriété
- Types de service demandés
- Timeline du projet
- Meilleur moment pour contact
- Préférence de contact

### Données de Pricing ✅
- **Estimation basse** (basée sur l'état détecté)
- **Estimation haute** (basée sur l'état détecté)
- **Estimation moyenne** (calculée)
- **Prix par pied carré**
- **Type de matériau recommandé**
- **État/Province** (pour pricing régional)
- **Score de complexité** (facteurs combinés)
- **Facteurs détaillés** (complexité, accès, âge, conditions)

### Métadonnées ✅
- Timestamp ISO 8601
- Lead ID unique
- Source (myroofer.ai)
- User Agent
- Adresse IP

## Validation

Le payload est automatiquement validé avant l'envoi:

```typescript
✅ Prénom requis
✅ Nom requis
✅ Email requis (format validé)
✅ Téléphone requis
✅ Adresse requise
✅ Surface du toit > 0
✅ Estimations de prix présentes
```

Si la validation échoue, l'API retourne une erreur 400 avec les détails.

## Endpoints

### Production
```
POST https://myroofer.ai/api/webhook
```

### Développement
```
POST http://localhost:3000/api/webhook
```

## Configuration

### Variables d'Environnement

```bash
# URL(s) du webhook externe (séparées par des virgules)
WEBHOOK_URLS=https://hook.us2.make.com/your-webhook-id

# Pour bypass Vercel protection
VERCEL_AUTOMATION_BYPASS_SECRET=your-secret

# Meta Conversion API (optionnel)
NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id
META_CONVERSION_ACCESS_TOKEN=your-token
```

## Intégrations Supportées

### ✅ Make.com (Integromat)
- Format Google Sheets directement compatible
- Mapping automatique des colonnes A-Z
- Données structurées disponibles via `_structured`

### ✅ Zapier
- Webhook Trigger compatible
- Parse JSON pour accéder aux données structurées
- Tous les champs disponibles

### ✅ Google Sheets
- Colonnes A-Z pré-formatées
- Headers en français pour compatibilité
- Ajout automatique via Make.com ou Zapier

### ✅ CRM Personnalisé
- Format structuré `_structured` pour parsing facile
- Tous les champs typés et documentés
- Validation automatique

## Exemple d'Utilisation (Make.com)

1. **Créer un Webhook** dans Make.com
2. **Copier l'URL** du webhook
3. **Ajouter à `.env`**: `WEBHOOK_URLS=https://hook.us2.make.com/...`
4. **Créer un Scénario** avec:
   - Webhook trigger
   - Google Sheets: Add Row
   - Email notification
   - CRM update

## Sécurité

- ✅ Validation des données côté serveur
- ✅ Hashing des PII pour Meta Conversion API
- ✅ HTTPS obligatoire en production
- ✅ Rate limiting (à configurer)
- ✅ IP whitelisting (optionnel)

## Monitoring

Tous les webhooks sont loggés avec:
- Timestamp
- Lead ID
- Status (success/error)
- Response time
- Payload size
- Destination URL

## Support

Pour questions ou problèmes:
1. Vérifier les logs serveur
2. Tester avec l'endpoint `/api/webhook/test`
3. Valider le format du payload
4. Vérifier les variables d'environnement

## Changelog

### v2.0 (Current)
- ✅ Payload structuré avec 3 formats
- ✅ Validation automatique
- ✅ Pricing par état (50 états US)
- ✅ Métadonnées enrichies
- ✅ Support multi-webhook

### v1.0 (Legacy)
- Format simple contact/property/project
- Pricing générique
- Single webhook
