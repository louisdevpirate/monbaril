# 📧 Guide Complet des Templates d'Email Supabase - MonBaril

## 🎯 **Types d'emails Supabase et leur utilisation**

### **1. Confirm signup** - Confirmation d'inscription
**Quand** : L'utilisateur s'inscrit avec un email
**Action** : Confirme son compte en cliquant sur le lien
**Template** : Utilise `{{ .ConfirmationURL }}`

### **2. Invite user** - Invitation d'utilisateur
**Quand** : Un admin invite un utilisateur à rejoindre
**Action** : L'utilisateur accepte l'invitation
**Template** : Utilise `{{ .ConfirmationURL }}`

### **3. Magic Link** - Connexion sans mot de passe
**Quand** : L'utilisateur demande une connexion par email
**Action** : Se connecte directement via le lien
**Template** : Utilise `{{ .ConfirmationURL }}`

### **4. Change Email Address** - Changement d'email
**Quand** : L'utilisateur change son adresse email
**Action** : Confirme la nouvelle adresse email
**Template** : Utilise `{{ .ConfirmationURL }}`

### **5. Reset Password** - Réinitialisation de mot de passe
**Quand** : L'utilisateur oublie son mot de passe
**Action** : Crée un nouveau mot de passe
**Template** : Utilise `{{ .ConfirmationURL }}`

### **6. Reauthentication** - Réauthentification
**Quand** : L'utilisateur doit se réauthentifier pour une action sensible
**Action** : Confirme son identité
**Template** : Utilise `{{ .ConfirmationURL }}`

---

## 📧 **Templates d'Email MonBaril**

### **1. Confirm signup - Confirmation d'inscription**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #fed7aa; margin: 5px 0 0 0; font-size: 14px;">Artisanat d'exception</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">🎉 Bienvenue chez MonBaril !</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Merci de vous être inscrit ! Nous sommes ravis de vous accueillir dans notre communauté d'amateurs d'artisanat d'exception.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Pour finaliser votre inscription et accéder à tous nos services, veuillez confirmer votre adresse email :
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);">
        ✨ Confirmer mon compte
      </a>
    </div>

    <!-- Avantages -->
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">🚀 Ce qui vous attend :</h3>
      <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">🎨 Collections exclusives d'artisanat</li>
        <li style="margin-bottom: 8px;">💎 Produits de qualité premium</li>
        <li style="margin-bottom: 8px;">📦 Livraison sécurisée</li>
        <li style="margin-bottom: 8px;">❤️ Liste de favoris personnalisée</li>
        <li style="margin-bottom: 0;">🎁 Offres spéciales membres</li>
      </ul>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      <strong>Besoin d'aide ?</strong> Notre équipe est là pour vous accompagner.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Cordialement,<br>
      <strong>L'équipe MonBaril</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
      Si vous n'avez pas créé de compte, ignorez cet email.
    </p>
  </div>

</div>
```

### **2. Invite user - Invitation d'utilisateur**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #c4b5fd; margin: 5px 0 0 0; font-size: 14px;">Invitation exclusive</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">🎁 Vous êtes invité !</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Vous avez été invité à rejoindre MonBaril, la plateforme premium d'artisanat d'exception.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Acceptez cette invitation pour découvrir nos collections exclusives et bénéficier d'avantages privilégiés :
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);">
        🎯 Accepter l'invitation
      </a>
    </div>

    <!-- Avantages exclusifs -->
    <div style="background-color: #faf5ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">💎 Avantages exclusifs :</h3>
      <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">🏆 Accès prioritaire aux nouveautés</li>
        <li style="margin-bottom: 8px;">🎨 Collections limitées</li>
        <li style="margin-bottom: 8px;">💳 Paiement sécurisé</li>
        <li style="margin-bottom: 8px;">🚚 Livraison express</li>
        <li style="margin-bottom: 0;">🎁 Cadeaux de bienvenue</li>
      </ul>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Nous avons hâte de vous accueillir dans notre communauté !<br>
      <strong>L'équipe MonBaril</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
  </div>

</div>
```

### **3. Magic Link - Connexion sans mot de passe**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #a5f3fc; margin: 5px 0 0 0; font-size: 14px;">Connexion magique</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">✨ Connexion instantanée</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Vous avez demandé une connexion sans mot de passe à votre compte MonBaril.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Cliquez sur le bouton ci-dessous pour vous connecter instantanément :
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);">
        🔗 Se connecter maintenant
      </a>
    </div>

    <!-- Sécurité -->
    <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
        <strong>🔒 Sécurité :</strong> Ce lien est valide pendant 1 heure. Si vous n'avez pas demandé cette connexion, ignorez cet email.
      </p>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Cette méthode de connexion est plus sécurisée et pratique que les mots de passe traditionnels.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
  </div>

