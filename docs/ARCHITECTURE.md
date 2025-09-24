# Architecture technique

## Vue d’ensemble

Application e‑commerce construite avec Next.js 15 (App Router) et TypeScript. Objectif: code clair, modules isolés, et performances correctes par défaut.

## Structure du projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # Routes API
│   ├── admin/             # Pages admin
│   ├── cart/              # Panier
│   ├── checkout/          # Checkout
│   ├── product/           # Pages produits
│   ├── privacy/           # RGPD
│   └── terms/             # CGV
├── components/            # UI et logique client
│   ├── cart/              # Panier
│   ├── gdpr/              # Bandeau cookies
│   └── ui/                # Composants UI
├── lib/                   # Utilitaires serveur
│   ├── prisma.ts          # Client Prisma
│   ├── auth.ts            # NextAuth
│   └── bus.ts             # Event bus (SSE)
└── prisma/                # Schéma et seeds
    ├── schema.prisma
    └── seed.ts
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

## Patterns

### 1. Server vs Client Components
- Server: pages, API, accès DB
- Client: interactivité, état local

### 2. Context API pour l’état global
```typescript
// CartProvider pour l'état panier
const { items, addItem, removeItem } = useCart()
```

### 3. Event bus pour le temps réel
```typescript
// Émission d'événements
emitStockUpdate(stockId, quantity)

// Écoute côté client
EventSource('/api/stocks/sse')
```

## Sécurité

### 1. Authentification
- NextAuth.js (JWT)
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

### 1. Côté Next.js
- `next/image` pour les images
- Lazy loading
- Code splitting

### 2. Base de données
- Index sur clés étrangères
- Requêtes Prisma ciblées
- Pagination systématique
