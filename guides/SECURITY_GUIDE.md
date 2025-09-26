# 🔒 Guide de Sécurité - MonBaril™

## 🚨 **PROBLÈME RÉSOLU : Secret Stripe exposé**

### **Ce qui s'est passé :**
- Un exemple de secret Stripe a été détecté par GitHub dans `STRIPE_WEBHOOK_SETUP.md`
- GitHub a automatiquement alerté sur cette exposition de secret
- Le secret a été remplacé par un placeholder sécurisé

### **Action corrective :**
- ✅ Secret remplacé par `whsec_[VOTRE_SECRET_ICI]`
- ✅ Vérification qu'aucun autre secret n'est exposé
- ✅ `.gitignore` vérifié (`.env*` déjà présent)

---

## 🛡️ **Bonnes Pratiques de Sécurité**

### **1. Variables d'environnement**
```bash
# ✅ CORRECT - Dans .env.local (jamais commité)
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...

# ❌ INCORRECT - Dans le code ou documentation
const secret = "whsec_1234567890abcdef..."
```

### **2. Documentation sécurisée**
```bash
# ✅ CORRECT - Placeholder générique
STRIPE_WEBHOOK_SECRET=whsec_[VOTRE_SECRET_ICI]

# ❌ INCORRECT - Exemple réaliste
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **3. Secrets à protéger**
- **Stripe** : `sk_test_`, `pk_test_`, `whsec_`
- **Supabase** : `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **Resend** : `RESEND_API_KEY`
- **JWT** : `JWT_SECRET`
- **Base64** : Clés encodées

---

## 🔍 **Vérifications Automatiques**

### **Avant chaque commit :**
```bash
# Vérifier qu'aucun secret n'est exposé
grep -r "sk_test_\|pk_test_\|whsec_\|SUPABASE_URL" --exclude-dir=node_modules .
```

### **GitHub Security Features :**
- ✅ **Secret Scanning** : Détection automatique
- ✅ **Dependabot** : Mise à jour des dépendances
- ✅ **Code Scanning** : Analyse de sécurité

---

## 📋 **Checklist Sécurité**

### **Avant commit :**
- [ ] Aucun secret dans le code
- [ ] Variables d'environnement dans `.env.local`
- [ ] Documentation avec placeholders
- [ ] `.gitignore` à jour

### **Avant déploiement :**
- [ ] Variables d'environnement configurées
- [ ] Secrets rotés si nécessaire
- [ ] Tests de sécurité passés
- [ ] Monitoring activé

---

## 🚨 **En cas d'exposition de secret**

### **Actions immédiates :**
1. **Révocation** : Révoquer le secret exposé
2. **Rotation** : Générer un nouveau secret
3. **Audit** : Vérifier les logs d'accès
4. **Notification** : Informer l'équipe

### **Prévention :**
- Utiliser des outils de détection
- Code review systématique
- Formation sécurité équipe
- Tests automatisés

---

## ✅ **Résultat**

Le problème de sécurité a été résolu et des mesures préventives sont en place pour éviter qu'il se reproduise. 🔒
