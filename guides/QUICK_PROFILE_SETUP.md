# 🚀 Configuration Rapide - Page Profil

## ⚠️ **ERREUR ACTUELLE**
```
Error: Erreur lors de la mise à jour: {}
```

**Cause** : Les tables `profiles` et `addresses` n'existent pas encore dans Supabase.

## 🔧 **SOLUTION RAPIDE**

### **1. Aller dans Supabase Dashboard**
- Ouvrir votre projet Supabase
- Aller dans **SQL Editor**

### **2. Exécuter le script SQL**
Copier-coller ce script dans l'éditeur SQL :

```sql
-- Tables pour la page profil utilisateur

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  newsletter BOOLEAN DEFAULT false,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des adresses
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('shipping', 'billing')) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'France',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies pour les adresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **3. Cliquer sur "Run"**
- Exécuter le script
- Vérifier qu'il n'y a pas d'erreurs

### **4. Tester la page profil**
- Recharger `/profile`
- Essayer de modifier les informations
- ✅ L'erreur devrait disparaître

## 🎯 **Résultat attendu**

Après l'exécution du script :
- ✅ Tables `profiles` et `addresses` créées
- ✅ RLS policies configurées
- ✅ Page profil fonctionnelle
- ✅ Gestion des adresses opérationnelle

## 📱 **Test rapide**

1. Aller sur `/profile`
2. Modifier le prénom/nom
3. Cliquer "Sauvegarder"
4. ✅ Toast de succès affiché
5. ✅ Données sauvegardées en base
