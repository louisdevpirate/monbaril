#!/bin/bash

# Script de test du flux d'inscription complet
# Ce script teste le système d'inscription avec confirmation email

echo "🧪 Test du flux d'inscription MonBaril"
echo "======================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour tester un endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local expected_code=$3
    
    echo -n "Test de $name ($url)... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ OK (HTTP $response_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ ÉCHEC (HTTP $response_code, attendu $expected_code)${NC}"
        return 1
    fi
}

echo ""
echo "📋 Tests des pages d'inscription :"
echo "--------------------------------"

# Tests des endpoints
test_endpoint "http://localhost:3000/signup" "Page d'inscription" "200"
test_endpoint "http://localhost:3000/signup/pending" "Page d'attente" "200"
test_endpoint "http://localhost:3000/signup/complete" "Page de finalisation" "200"
test_endpoint "http://localhost:3000/login" "Page de connexion" "200"

echo ""
echo "🔧 Configuration Supabase requise :"
echo "=================================="
echo ""
echo "1. 📍 URLs à configurer dans Supabase Dashboard :"
echo "   - Site URL: http://localhost:3000"
echo "   - Redirect URLs:"
echo "     * http://localhost:3000/signup/complete"
echo "     * http://localhost:3000/auth/callback"
echo "     * http://localhost:3000"
echo ""
echo "2. ✅ Paramètres à activer :"
echo "   - Email confirmations: ON"
echo "   - Email change confirmations: ON"
echo ""
echo "3. 📧 Template d'email à personnaliser :"
echo "   - Confirmation signup template"
echo "   - Inclure le lien {{ .ConfirmationURL }}"
echo ""
echo "4. 🧪 Test du flux complet :"
echo "   - Aller sur http://localhost:3000/signup"
echo "   - Entrer un email valide"
echo "   - Vérifier la réception de l'email"
echo "   - Cliquer sur le lien de confirmation"
echo "   - Compléter le profil sur /signup/complete"
echo ""
echo "📝 Note: Pour les tests, utilisez un email réel pour recevoir l'email de confirmation."
echo ""
echo "🎯 Prochaines étapes :"
echo "====================="
echo "1. Configurer Supabase selon les instructions ci-dessus"
echo "2. Tester l'inscription avec un email réel"
echo "3. Vérifier que l'utilisateur est créé dans la table profiles"
echo "4. Tester la connexion avec le nouveau compte"
