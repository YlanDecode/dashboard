# System Metrics Dashboard

Dashboard moderne de monitoring système en temps réel, inspiré de Grafana. Construit avec Next.js 16, React 19, ECharts, et Server-Sent Events (SSE) pour les mises à jour temps réel.

## 🎯 Fonctionnalités

- **Authentification JWT** - Page de login sécurisée avec gestion de session
- **Mises à jour temps réel** - Server-Sent Events (SSE) avec reconnexion automatique
- **9+ Visualisations** - Gauges, line charts, multi-line charts, network charts
- **Design moderne** - Interface Grafana-style avec support dark mode
- **Performance optimisée** - ECharts en mode Canvas, data windowing, lazy loading
- **Responsive** - Design adaptatif mobile/tablet/desktop

## 📊 Métriques Affichées

### Row 1 - Gauges instantanées
- **CPU Usage** - Pourcentage d'utilisation processeur
- **Memory Usage** - Pourcentage d'utilisation RAM
- **Disk Usage** - Pourcentage d'utilisation disque (moyenne)
- **System Uptime** - Temps de fonctionnement système

### Row 2 - Séries temporelles
- **CPU Usage Over Time** - Graphique d'évolution CPU
- **Memory Usage Over Time** - Graphique d'évolution RAM

### Row 3 - Load et Network
- **System Load Average** - Load average 1min, 5min, 15min
- **Network Traffic** - Trafic RX/TX en temps réel

### Row 4 - Disk
- **Disk Usage Trend** - Évolution utilisation disque
- **Disk I/O** - Lecture/écriture par device

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Accès à l'API backend CRM Metrics

### Étapes

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**

   Créer un fichier `.env.local` à la racine du projet :
   ```env
   # URL de l'API backend
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

   # Pour la production:
   # NEXT_PUBLIC_API_BASE_URL=https://api.production.com
   ```

3. **Lancer en développement**
   ```bash
   npm run dev
   ```