</div>
```

### **4. Change Email Address - Changement d'email**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #fde68a; margin: 5px 0 0 0; font-size: 14px;">Changement d'email</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">📧 Confirmer votre nouvel email</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Vous avez demandé à changer l'adresse email associée à votre compte MonBaril.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);">
        ✅ Confirmer le changement
      </a>
    </div>

    <!-- Avertissement -->
    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #92400e; margin: 0; font-size: 14px;">
        <strong>⚠️ Important :</strong> Si vous n'avez pas demandé ce changement, ignorez cet email et contactez notre support.
      </p>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Une fois confirmé, votre nouvel email sera utilisé pour toutes les communications MonBaril.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
  </div>

</div>
```

### **5. Reset Password - Réinitialisation de mot de passe**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px;">Réinitialisation de mot de passe</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">🔐 Réinitialisation de mot de passe</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte MonBaril.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Si vous avez effectué cette demande, cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);">
        🔑 Réinitialiser mon mot de passe
      </a>
    </div>

    <!-- Avertissement sécurité -->
    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #92400e; margin: 0; font-size: 14px;">
        <strong>⚠️ Important :</strong> Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Pour votre sécurité, nous vous recommandons de choisir un mot de passe fort et unique.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
  </div>

</div>
```

### **6. Reauthentication - Réauthentification**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MonBaril™</h1>
    <p style="color: #fecaca; margin: 5px 0 0 0; font-size: 14px;">Vérification de sécurité</p>
  </div>

  <!-- Contenu -->
  <div style="padding: 30px 20px;">
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">🛡️ Vérification de sécurité requise</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Pour des raisons de sécurité, nous devons vérifier votre identité avant de continuer.
    </p>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
      Cette vérification est nécessaire pour protéger votre compte et vos données personnelles.
    </p>

    <!-- Bouton CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);">
        🔒 Vérifier mon identité
      </a>
    </div>

    <!-- Informations sécurité -->
    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #991b1b; margin: 0; font-size: 14px;">
        <strong>🔐 Sécurité :</strong> Cette vérification est temporaire et expire dans 15 minutes. Elle est requise pour les actions sensibles de votre compte.
      </p>
    </div>

    <p style="color: #4b5563; line-height: 1.6; margin: 0;">
      Merci de votre compréhension pour cette mesure de sécurité supplémentaire.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; margin: 0; font-size: 14px;">
      <strong>MonBaril™</strong> - Artisanat d'exception depuis 2024
    </p>
  </div>

</div>
```

---

## 🎨 **Palette de couleurs utilisée**

- **Confirm signup** : Orange (`#f97316`) - Accueil chaleureux
- **Invite user** : Violet (`#8b5cf6`) - Invitation exclusive
- **Magic Link** : Cyan (`#06b6d4`) - Connexion moderne
- **Change Email** : Ambre (`#f59e0b`) - Changement important
- **Reset Password** : Bleu (`#3b82f6`) - Sécurité classique
- **Reauthentication** : Rouge (`#ef4444`) - Urgence sécurité

---

## 📋 **Instructions d'utilisation**

### **1. Aller dans Supabase Dashboard**
- Authentication → Email Templates

### **2. Sélectionner le template**
- Cliquer sur le type d'email souhaité

### **3. Copier le template**
- Copier le HTML correspondant ci-dessus

### **4. Coller dans Supabase**
- Remplacer le contenu par défaut
- Sauvegarder les modifications

### **5. Tester**
- Tester chaque type d'email
- Vérifier le rendu sur mobile et desktop

---

## ✅ **Caractéristiques des templates**

- ✅ **Branding MonBaril** cohérent
- ✅ **Design responsive** pour tous les appareils
- ✅ **Émojis engageants** pour chaque contexte
- ✅ **Call-to-action clairs** avec couleurs distinctes
- ✅ **Informations de sécurité** appropriées
- ✅ **Footer professionnel** uniforme
- ✅ **Gradients modernes** et ombres subtiles
- ✅ **Variables Supabase** correctement utilisées (`{{ .ConfirmationURL }}`)

---

**Note importante** : Tous les templates utilisent la variable `{{ .ConfirmationURL }}` qui sera automatiquement remplacée par Supabase par le lien de confirmation approprié.

