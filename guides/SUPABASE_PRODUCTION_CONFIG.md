# 🌐 Configuration Supabase - Développement vs Production

## 📋 **Configuration pour le DÉVELOPPEMENT (localhost)**

### URLs à configurer dans Supabase Dashboard :
```
Site URL: http://localhost:3000

Redirect URLs:
- http://localhost:3000/signup/complete
- http://localhost:3000/auth/callback
- http://localhost:3000
```

## 🚀 **Configuration pour la PRODUCTION (votre domaine)**

### URLs à configurer dans Supabase Dashboard :
```
Site URL: https://monbaril.fr

Redirect URLs:
- https://monbaril.fr/signup/complete
- https://monbaril.fr/auth/callback
- https://monbaril.fr
- https://www.monbaril.fr/signup/complete
- https://www.monbaril.fr/auth/callback
- https://www.monbaril.fr
```

## 🔄 **Migration de développement vers production**

### Étape 1 : Préparer la production
1. **Acheter un domaine** (ex: monbaril.fr)
2. **Configurer le DNS** pour pointer vers votre hébergeur
3. **Déployer votre application** sur Vercel/Netlify/etc.
4. **Obtenir l'URL de production** (ex: https://monbaril.fr)

### Étape 2 : Mettre à jour Supabase
1. **Aller dans Supabase Dashboard** → Authentication → URL Configuration
2. **Remplacer les URLs localhost** par vos URLs de production
3. **Ajouter les variantes** (avec/sans www, http/https)
4. **Sauvegarder** les modifications

### Étape 3 : Mettre à jour les variables d'environnement
```bash
# .env.local (développement)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# .env.production (production)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🛠️ **Configuration recommandée pour la production**

### URLs complètes à ajouter :
```
Site URL: https://monbaril.fr

Redirect URLs:
- https://monbaril.fr/signup/complete
- https://monbaril.fr/auth/callback
- https://monbaril.fr
- https://www.monbaril.fr/signup/complete
- https://www.monbaril.fr/auth/callback
- https://www.monbaril.fr
- https://monbaril.fr/login
- https://www.monbaril.fr/login
- https://monbaril.fr/profile
- https://www.monbaril.fr/profile
```

### Paramètres de sécurité à activer :
- ✅ **Enable email confirmations**
- ✅ **Enable email change confirmations**
- ✅ **Enable phone confirmations** (optionnel)
- ✅ **Enable anonymous sign-ins** (si nécessaire)

## 🔧 **Script de migration automatique**

```bash
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
```

## ⚠️ **Points importants**

### 1. **Sécurité**
- **Jamais** utiliser `http://` en production (toujours `https://`)
- **Toujours** vérifier que le domaine est correct
- **Tester** les redirections après chaque changement

### 2. **Performance**
- **Utiliser un CDN** pour les assets statiques
- **Optimiser les images** pour la production
- **Configurer le cache** approprié

### 3. **Monitoring**
- **Surveiller les erreurs** d'authentification
- **Tracer les conversions** d'inscription
- **Analyser les logs** Supabase

## 🎯 **Checklist de déploiement**

### Avant la mise en production :
- [ ] Domaine acheté et configuré
- [ ] SSL/HTTPS activé
- [ ] URLs Supabase mises à jour
- [ ] Variables d'environnement configurées
- [ ] Templates d'email testés
- [ ] Flux d'inscription testé

### Après la mise en production :
- [ ] Test d'inscription sur le domaine de production
- [ ] Vérification des emails de confirmation
- [ ] Test des redirections
- [ ] Monitoring des erreurs
- [ ] Performance vérifiée

## 📞 **Support**

Si vous rencontrez des problèmes :
1. **Vérifier les logs** Supabase Dashboard
2. **Tester les URLs** de redirection
3. **Vérifier les variables** d'environnement
4. **Contacter le support** Supabase si nécessaire

---

**Note importante** : Les URLs localhost ne fonctionnent que pour le développement local. Pour la production, vous devez absolument utiliser votre domaine réel avec HTTPS.
