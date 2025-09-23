# Architecture Technique - SneakerShop

## Vue d'ensemble

SneakerShop est une application e-commerce fullstack construite avec Next.js 15, utilisant l'App Router et TypeScript pour une architecture moderne et scalable.

## Structure du projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── products/      # Gestion produits
│   │   ├── stocks/        # Gestion stocks + SSE
│   │   ├── orders/        # Gestion commandes
│   │   └── checkout/      # Processus de commande
│   ├── admin/             # Pages admin
│   ├── cart/              # Panier client
│   ├── checkout/          # Checkout
│   ├── product/           # Pages produits
│   ├── privacy/           # RGPD
│   └── terms/             # CGV
├── components/            # Composants réutilisables
│   ├── cart/              # Logique panier
│   ├── gdpr/              # Conformité RGPD
│   └── ui/                # Composants UI
├── lib/                   # Utilitaires
│   ├── prisma.ts          # Client Prisma
│   ├── auth.ts            # Config NextAuth
│   └── bus.ts             # Event bus SSE
└── prisma/                # Schéma base de données
    ├── schema.prisma      # Modèles Prisma
    └── seed.ts            # Données de test
```

## Base de données

### Modèle relationnel

- **User** : Utilisateurs avec rôles (ADMIN, SELLER, CUSTOMER)
- **Product** : Produits avec variantes
- **Variant** : Couleurs et images
- **Size** : Tailles par catégorie
- **Stock** : Quantités par variant/taille
- **Order** : Commandes avec statuts
- **Cart** : Panier utilisateur

## Flux de données

### 1. Authentification
```
Client → NextAuth → JWT → Session
```

### 2. Gestion des stocks (temps réel)
```
Admin modifie stock → API PATCH → Event Bus → SSE → Client update
```

### 3. Processus de commande
```
Client → Cart → Checkout → API → Transaction DB → Order created
```

## Patterns architecturaux

### 1. Server Components + Client Components
- **Server Components** : Pages, API routes, données initiales
- **Client Components** : Interactivité, état local, hooks

### 2. Context API pour l'état global
```typescript
// CartProvider pour l'état panier
const { items, addItem, removeItem } = useCart()
```

### 3. Event Bus pour le temps réel
```typescript
// Émission d'événements
emitStockUpdate(stockId, quantity)

// Écoute côté client
EventSource('/api/stocks/sse')
```

## Sécurité

### 1. Authentification
- NextAuth.js avec JWT
- Sessions sécurisées
- Protection CSRF intégrée

### 2. Autorisation
```typescript
// Middleware de protection
const role = session?.user?.role
if (role !== 'ADMIN' && role !== 'SELLER') {
  return new NextResponse('Forbidden', { status: 403 })
}
```

## Performance

### 1. Optimisations Next.js
- Image optimization avec `next/image`
- Lazy loading des composants
- Code splitting automatique

### 2. Base de données
- Index sur les clés étrangères
- Requêtes optimisées avec Prisma
- Pagination pour les listes
