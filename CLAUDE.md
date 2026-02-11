# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Loyiha

Aisu Web OS ning frontend qismi. macOS-uslubidagi brauzer OS — oynalar, dock, fayl tizimi, ilovalar bilan to'liq desktop tajriba. Ota loyihadagi `CLAUDE.md` da umumiy arxitektura va backend hujjatlari mavjud.

## Buyruqlar

`npm` emas, **`bun`** ishlatiladi.

```bash
bun dev          # Development server (Vite HMR)
bun run build    # TypeScript tekshiruvi (tsc -b) + Vite build
bun run lint     # ESLint
bun run preview  # Build natijasini ko'rish
bun install      # Dependency o'rnatish
```

Deploy: Cloudflare Workers (`wrangler.jsonc`).

## Muhit o'zgaruvchilari

```
VITE_BASE_URL=http://localhost:8890   # Backend API manzili
```

## Arxitektura

### App oqimi

`main.tsx` → `App.tsx` → `AuthPhase` asosida ekran tanlaydi:
- `booting` → `BootScreen` (animatsiya)
- `setup` → `SetupScreen` (ro'yxatdan o'tish wizard)
- `login` → `LoginScreen`
- `loading` → yuklanish
- `authenticated` → `Desktop` (asosiy OS interfeys)

### Qatlamlar

```
UI (shell/, apps/) → Stores (stores/) → Services (services/api/) → Backend API
```

### API integratsiya

`services/api/client.ts` — markaziy fetch wrapper:
- `apiGet<T>()`, `apiPost<T>()`, `apiPatch<T>()`, `apiPostFormData<T>()`
- Token xotirada saqlanadi (refresh da yo'qoladi), `getToken()`/`setToken()`/`clearToken()`
- `ApiError` class — status kodi va detail bilan
- Barcha endpoint'lar `/api/v1` prefiksi bilan
- API response snake_case, frontend camelCase — DTO mapping `services/api/` ichida

### Store pattern

Zustand store'lar `create()` bilan. Cross-store murojaat `useOtherStore.getState()` orqali:

```typescript
// use-auth-store.ts ichidan theme store'ga murojaat
useThemeStore.getState().setWallpaper(result.wallpaper)
```

File system store'da **optimistic update** pattern: avval UI yangilanadi, keyin background'da API chaqiriladi. Xato bo'lsa `syncError` o'rnatiladi.

### Ilova tizimi

Har bir ilova `apps/{ilova-nomi}/` papkasida:
- `{IlovaNomi}.tsx` — root komponent
- `config.ts` — `createAppConfig()` bilan manifest (id, title, icon, window o'lchami, menuBar)
- `components/`, `hooks/` — ichki kod

Ro'yxatga olish: `_registry.ts` da config import + `lazy()` bilan component. `appRegistry` record'i `shell/` tomonidan ishlatiladi.

### Oyna boshqaruvi

`use-window-store` va `use-process-store` birgalikda ishlaydi:
- `spawnProcess()` → `openWindow()` — ilova ochilganda jarayon ham yaratiladi
- `closeWindow()` → `killProcess()` — oyna yopilganda jarayon o'ldiriladi
- `Window.tsx` — drag (titlebar), resize (8 yo'nalish), traffic light tugmalar, z-index boshqaruv

### Fayl tizimi

`use-file-system-store` — eng murakkab store. `root` (FileNode daraxti) va `nodeMap` (Map<path, node>) bilan ishlaydi. API muvaffaqiyatsiz bo'lsa `MOCK_FILE_SYSTEM` ga fallback qiladi. Trash (axlat qutisi) ham shu store ichida boshqariladi.

## Konvensiyalar

- **`bun`** ishlatish, `npm` emas
- Papkalar/fayllar: `kebab-case`, React komponentlar: `PascalCase.tsx`
- `import type { ... }` majburiy (`verbatimModuleSyntax`)
- `@/...` path alias ishlatish (relativ `../../../` emas)
- `cn()` (`lib/cn.ts`) — className birlashtirish uchun
- Store'lar alohida import: `import { useWindowStore } from '@/stores/use-window-store'` (barrel export yo'q)
- Faqat bitta ilova ishlatadigan tiplar ilova ichidagi `types.ts` da, global tiplar `types/` papkasida
- Shriftlar: Quicksand (asosiy), Nunito (qo'shimcha) — Google Fonts orqali yuklangan
