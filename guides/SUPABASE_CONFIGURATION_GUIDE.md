# 🚀 Guide de configuration Supabase - Système d'inscription

## 📋 **Étapes de configuration dans Supabase Dashboard**

### **1. Accès au Dashboard**
- Allez sur [supabase.com](https://supabase.com)
- Connectez-vous à votre compte
- Sélectionnez votre projet **MonBaril**

### **2. Configuration des URLs (CRITIQUE)**

#### **Étape 2.1 : Aller dans Authentication**
1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"URL Configuration"**

#### **Étape 2.2 : Configurer les URLs**

**🛠️ Pour le DÉVELOPPEMENT (localhost) :**
```
Site URL: http://localhost:3000

Redirect URLs (une par ligne):
http://localhost:3000/signup/complete
http://localhost:3000/auth/callback
http://localhost:3000
```

**🚀 Pour la PRODUCTION (votre domaine) :**
```
Site URL: https://monbaril.fr

Redirect URLs (une par ligne):
https://monbaril.fr/signup/complete
https://monbaril.fr/auth/callback
https://monbaril.fr
https://www.monbaril.fr/signup/complete
https://www.monbaril.fr/auth/callback
https://www.monbaril.fr
```

⚠️ **Important** : Les URLs localhost ne fonctionnent que pour le développement local. Pour la production, utilisez votre domaine réel avec HTTPS.

### **3. Activation de la confirmation email**

#### **Étape 3.1 : Aller dans Settings**
1. Dans **"Authentication"**, cliquez sur **"Settings"**
2. Faites défiler jusqu'à **"User Signups"**

#### **Étape 3.2 : Activer les confirmations**
- ✅ **"Enable email confirmations"** : COCHÉ
- ✅ **"Enable email change confirmations"** : COCHÉ

### **4. Personnalisation des templates d'email**

#### **Étape 4.1 : Aller dans Email Templates**
1. Dans **"Authentication"**, cliquez sur **"Email Templates"**
2. Cliquez sur **"Confirm signup"**

#### **Étape 4.2 : Modifier le template**
```html
<h2>🎉 Bienvenue sur MonBaril !</h2>
<p>Merci de vous être inscrit sur notre plateforme.</p>
<p>Pour finaliser votre inscription et créer votre profil, cliquez sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirmer mon compte</a></p>
<p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
<p>L'équipe MonBaril</p>
```

### **5. Vérification des providers**

#### **Étape 5.1 : Aller dans Providers**
1. Dans **"Authentication"**, cliquez sur **"Providers"**
2. Vérifiez que **"Email"** est activé

### **6. Test du système**

#### **Étape 6.1 : Test d'inscription**
1. Allez sur `http://localhost:3000/signup`
2. Entrez un **email réel** (vous devez recevoir l'email)
3. Cliquez sur **"S'inscrire"**

#### **Étape 6.2 : Vérification email**
1. Vérifiez votre boîte mail
2. Cliquez sur le lien de confirmation
3. Vous devriez être redirigé vers `/signup/complete`

#### **Étape 6.3 : Finalisation du profil**
1. Complétez le formulaire :
   - Nom d'utilisateur
   - Date de naissance
   - Avatar
   - Mot de passe
2. Cliquez sur **"Finaliser mon inscription"**

### **7. Vérification en base de données**

#### **Étape 7.1 : Vérifier la table profiles**
1. Dans Supabase, allez dans **"Table Editor"**
2. Sélectionnez la table **"profiles"**
3. Vérifiez qu'un nouveau profil a été créé

#### **Étape 7.2 : Vérifier la table auth.users**
1. Dans **"Authentication"**, cliquez sur **"Users"**
2. Vérifiez que l'utilisateur apparaît avec le statut **"Confirmed"**

## 🔧 **Dépannage**

### **Problème : Email non reçu**
- Vérifiez les spams
- Vérifiez que l'email est correct
- Vérifiez la configuration SMTP

### **Problème : Redirection incorrecte**
- Vérifiez les URLs dans "URL Configuration"
- Assurez-vous que `/signup/complete` est dans les Redirect URLs

### **Problème : Erreur de confirmation**
- Vérifiez que "Enable email confirmations" est activé
- Vérifiez le template d'email

## ✅ **Checklist de configuration**

### **🛠️ Développement (localhost)**
- [ ] Site URL configuré : `http://localhost:3000`
- [ ] Redirect URLs configurées
- [ ] Email confirmations activées
- [ ] Template d'email personnalisé
- [ ] Provider Email activé
- [ ] Test d'inscription réussi
- [ ] Utilisateur créé dans profiles
- [ ] Connexion fonctionnelle

### **🚀 Production (votre domaine)**
- [ ] Domaine acheté et configuré
- [ ] SSL/HTTPS activé
- [ ] Site URL mis à jour : `https://monbaril.fr`
- [ ] Redirect URLs mises à jour avec votre domaine
- [ ] Variables d'environnement configurées
- [ ] Test d'inscription sur le domaine de production
- [ ] Emails de confirmation reçus
- [ ] Redirections fonctionnelles

## 🔄 **Migration vers la production**

### **Quand vous serez prêt à mettre en ligne :**

1. **Acheter un domaine** (ex: monbaril.fr)
2. **Configurer le DNS** pour pointer vers votre hébergeur
3. **Déployer votre application** sur Vercel/Netlify/etc.
4. **Mettre à jour Supabase** avec les nouvelles URLs :
   - Site URL : `https://monbaril.fr`
   - Redirect URLs : `https://monbaril.fr/signup/complete`, etc.
5. **Tester** l'inscription sur votre domaine de production

### **Script de migration :**
```bash
# Utiliser le script fourni
./migrate-supabase-urls.sh production
```

## 🎯 **Prochaines étapes**

### **🛠️ Développement actuel :**
1. Configurer Supabase avec les URLs localhost
2. Tester le flux complet d'inscription
3. Vérifier la création du profil
4. Tester la connexion

### **🚀 Production future :**
1. Acheter et configurer le domaine
2. Déployer l'application
3. Migrer les URLs Supabase
4. Configurer les emails de production (SMTP)
5. Tester sur le domaine de production

---

**Note importante** : 
- **Développement** : Utilisez `http://localhost:3000`
- **Production** : Utilisez `https://monbaril.fr` (votre domaine réel)
- Pour les tests, utilisez toujours un email réel car Supabase envoie de vrais emails de confirmation.
