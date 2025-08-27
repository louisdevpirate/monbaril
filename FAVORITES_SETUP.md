# 🚀 Configuration des Favoris - MonBaril App

## 📋 Prérequis
- Base de données Supabase configurée
- Accès à l'interface SQL de Supabase

## 🗄️ Création de la Table Favorites

### 1. Aller dans Supabase Dashboard
- Connecte-toi à [supabase.com](https://supabase.com)
- Sélectionne ton projet
- Va dans **SQL Editor**

### 2. Exécuter le Script SQL
Copie et colle le contenu de `src/lib/supabase/favorites-table.sql` dans l'éditeur SQL et exécute-le.

### 3. Vérifier la Création
Le script va automatiquement :
- ✅ Créer la table `favorites`
- ✅ Activer RLS (Row Level Security)
- ✅ Créer les politiques de sécurité
- ✅ Ajouter les index de performance
- ✅ Créer le trigger de mise à jour automatique

## 🔐 Politiques de Sécurité (RLS)

Les utilisateurs peuvent uniquement :
- **Voir** leurs propres favoris
- **Ajouter** des favoris pour eux-mêmes
- **Supprimer** leurs propres favoris
- **Modifier** leurs propres favoris

## 🧪 Test des Favoris

### 1. Test en Déconnecté
- Va sur la page d'accueil
- Clique sur le bouton favori (🤍) d'un produit
- ✅ Tu dois être redirigé vers `/login`

### 2. Test Connecté
- Connecte-toi avec ton compte
- Clique sur le bouton favori d'un produit
- ✅ Le bouton doit passer en rouge (❤️)
- ✅ Un toast doit confirmer l'ajout

### 3. Test de Suppression
- Clique sur le bouton favori rouge
- ✅ Le bouton doit redevenir blanc (🤍)
- ✅ Un toast doit confirmer la suppression

## 🐛 Dépannage

### Erreur "relation favorites does not exist"
- Vérifie que le script SQL a bien été exécuté
- Vérifie que tu es dans le bon projet Supabase

### Erreur "permission denied"
- Vérifie que RLS est activé sur la table
- Vérifie que les politiques sont bien créées

### Les favoris ne se sauvegardent pas
- Vérifie que l'utilisateur est bien connecté
- Vérifie les logs dans la console du navigateur
- Vérifie que `user.id` correspond bien à `auth.uid()`

## 📱 Composants Disponibles

### FavoriteButton
```tsx
import FavoriteButton from "@/components/ui/FavoriteButton";

// Utilisation basique
<FavoriteButton productId="baril-1" />

// Avec options
<FavoriteButton 
  productId="baril-1" 
  size="large" 
  variant="minimal" 
/>
```

### Options Disponibles
- **size**: `"small"` | `"medium"` | `"large"`
- **variant**: `"default"` | `"minimal"`

## 🎨 Personnalisation

Tu peux modifier les couleurs et styles dans :
- `src/components/ui/FavoriteButton.tsx` - Composant principal
- `src/hooks/useFavorites.ts` - Logique métier

## 🔄 Prochaines Étapes

Une fois les favoris fonctionnels, on peut :
1. ✅ Ajouter des animations plus fluides
2. ✅ Créer une page de gestion des favoris
3. ✅ Ajouter des notifications push
4. ✅ Synchroniser avec d'autres appareils

---

**💡 Conseil** : Teste d'abord avec un seul produit avant de tester en masse !
