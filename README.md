# SneakerShop

Application e‑commerce pour la vente de sneakers, avec gestion des stocks en temps réel, rôles utilisateurs et conformité RGPD.

## Fonctionnalités

### Gestion des stocks
- CRUD complet (créer, lire, modifier, supprimer)
- Mises à jour en temps réel via Server‑Sent Events (SSE)
- Interface administrateur/vendeur pour gérer les quantités
- Tailles par catégories (hommes, femmes, enfants)

### Rôles et droits
- Administrateur : accès complet (stocks, commandes, utilisateurs)
- Vendeur : gestion des stocks et commandes
- Client : navigation, panier, commandes

### Parcours d’achat
- Catalogue avec recherche et filtres
- Panier persistant
- Checkout avec adresse de livraison
- Paiement fictif
- Confirmation de commande (email simulé)
- Suivi des commandes

### Interface utilisateur
- Design responsive
- Composants réutilisables (Button, Card, Logo)
- Navigation claire

### RGPD
- Bandeau de consentement cookies (session)
- Politique de confidentialité
- Conditions générales de vente
- Sessions sécurisées

## Technologies

- Frontend : Next.js 15, React 19, TypeScript
- Style : Tailwind CSS
- Base de données : SQLite (dev) avec Prisma ORM
- Authentification : NextAuth.js (Credentials + JWT)
- État global : Context API
- Temps réel : Server‑Sent Events (SSE)

## Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd shoe-store
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l’environnement
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. Initialiser la base de données
```bash
npx prisma migrate dev
npm run seed
```

5. Lancer le serveur de développement
```bash
npm run dev
```

## Configuration

### Variables d’environnement
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Connexion

Page de connexion: `http://localhost:3000/api/auth/signin` (Credentials).

Comptes de test:
- Admin: `admin@example.com` / `admin123`
- Vendeur: `seller@example.com` / `seller123`
- Client: `customer@example.com` / `customer123`

Déconnexion: `http://localhost:3000/api/auth/signout`

### Liens rapides (dev)
- Accueil: `http://localhost:3000/`
- Panier: `http://localhost:3000/cart`
- Checkout: `http://localhost:3000/checkout`
- Mes commandes (client): `http://localhost:3000/orders`
- Facture d’une commande: `http://localhost:3000/orders/[id]/invoice` (ajouter `?print=1` pour lancer l’impression)
- Admin commandes: `http://localhost:3000/admin/orders` (ADMIN/SELLER)
- Admin stocks: `http://localhost:3000/admin/stocks` (ADMIN/SELLER)

## Base de données

### Modèles principaux
- **User** : Utilisateurs avec rôles
- **Product** : Produits avec variantes
- **Variant** : Couleurs et images
- **Size** : Tailles par catégorie
- **Stock** : Quantités par variant/taille
- **Order** : Commandes avec statuts
- **Cart** : Panier utilisateur

## API Endpoints

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/[id]` - Détail produit

### Stocks
- `GET /api/stocks` - Liste des stocks (filtres: `q`, `category`, `minQty`, `maxQty`)
- `POST /api/stock` - Créer un stock `{ variantId, sizeId, quantity? }`
- `PATCH /api/stock` - Modifier la quantité `{ stockId, quantity }`
- `DELETE /api/stock?id=...` - Supprimer un stock
- `GET /api/stocks/sse` - Stream temps réel (SSE)

### Aide à la saisie (admin)
- `GET /api/variants?q=...&take=20` - Recherche de variantes (retourne `{ id, label }`)
- `GET /api/sizes?q=...&take=50&category=men|women|kids` - Recherche de tailles

### Commandes
- `GET /api/orders` - Liste des commandes
- `PATCH /api/orders` - Modifier statut
 - Facture HTML imprimable: `GET /orders/[id]/invoice` (`?print=1` pour auto-impression)

### Checkout
- `POST /api/checkout` - Créer commande

## Sécurité

- Authentification JWT avec NextAuth
- Validation des rôles sur les routes sensibles
- Protection CSRF intégrée
- Sessions sécurisées
- Validation des données côté serveur

## Responsive

- Mobile-first approach
- Breakpoints Tailwind optimisés
- Navigation adaptative
- Images responsives

## Déploiement

### Build de production
```bash
npm run build
npm start
```

### Variables d’environnement (prod)
- Configurer `DATABASE_URL` pour votre base de données
- Générer un `NEXTAUTH_SECRET` sécurisé
- Définir `NEXTAUTH_URL` avec votre domaine

## Performance

- Images optimisées avec Next.js Image
- Lazy loading des composants
- Mise en cache des requêtes
- Compression gzip

## Tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Coverage
npm run test:coverage
```

## Documentation API

La documentation complète de l'API est disponible dans `/docs/api.md`

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème :
- Email : adam.ba@epitech.digital
- Issues GitHub : [Créer une issue](https://github.com/Adam1701/AdamProject)

—

Projet maintenu par Adam BA


