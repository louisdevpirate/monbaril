# Configuration de la Page Profil Utilisateur

## 📋 Vue d'ensemble

La page profil utilisateur (`/profile`) permet aux utilisateurs de :
- Gérer leurs informations personnelles
- Ajouter/modifier leurs adresses de livraison et facturation
- Changer leur mot de passe
- Configurer leurs préférences (newsletter, notifications)
- Accéder à leur historique des commandes

## 🗄️ Configuration Base de Données

### 1. Exécuter le script SQL

Exécutez le fichier `src/lib/supabase/profile-setup.sql` dans votre console Supabase SQL Editor :

```sql
-- Ce script crée :
-- - Table 'profiles' pour les informations utilisateur
-- - Table 'addresses' pour les adresses
-- - RLS policies pour la sécurité
-- - Triggers pour updated_at automatique
```

### 2. Tables créées

#### Table `profiles`
- `id` : UUID (référence auth.users)
- `first_name` : Prénom
- `last_name` : Nom
- `phone` : Téléphone
- `newsletter` : Abonnement newsletter
- `notifications` : Notifications email
- `created_at` / `updated_at` : Timestamps

#### Table `addresses`
- `id` : UUID (clé primaire)
- `user_id` : UUID (référence auth.users)
- `type` : 'shipping' ou 'billing'
- `first_name` / `last_name` : Nom complet
- `company` : Entreprise (optionnel)
- `address` : Adresse complète
- `city` / `postal_code` / `country` : Localisation
- `phone` : Téléphone (optionnel)

## 🔒 Sécurité (RLS)

Toutes les tables sont protégées par Row Level Security :
- Les utilisateurs ne peuvent voir/modifier que leurs propres données
- Les politiques RLS sont automatiquement appliquées

## 🎨 Fonctionnalités

### Onglet "Informations personnelles"
- Modification du prénom/nom
- Email (lecture seule)
- Téléphone
- Préférences newsletter/notifications

### Onglet "Adresses"
- Ajout/modification d'adresses
- Support livraison et facturation
- Validation des champs requis
- Interface intuitive avec formulaires

### Onglet "Sécurité"
- Changement de mot de passe
- Validation de sécurité
- Lien vers l'historique des commandes

## 🚀 Utilisation

1. **Accès** : Via le menu utilisateur dans la navbar
2. **Navigation** : Onglets dans la sidebar gauche
3. **Sauvegarde** : Automatique avec feedback utilisateur
4. **Responsive** : Design adaptatif mobile/desktop

## 🔧 Personnalisation

### Modifier les champs du profil
Éditez l'interface `ProfileData` dans `src/app/(ecommerce)/profile/page.tsx`

### Ajouter de nouveaux types d'adresses
Modifiez l'enum `type` dans la table `addresses` et l'interface `Address`

### Styling personnalisé
Utilisez les classes Tailwind CSS existantes pour personnaliser l'apparence

## 📱 Responsive Design

- **Desktop** : Layout 2 colonnes (sidebar + contenu)
- **Mobile** : Layout vertical avec navigation en haut
- **Animations** : Framer Motion pour les transitions fluides

## ✅ Tests recommandés

1. Création de profil utilisateur
2. Modification des informations
3. Ajout/suppression d'adresses
4. Changement de mot de passe
5. Navigation entre onglets
6. Responsive sur mobile
