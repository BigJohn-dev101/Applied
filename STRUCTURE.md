# Folder Structure

```
Applied/
├── backend/
├── public/
├── src/
│   ├── api/
│   │   └── applications.ts
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── textarea.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationDetail.tsx
│   │   ├── ApplicationList.tsx
│   │   ├── FieldError.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Layout.tsx
│   │   ├── NativeSelect.tsx
│   │   ├── StageBadge.tsx
│   │   ├── StageSummary.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   └── seed.ts
│   ├── hooks/
│   │   └── useApplications.ts
│   ├── lib/
│   │   ├── applications.ts
│   │   ├── stages.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── ApplicationPage.tsx
│   │   ├── ApplicationsPage.tsx
│   │   ├── NewApplicationPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── PROJECT-OVERVIEW.md
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# Project Context

Applied is a job-application tracker (React 19 + Vite + TypeScript, React Router, Tailwind v4 + shadcn/ui, react-hook-form). There is no backend yet: data lives in the browser's `localStorage` behind a fake async API, so swapping in the real Express/Prisma backend only touches `src/api/applications.ts`.

## Data model

Defined in `src/types.ts`:

- `Stage`: `"wishlist" | "applied" | "interview" | "offer" | "closed"`
- `Application`: `id`, `company`, `role`, `link?`, `dateSent` (`YYYY-MM-DD`), `stage`, `notes?`, `createdAt` (ISO timestamp)
- `NewApplication`: `Application` without `id` and `createdAt` (the "API" generates those)
- `StageFilter`: `Stage | "all"`, used by the filter bar

## Data flow

```
Page / component
      │  calls
      ▼
useApplications()  (src/hooks/useApplications.ts)
      │  calls
      ▼
src/api/applications.ts  ──►  localStorage["applied.applications"]
                               (seeded from src/data/seed.ts on first run)
```

### Fetch
- `fetchApplications()` waits 300ms (simulated latency), then reads and parses `localStorage`. On first run the key is missing, so it writes `seedApplications` and returns them.
- `useApplications()` calls it on mount and exposes `{ applications, loading, error, add, update, remove, reload }`. An `ignore` flag in the effect stops state updates after unmount.

### Add
- `NewApplicationPage` collects form values with react-hook-form, trims them, converts empty optional strings to `undefined`, then calls `add(input)`.
- `createApplication()` adds `id` (`crypto.randomUUID()`) and `createdAt`, prepends it to the stored list, and returns it. The hook then calls `reload()` and the page navigates to `/`.

### Update
- `ApplicationDetail` calls `onUpdate({ stage })` or `onUpdate({ notes })`. `ApplicationPage` wires that to `update(id, changes)`.
- `updateApplication()` merges the changes into the existing record (`id` and `createdAt` are never overwritten) and throws if the id is not found.

### Delete
- `ApplicationDetail` asks for confirmation, then calls `onDelete()` which maps to `remove(id)` and `deleteApplication(id)`.

### Display
- `ApplicationsPage` gets the list from the hook, sorts it newest first by `createdAt`, computes stage counts, and applies the search (company/role) and stage filters in memory. It renders loading, error (with retry), empty, no-match and list states.
- `ApplicationPage` finds one application by the `:id` route param from the same hook's list. There is no single-item fetch.
- Every hook-using component has its own state, so each mutation re-fetches (`reload()`) rather than sharing a cache.

## What each file does

### Root
| File | Purpose |
| --- | --- |
| `index.html` | Vite entry HTML |
| `vite.config.ts` | Vite config (React plugin, Tailwind plugin, `@` alias, Vitest) |
| `components.json` | shadcn/ui config |
| `eslint.config.js` | Lint rules |
| `tsconfig*.json` | TypeScript configs (app, node, root references) |
| `PROJECT-OVERVIEW.md`, `README.md` | Project docs |
| `.env` | Environment variables |

### `src/`
| File | Purpose |
| --- | --- |
| `main.tsx` | App bootstrap: mounts React, router and `ThemeProvider` |
| `App.tsx` | Route table (`/`, `/applications/:id`, `/new`, `*`) inside `Layout`, plus the 3s startup loader overlay |
| `index.css` | Tailwind import, theme tokens, loader animations |
| `types.ts` | Shared types (see Data model) |

### `src/api/`
| File | Purpose |
| --- | --- |
| `applications.ts` | Fake backend: `fetchApplications`, `createApplication`, `updateApplication`, `deleteApplication` over `localStorage` with a 300ms delay. This is the file to replace with real `fetch` calls to the Express API. |

### `src/data/`
| File | Purpose |
| --- | --- |
| `seed.ts` | Sample applications written to `localStorage` on first load |

### `src/hooks/`
| File | Purpose |
| --- | --- |
| `useApplications.ts` | Loads applications and exposes `add`, `update`, `remove`, `reload` plus `loading` and `error` state |

### `src/context/`
| File | Purpose |
| --- | --- |
| `ThemeContext.tsx` | Light/dark theme provider. Persists to `localStorage["applied.theme"]`, defaults to the OS preference, toggles the `dark` class on `<html>` |

### `src/lib/`
| File | Purpose |
| --- | --- |
| `applications.ts` | Pure helpers: `daysSince`, `needsNudge` (applied for more than 14 days), `formatDaysAgo`, `countByStage`, `toISODate` |
| `stages.ts` | `STAGES` order, `STAGE_LABELS` display names, `STAGE_ACCENT` colour classes |
| `validation.ts` | `isValidUrl` (http/https only), `isFutureDate` |
| `utils.ts` | shadcn `cn()` class-name helper |

### `src/pages/` (one per route)
| File | Route | Purpose |
| --- | --- | --- |
| `ApplicationsPage.tsx` | `/` | Summary, search and filter, list |
| `ApplicationPage.tsx` | `/applications/:id` | Loads one application, renders `ApplicationDetail` |
| `NewApplicationPage.tsx` | `/new` | Create form with validation |
| `NotFoundPage.tsx` | `*` | 404 page |

### `src/components/`
| File | Purpose |
| --- | --- |
| `Layout.tsx` | Sticky header (logo, theme toggle, "Add application"), `<Outlet />` for the page, footer |
| `ApplicationList.tsx` | Grid of `ApplicationCard`s |
| `ApplicationCard.tsx` | Summary card for one application, links to its detail page |
| `ApplicationDetail.tsx` | Detail view: change stage, edit notes, delete with confirmation, nudge when a follow-up is due |
| `FilterBar.tsx` | Search input and stage select (controlled by `ApplicationsPage`) |
| `StageSummary.tsx` | Per-stage counts |
| `StageBadge.tsx` | Coloured stage label |
| `NativeSelect.tsx` | Styled native `<select>` |
| `FieldError.tsx` | Form field error message |
| `ThemeToggle.tsx` | Light/dark button using `ThemeContext` |
| `ui/*` | shadcn/ui primitives: `badge`, `button`, `card`, `input`, `label`, `textarea` |

### `src/test/`
| File | Purpose |
| --- | --- |
| `setup.ts` | Vitest setup (jest-dom matchers) |

## Moving to the real backend

1. Keep the function names and signatures in `src/api/applications.ts` and replace their bodies with `fetch` calls to the Express API (`GET/POST /applications`, `PATCH/DELETE /applications/:id`).
2. The server should generate `id` and `createdAt`, matching the `Application` type.
3. Remove `seed.ts` and the `localStorage` logic once the database is the source of truth.
4. Hooks, pages and components should not need to change.
