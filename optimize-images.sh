#!/bin/bash

# Script d'optimisation d'images pour MonBaril
# Usage: ./optimize-images.sh

echo "🖼️  Optimisation des images MonBaril..."

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé. Installez-le avec: brew install imagemagick"
    exit 1
fi

# Créer le dossier optimisé s'il n'existe pas
mkdir -p public/images/optimized

# Optimiser les images du hero
echo "📸 Optimisation des images hero..."

# Image principale du hero (haute qualité)
if [ -f "public/images/header.png" ]; then
    echo "  - header.png"
    convert public/images/header.png \
        -resize 1600x1920^ \
        -quality 95 \
        -strip \
        public/images/optimized/header-optimized.png
    
    # Créer aussi une version WebP pour les navigateurs modernes
    convert public/images/header.png \
        -resize 1600x1920^ \
        -quality 95 \
        -strip \
        public/images/optimized/header-optimized.webp
fi

# Optimiser les images des barils
echo "🛢️  Optimisation des images barils..."

for i in {1..3}; do
    if [ -f "public/barils/baril${i}.png" ]; then
        echo "  - baril${i}.png"
        convert public/barils/baril${i}.png \
            -resize 1200x1200^ \
            -quality 90 \
            -strip \
            public/barils/optimized/baril${i}-optimized.png
        
        # Version WebP
        convert public/barils/baril${i}.png \
            -resize 1200x1200^ \
            -quality 90 \
            -strip \
            public/barils/optimized/baril${i}-optimized.webp
    fi
done

echo "✅ Optimisation terminée !"
echo "📁 Images optimisées dans:"
echo "   - public/images/optimized/"
echo "   - public/barils/optimized/"
echo ""
echo "💡 Conseils:"
echo "   - Utilisez les images .webp pour les navigateurs modernes"
echo "   - Les images .png sont pour la compatibilité"
echo "   - Taille recommandée pour le hero: 1600x1920px"
echo "   - Taille recommandée pour les produits: 1200x1200px"
