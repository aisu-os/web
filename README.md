# Aisu Web — Frontend

The frontend of Aisu Web OS. A macOS-style browser OS with windows, dock, file system, and applications — delivering a full desktop experience.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Strict mode, `verbatimModuleSyntax` enabled |
| Vite | 7.2 | Build tool with SWC-based Fast Refresh |
| Tailwind CSS | 4.1 | Styling via `@tailwindcss/vite` plugin |
| Zustand | 5.0 | State management |
| Framer Motion | 12.33 | Animations |
| xterm.js | 6.0 | Terminal emulator |
| Sentry | 10.40 | Error tracking |

## Getting Started

```bash
# Install dependencies (bun, not npm!)
bun install

# Configure environment
cp .env.example .env

# Start development server (http://localhost:5173)
bun dev
```

### Commands

```bash
bun dev          # Development server (Vite HMR)
bun run build    # TypeScript check + Vite production build
bun run lint     # ESLint
bun run preview  # Preview production build locally
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BASE_URL` | Backend API URL | `http://localhost:8890` |

## Architecture

### Application Flow

```
main.tsx → App.tsx → Selects screen based on AuthPhase:

  booting        → BootScreen (boot animation)
  setup          → SetupScreen (registration wizard)
  login          → LoginScreen
  loading        → Loading spinner
  authenticated  → Desktop (main OS interface)
```

### Layer Diagram

```
UI (shell/, apps/)  →  Stores (stores/)  →  Services (services/api/)  →  Backend API
```

### Directory Structure

```
src/
├── shell/              # OS chrome (system UI layer)
│   ├── boot/           #   Boot animation screen
│   ├── login/          #   Login screen
│   ├── setup/          #   Registration wizard
│   ├── desktop/        #   Desktop layout (TopBar + Dock + Windows)
│   ├── window/         #   Window component (drag, resize, traffic lights)
│   ├── taskbar/        #   System bar (clock, battery, notifications)
│   ├── dock/           #   Application dock
│   └── notifications/  #   Notification center
│
├── apps/               # System applications
│   ├── _registry.ts    #   App registry (lazy-loaded components)
│   ├── _app-config.ts  #   createAppConfig() factory
│   ├── file-manager/   #   File Manager
│   ├── ai-chat/        #   AI Chat
│   ├── terminal/       #   Terminal (xterm.js)
│   ├── settings/       #   Settings
│   ├── text-editor/    #   Text Editor
│   ├── image-viewer/   #   Image Viewer
│   ├── app-market/     #   App Market
│   ├── trash/          #   Trash Bin
│   └── port-forward/   #   Port Forwarding
│
├── stores/             # Zustand stores (NO barrel exports)
│   ├── use-window-store.ts      # Window state, z-index, focus
│   ├── use-process-store.ts     # Process lifecycle
│   ├── use-auth-store.ts        # Authentication phases
│   ├── use-desktop-store.ts     # Desktop icons, context menu
│   ├── use-file-system-store.ts # Virtual file tree
│   ├── use-theme-store.ts       # Theme, wallpaper, accent color
│   ├── use-menubar-store.ts     # Menu bar state
│   ├── use-cursor-store.ts      # Custom cursor
│   ├── use-notification-store.ts# Notifications
│   └── use-drag-drop-store.ts   # Drag & drop
│
├── services/           # API and external services
│   ├── api/client.ts   #   Central fetch wrapper (JWT, error handling)
│   ├── api/            #   Endpoint-specific services
│   └── websocket/      #   WebSocket connections
│
├── types/              # Global TypeScript types (barrel exported)
├── hooks/              # Shared custom hooks
├── components/         # Shared components
├── cursor/             # macOS-style custom cursor system
├── avatar/             # 3D VRM avatar system
├── lib/                # Utility functions (cn.ts)
├── constants/          # Constants (API URL)
└── styles/             # Global styles
```

## App System

Each application lives in its own directory under `apps/`:

```
apps/file-manager/
├── FileManager.tsx     # Root component
├── config.ts           # App manifest (via createAppConfig)
├── components/         # Internal components
├── hooks/              # Internal hooks
└── types.ts            # App-specific types (optional)
```

### Adding a New App

1. Create the `apps/{app-name}/` directory with the structure above.

2. Define the manifest in `config.ts`:

```typescript
import { createAppConfig } from '../_app-config'

export const myAppConfig = createAppConfig({
  id: 'my-app',
  name: 'My App',
  icon: '/icons/my-app.png',
  window: { width: 800, height: 600, minWidth: 400, minHeight: 300 },
})
```

3. Register in `_registry.ts`:

```typescript
import { myAppConfig } from './my-app/config'

export const appRegistry = {
  // ...existing apps
  'my-app': {
    config: myAppConfig,
    component: lazy(() => import('./my-app/MyApp')),
  },
}
```

## Conventions

| Rule | Example |
|------|---------|
| Directories & non-React files | `kebab-case` — `file-manager/`, `use-window-store.ts` |
| React component files | `PascalCase.tsx` — `Window.tsx`, `FileManager.tsx` |
| Type imports | `import type { WindowState } from '@/types'` (required) |
| Path alias | Use `@/...` instead of relative `../../../` |
| Class names | `cn()` utility (`clsx` + `tailwind-merge`) |
| Store imports | Direct: `import { useWindowStore } from '@/stores/use-window-store'` |
| Fonts | Quicksand (primary), Nunito (secondary) via Google Fonts |

## Deployment

Deployed via Cloudflare Workers. Configuration in `wrangler.jsonc`.

```bash
# Production build
bun run build

# Deploy (requires wrangler)
bunx wrangler deploy
```
