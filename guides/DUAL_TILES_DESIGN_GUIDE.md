# 🎨 Design Header "Deux Tiles" - MonBaril

## 🚀 **Concept implémenté :**

Reproduction du design bancaire avec :
- ✅ **Deux tiles côte à côte** : Même hauteur, même arrondi
- ✅ **Design "floating"** : Comme sur l'image bancaire
- ✅ **Layout équilibré** : Contenu à gauche, image à droite
- ✅ **Hauteur fixe** : `h-[80vh]` pour les deux tiles

## 🎯 **Structure du design :**

### **1. Container principal :**
```tsx
<div className="w-full max-w-7xl mx-auto px-8">
  <div className="grid lg:grid-cols-2 gap-8 h-[80vh]">
```
- **Largeur maximale** : `max-w-7xl` pour l'espacement
- **Grid 2 colonnes** : `lg:grid-cols-2` pour desktop
- **Gap** : `gap-8` pour l'espacement entre les tiles
- **Hauteur fixe** : `h-[80vh]` pour les deux tiles

### **2. Tile gauche - Contenu :**
```tsx
<motion.div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden p-12 flex flex-col justify-center">
```
- **Background** : `bg-white/95` avec transparence
- **Effet blur** : `backdrop-blur-sm` pour l'effet moderne
- **Arrondi** : `rounded-3xl` pour l'esthétique moderne
- **Ombre** : `shadow-2xl` pour l'effet "floating"
- **Bordure** : `border border-gray-200/50` subtile
- **Padding** : `p-12` pour l'espacement interne
- **Flexbox** : `flex flex-col justify-center` pour centrer verticalement

### **3. Tile droite - Image :**
```tsx
<motion.div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden p-8 flex items-center justify-center">
```
- **Même style** : Identique à la tile gauche
- **Padding réduit** : `p-8` pour l'image
- **Centrage** : `flex items-center justify-center` pour l'image

### **4. Image dans la tile droite :**
```tsx
<SmartImage
  src="/images/image.png"
  alt="Baril Racing Gulf - Design unique et moderne"
  width={800}
  height={960}
  className="w-full h-full object-cover rounded-2xl"
  priority={true}
  quality={95}
/>
```
- **Plein espace** : `w-full h-full` pour remplir la tile
- **Cover** : `object-cover` pour maintenir les proportions
- **Arrondi** : `rounded-2xl` pour l'esthétique
- **Performance** : `priority={true}` pour le chargement rapide

## 🎨 **Résultat visuel :**

### **Effet "bancaire" obtenu :**
- ✅ **Deux tiles identiques** : Même hauteur, même arrondi, même ombre
- ✅ **Layout équilibré** : 50/50 avec gap entre les tiles
- ✅ **Design "floating"** : Tiles arrondies avec ombres
- ✅ **Transparence** : `backdrop-blur-sm` pour l'effet moderne
- ✅ **Responsive** : S'adapte à tous les écrans

### **Avantages du design :**
- **Moderne** : Esthétique très actuelle et tendance
- **Équilibré** : Contenu et image ont la même importance
- **Professionnel** : Effet "premium" comme les grandes marques
- **Lisible** : Contenu parfaitement visible dans sa tile
- **Performant** : Image optimisée avec SmartImage
- **Flexible** : Facile à modifier et adapter

## 🚀 **Caractéristiques techniques :**

### **Hauteur fixe :**
- **Tiles** : `h-[80vh]` pour une hauteur constante
- **Responsive** : S'adapte à la hauteur de l'écran
- **Équilibré** : Les deux tiles ont exactement la même hauteur

### **Espacement :**
- **Gap** : `gap-8` entre les tiles
- **Padding** : `p-12` pour le contenu, `p-8` pour l'image
- **Marges** : `mx-auto px-8` pour ne pas toucher les bords

### **Animations :**
- **Entrée** : `x: -50` pour la gauche, `x: 50` pour la droite
- **Image** : Animation `y: [0, -10, 0]` pour l'effet flottant
- **Timing** : Délais échelonnés pour l'effet séquentiel

## 💡 **Personnalisations possibles :**

### **Hauteur des tiles :**
```tsx
className="grid lg:grid-cols-2 gap-8 h-[70vh]" // Plus petit
className="grid lg:grid-cols-2 gap-8 h-[90vh]" // Plus grand
```

### **Espacement :**
```tsx
className="grid lg:grid-cols-2 gap-4" // Moins d'espace
className="grid lg:grid-cols-2 gap-12" // Plus d'espace
```

### **Arrondi :**
```tsx
className="rounded-2xl" // Moins arrondi
className="rounded-[2rem]" // Plus arrondi
```

### **Transparence :**
```tsx
className="bg-white/90" // Plus transparent
className="bg-white/98" // Plus opaque
```

Ce design reproduit parfaitement l'esthétique bancaire avec deux tiles équilibrées ! 🛢️✨
