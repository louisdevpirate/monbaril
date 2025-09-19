#!/bin/bash

# Script de migration des URLs Supabase
# Usage: ./migrate-supabase-urls.sh production

ENVIRONMENT=$1
DOMAIN="monbaril.fr"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Configuration pour la PRODUCTION"
    echo "=================================="
    echo ""
    echo "Site URL: https://$DOMAIN"
    echo ""
    echo "Redirect URLs:"
    echo "- https://$DOMAIN/signup/complete"
    echo "- https://$DOMAIN/auth/callback"
    echo "- https://$DOMAIN"
    echo "- https://www.$DOMAIN/signup/complete"
    echo "- https://www.$DOMAIN/auth/callback"
    echo "- https://www.$DOMAIN"
    echo ""
    echo "📋 Instructions:"
    echo "1. Aller dans Supabase Dashboard → Authentication → URL Configuration"
    echo "2. Remplacer les URLs localhost par les URLs ci-dessus"
    echo "3. Sauvegarder les modifications"
    echo "4. Tester l'inscription sur https://$DOMAIN"
    
elif [ "$ENVIRONMENT" = "development" ]; then
    echo "🛠️ Configuration pour le DÉVELOPPEMENT"
    echo "===================================="
    echo ""
    echo "Site URL: http://localhost:3000"
    echo ""
    echo "Redirect URLs:"
    echo "- http://localhost:3000/signup/complete"
    echo "- http://localhost:3000/auth/callback"
    echo "- http://localhost:3000"
    echo ""
    echo "📋 Instructions:"
    echo "1. Aller dans Supabase Dashboard → Authentication → URL Configuration"
    echo "2. Utiliser les URLs localhost ci-dessus"
    echo "3. Sauvegarder les modifications"
    echo "4. Tester l'inscription sur http://localhost:3000"
    
else
    echo "❌ Usage: $0 [development|production]"
    echo ""
    echo "Exemples:"
    echo "  $0 development   # Configuration pour localhost"
    echo "  $0 production    # Configuration pour monbaril.fr"
fi