4. **Accéder au dashboard**

   Ouvrir [http://localhost:3000](http://localhost:3000)

## 🔐 Authentification

Le dashboard utilise l'authentification JWT :

1. Accéder à [http://localhost:3000/login](http://localhost:3000/login)
2. Saisir email et mot de passe (fournis par l'API backend)
3. Le token JWT est stocké dans `sessionStorage`
4. Redirection automatique vers le dashboard

### Déconnexion

- Cliquer sur le bouton "Logout" en haut à droite
- Le token est supprimé et l'utilisateur est redirigé vers `/login`

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | URL de base de l'API backend | `http://localhost:8000` |

### API Backend

Le dashboard se connecte à une API backend qui expose ces endpoints :

- `POST /api/v1/auth/login/` - Authentification
- `POST /api/v1/auth/refresh/` - Renouvellement token
- `GET /api/v1/metrics/system/snapshot/` - Snapshot système complet
- Support des paramètres `range` (1h, 6h, 24h, 7d) et `step` (15s, 1m, 5m)

Voir la spécification OpenAPI pour plus de détails.

## 🏗️ Architecture

### Stack Technique

- **Framework**: Next.js 16.1.6 avec App Router
- **UI**: React 19.2.3 avec Server Components
- **Styling**: Tailwind CSS v4 avec dark mode
- **Charts**: ECharts 5.5 avec echarts-for-react
- **State**: Zustand pour state management global
- **Validation**: Zod pour validation runtime
- **Icons**: Lucide React
- **Utils**: date-fns pour formatage dates

### Structure du Projet

```
dashboard/
├── app/
│   ├── (auth)/login/          # Page de login
│   ├── (dashboard)/           # Pages dashboard protégées
│   ├── api/
│   │   ├── auth/login/        # Proxy login
│   │   └── metrics/stream/    # SSE endpoint
│   └── globals.css
├── components/
│   ├── auth/                  # LoginForm
│   ├── dashboard/             # MetricCard, MetricHeader, DashboardGrid
│   ├── charts/                # Tous les composants graphiques (6)
│   └── ui/                    # LoadingSpinner, ErrorBoundary, ConnectionStatus
├── lib/
│   ├── api/client.ts          # Client API HTTP avec JWT
│   ├── hooks/                 # useAuth, useSSE, useMetricsStream
│   ├── stores/                # authStore, metricsStore (Zustand)
│   ├── types/                 # Types TypeScript
│   └── utils/                 # formatters, dataWindow, chartTheme
└── middleware.ts              # Middleware Next.js
```

### Flux de Données SSE

```
API Backend (poll toutes les 15s)
    ↓
SSE Route Handler (/api/metrics/stream)
    ↓ (Server-Sent Events)
useMetricsStream Hook
    ↓ (update store)
Zustand metricsStore
    ↓ (subscribe)
DashboardGrid Component
    ↓ (props)
Chart Components (GaugeChart, TimeSeriesChart, etc.)
```

## 🎨 Personnalisation

### Thèmes

Le dashboard supporte automatiquement le dark mode basé sur les préférences système.

Variables CSS personnalisables dans [app/globals.css](app/globals.css) :
```css
:root {
  --chart-primary: #3b82f6;
  --chart-secondary: #8b5cf6;
  --chart-success: #10b981;
  --chart-warning: #f59e0b;
  --chart-danger: #ef4444;
}
```

### Intervalle de mise à jour SSE

Modifier `POLL_INTERVAL` dans [app/api/metrics/stream/route.ts](app/api/metrics/stream/route.ts) :
```typescript
const POLL_INTERVAL = 15000; // 15 secondes
```

### Window de données historiques

Modifier `MAX_HISTORY_POINTS` dans [lib/stores/metricsStore.ts](lib/stores/metricsStore.ts) :
```typescript
const MAX_HISTORY_POINTS = 100; // Nombre de points conservés en mémoire
```

## 🚢 Déploiement

### Build Production

```bash
npm run build
npm start
```

### Déploiement Vercel

Le projet est optimisé pour Vercel (créateurs de Next.js) :

```bash
vercel deploy
```

### Variables d'environnement en production

Configurer dans le dashboard Vercel ou votre plateforme :
- `NEXT_PUBLIC_API_BASE_URL` → URL de votre API en production

### Considérations SSE en production

Pour que SSE fonctionne correctement en production :
- Le serveur doit supporter les connexions HTTP long-lived
- Le reverse proxy (nginx/Apache) ne doit **pas** buffer les réponses SSE
- Timeout configuré > 5 minutes

Exemple de configuration nginx :
```nginx
location /api/metrics/stream {
  proxy_pass http://nextjs_backend;
  proxy_http_version 1.1;
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 24h;
  proxy_set_header Connection '';
}
```

## 🐛 Troubleshooting

### "Connexion SSE échoue"

1. Vérifier que l'API backend est accessible depuis le serveur Next.js
2. Vérifier le token JWT (DevTools → Application → Session Storage)
3. Vérifier les logs du SSE route handler dans la console serveur
4. Si CORS : configurer correctement les headers CORS sur l'API backend

### "Charts ne s'affichent pas"

1. Ouvrir React DevTools et vérifier que le store Zustand contient des données
2. Vérifier la console browser pour erreurs ECharts
3. Vérifier que `history.cpu`, `history.memory`, etc. contiennent des données

### "Reconnexion SSE infinie"

- Le SSE handler vérifie la validité du token à chaque connexion
- Si le token est expiré, se déconnecter et reconnecter pour obtenir un nouveau token
- Vérifier les logs serveur pour voir les erreurs d'authentification

### "Performance lente"

1. Réduire `MAX_HISTORY_POINTS` à 50 au lieu de 100
2. Augmenter `POLL_INTERVAL` à 30 secondes au lieu de 15
3. Désactiver les animations ECharts si nécessaire (modifier `chartTheme.ts`)
4. Utiliser React DevTools Profiler pour identifier les re-renders inutiles

## 📝 Scripts Disponibles

```bash
# Développement (hot reload)
npm run dev

# Build production
npm run build

# Démarrer en mode production
npm start

# Linting
npm run lint
```

## 🔒 Sécurité

- **Token JWT** stocké dans `sessionStorage` (plus sécurisé que `localStorage`)
- **Middleware Next.js** protège les routes dashboard (redirection auto vers `/login`)
- **API calls** passent par Next.js Route Handlers (pas d'appels directs depuis le client)
- **Validation runtime** avec Zod pour toutes les données provenant de l'API
- **Error boundaries** React pour isoler les erreurs et éviter les crashes

## 📚 Documentation Technique

### Composants Clés

- **[DashboardGrid](components/dashboard/DashboardGrid.tsx)** - Composant principal qui orchestre tout
- **[useMetricsStream](lib/hooks/useMetricsStream.ts)** - Hook pour connexion SSE
- **[metricsStore](lib/stores/metricsStore.ts)** - Store Zustand pour métriques
- **[authStore](lib/stores/authStore.ts)** - Store Zustand pour authentification
- **[SSE Route Handler](app/api/metrics/stream/route.ts)** - Endpoint SSE côté serveur

### Ressources Externes

- [Next.js Documentation](https://nextjs.org/docs)
- [ECharts Documentation](https://echarts.apache.org/en/index.html)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Server-Sent Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

## 🤝 Support

Pour des questions ou problèmes :
1. Consulter la section **Troubleshooting** ci-dessus
2. Vérifier les logs :
   - Console browser (F12)
   - Console serveur Next.js (terminal)
3. Vérifier l'état de l'API backend
4. Vérifier la configuration `.env.local`

## 📄 Licence

Proprietary - CRM Metrics Dashboard

---

**Built with ❤️ using Next.js 16, React 19, and ECharts**
