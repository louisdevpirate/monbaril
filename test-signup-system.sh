#!/bin/bash

# Script de test du système d'inscription
# Ce script teste les endpoints du système d'inscription

echo "🧪 Test du système d'inscription MonBaril"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Tests des endpoints
echo ""
echo "📋 Tests des pages d'inscription :"
echo "--------------------------------"

test_endpoint "http://localhost:3000/signup" "Page d'inscription" "200"
test_endpoint "http://localhost:3000/signup/pending" "Page d'attente" "200"
test_endpoint "http://localhost:3000/signup/complete" "Page de finalisation" "200"
test_endpoint "http://localhost:3000/login" "Page de connexion" "200"

echo ""
echo "📋 Tests des pages principales :"
echo "-------------------------------"

test_endpoint "http://localhost:3000/" "Page d'accueil" "200"
test_endpoint "http://localhost:3000/profile" "Page de profil" "200"

echo ""
echo "📋 Tests des pages admin :"
echo "-------------------------"

test_endpoint "http://localhost:3000/admin" "Dashboard admin" "200"
test_endpoint "http://localhost:3000/admin/orders" "Commandes admin" "200"
test_endpoint "http://localhost:3000/admin/categories" "Catégories admin" "200"

echo ""
echo "🎯 Résumé des tests :"
echo "===================="

# Compter les tests réussis
total_tests=8
passed_tests=0

for url in "http://localhost:3000/signup" "http://localhost:3000/signup/pending" "http://localhost:3000/signup/complete" "http://localhost:3000/login" "http://localhost:3000/" "http://localhost:3000/profile" "http://localhost:3000/admin" "http://localhost:3000/admin/orders"; do
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$response_code" = "200" ]; then
        passed_tests=$((passed_tests + 1))
    fi
done

echo "Tests réussis : $passed_tests/$total_tests"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés ! Le système d'inscription est prêt.${NC}"
else
    echo -e "${YELLOW}⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.${NC}"
fi

echo ""
echo "📝 Prochaines étapes :"
echo "====================="
echo "1. Configurer Supabase pour la confirmation d'email"
echo "2. Tester le flux complet d'inscription avec un vrai email"
echo "3. Vérifier la création du profil dans la base de données"
echo "4. Tester la connexion après inscription"

echo ""
echo "🔧 Configuration Supabase requise :"
echo "=================================="
echo "- Site URL: http://localhost:3000"
echo "- Redirect URLs: http://localhost:3000/signup/complete"
echo "- Email confirmation: Activé"
echo "- Email templates: Personnalisés"
