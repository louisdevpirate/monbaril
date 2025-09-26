# Guide de création de la table addresses

## Problème
L'erreur "Table addresses non trouvée" indique que la table `addresses` n'existe pas dans votre base de données Supabase.

## Solution

### Étape 1 : Accéder à l'éditeur SQL de Supabase

1. Connectez-vous à votre dashboard Supabase
2. Sélectionnez votre projet
3. Allez dans l'onglet **SQL Editor** (éditeur SQL)

### Étape 2 : Exécuter le script de création

1. Copiez tout le contenu du fichier `src/lib/supabase/addresses-table.sql`
2. Collez-le dans l'éditeur SQL
3. Cliquez sur **Run** (Exécuter)

### Étape 3 : Vérifier la création

Après l'exécution, vous devriez voir :
- ✅ La table `addresses` créée
- ✅ Les index créés pour les performances
- ✅ Les politiques RLS (Row Level Security) configurées
- ✅ Le trigger pour `updated_at` configuré

### Structure de la table

La table `addresses` contient les colonnes suivantes :

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (clé primaire) |
| `user_id` | UUID | Référence vers l'utilisateur (auth.users) |
| `type` | VARCHAR(20) | Type d'adresse ('delivery' ou 'billing') |
| `first_name` | VARCHAR(100) | Prénom |
| `last_name` | VARCHAR(100) | Nom |
| `company` | VARCHAR(100) | Société (optionnel) |
| `address_line_1` | VARCHAR(255) | Adresse ligne 1 |
| `address_line_2` | VARCHAR(255) | Adresse ligne 2 (optionnel) |
| `city` | VARCHAR(100) | Ville |
| `postal_code` | VARCHAR(20) | Code postal |
| `country` | VARCHAR(100) | Pays (défaut: 'France') |
| `phone` | VARCHAR(20) | Téléphone (optionnel) |
| `is_default` | BOOLEAN | Adresse par défaut |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

### Sécurité (RLS)

Les politiques RLS sont configurées pour :
- ✅ Les utilisateurs peuvent voir/modifier/supprimer leurs propres adresses
- ✅ Les admins peuvent voir/modifier/supprimer toutes les adresses
- ✅ Les autres utilisateurs ne peuvent pas accéder aux adresses d'autrui

### Test

Après avoir créé la table, testez l'ajout d'une adresse dans votre profil :
1. Allez sur `/profile`
2. Essayez d'ajouter une adresse de livraison
3. L'erreur "Table addresses non trouvée" ne devrait plus apparaître

## En cas de problème

Si vous rencontrez des erreurs lors de l'exécution du script :
1. Vérifiez que vous êtes connecté à Supabase
2. Vérifiez que vous avez les droits d'administration
3. Assurez-vous que la table `profiles` existe déjà (pour les politiques admin)
4. Contactez-moi avec le message d'erreur exact
