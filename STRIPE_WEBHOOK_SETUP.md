# 🔧 Configuration Webhook Stripe - MonBaril™

## 🚨 **BUG CORRIGÉ : Email envoyé avant paiement**

### **Problème résolu :**
- ❌ **Avant** : Email envoyé dès la création de la session Stripe (avant paiement)
- ✅ **Après** : Email envoyé seulement après confirmation du paiement via webhook

---

## 📋 **Configuration Requise**

### **1. Variables d'environnement**
Ajouter dans `.env.local` :
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **2. Configuration Webhook dans Stripe Dashboard**

1. **Aller dans Stripe Dashboard** → Developers → Webhooks
2. **Créer un nouveau webhook** :
   - **URL** : `https://votre-domaine.com/api/stripe/webhook`
   - **Événements à écouter** : `checkout.session.completed`
3. **Copier le secret** et l'ajouter à `.env.local`

### **3. Test en local (Stripe CLI)**
```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter à Stripe
stripe login

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🔄 **Nouveau Flux de Paiement**

### **Avant (❌ Bugué) :**
```
1. Utilisateur clique "Payer"
2. Session Stripe créée
3. Email envoyé IMMÉDIATEMENT ❌
4. Redirection vers Stripe
5. Utilisateur peut abandonner le paiement
```

### **Après (✅ Corrigé) :**
```
1. Utilisateur clique "Payer"
2. Session Stripe créée
3. Redirection vers Stripe
4. Utilisateur paie
5. Stripe envoie webhook
6. Email envoyé APRÈS paiement confirmé ✅
```

---

## 🧪 **Test du Fix**

### **Test 1 : Paiement réussi**
1. Passer une commande test
2. Compléter le paiement Stripe
3. ✅ Email reçu après paiement confirmé

### **Test 2 : Paiement abandonné**
1. Passer une commande test
2. Abandonner sur la page Stripe
3. ✅ Aucun email reçu

### **Test 3 : Paiement échoué**
1. Passer une commande test
2. Utiliser une carte refusée
3. ✅ Aucun email reçu

---

## 📊 **Statuts de Commande**

- **`pending`** : Commande créée, en attente de paiement
- **`processing`** : Paiement confirmé, préparation en cours
- **`shipped`** : Commande expédiée
- **`delivered`** : Commande livrée
- **`cancelled`** : Commande annulée

---

## 🚀 **Déploiement**

1. **Configurer le webhook** dans Stripe Dashboard
2. **Ajouter la variable** `STRIPE_WEBHOOK_SECRET`
3. **Tester** avec une commande réelle
4. **Vérifier** que l'email arrive après paiement

---

## ✅ **Résultat**

Le bug critique est maintenant résolu ! L'email de confirmation n'est plus envoyé prématurément. 🎉
