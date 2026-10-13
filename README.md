# Applied

A job-application tracker built with **React + TypeScript + Vite**. One small web app to keep track of every job you have applied for: what, where, when, and how far it has got.

> ITTHYNK Smart Solutions · Cohort 2026 · React Development: Beginner to Professional
> Solo project. No backend, no auth, no payments. Data lives in the browser's `localStorage`.

---

## 1. What the app does

Each job (an **application**) holds: company, job title, optional advert link, date sent, stage, optional notes.

You can:

- Add a job through a validated form
- Search by company or job title (case-insensitive)
- Filter by stage (search and filter work **together**)
- Open a job to read it, edit notes, change its stage, or delete it (with confirmation)
- See a count per stage across the top
- See which jobs **need a nudge** (still `applied` more than 14 days after sending)
- Switch light/dark theme (remembered after closing the tab)

### The one rule that shapes the build

```
needsNudge = stage === "applied" && daysSince(dateSent) > 14
```

This is a **derived value**. It is calculated every time, **never stored**. The same goes for the stage counts and the filtered list. If it can be calculated from existing state, it is not state.

Exactly 14 days is **not** a nudge. 15 days is.

---

## 2. Tech stack

| Tool | Purpose |
| --- | --- |
| React 19 + TypeScript + Vite | App, types, build tool |
| React Router | 4 routes, layout route, URL params, 404 |
| Context API | Theme (`ThemeProvider` + `useTheme`) |
| Tailwind CSS v4 (Vite plugin) | Styling, responsive grid, dark mode |
| shadcn/ui (`-b radix`) | button, card, input, label, badge, select |
| React Hook Form | Add form with rules and accessible errors |
| Vitest + React Testing Library + user-event + jest-dom + jsdom | Tests |

Stretch only (not in the main build): Supabase, TanStack Query, Zod, Zustand, useReducer, optimistic updates, Playwright + GitHub Actions.

---

## 3. Data model (`src/types.ts`)

```ts
export type Stage = "wishlist" | "applied" | "interview" | "offer" | "closed";

export interface Application {
  id: string;          // crypto.randomUUID()
  company: string;     // required, min 2 chars
  role: string;        // required, min 2 chars
  link?: string;       // optional, must be a valid URL if given
  dateSent: string;    // YYYY-MM-DD, required, never in the future
  stage: Stage;        // defaults to the first stage ("wishlist")
  notes?: string;      // optional
  createdAt: string;   // ISO timestamp, set once, used to sort (newest first)
}
```

`Stage` is always a union, never a plain `string`.

> **Brief inconsistency to note:** the data table says the stage is `"wishlist"` while the screens and prose call it "Saved". We keep `"wishlist"` as the value in code and may show the label **Saved** in the UI. Worth confirming with the mentor.

---

## 4. Routes and pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `ApplicationsPage` | List, stage counts, search, stage filter |
| `/applications/:id` | `ApplicationPage` | One job: change stage, edit notes, delete |
| `/new` | `NewApplicationPage` | Add form |
| `*` | `NotFoundPage` | 404 with same header and theme |

All routes sit inside a **layout route** that renders the header and an `<Outlet />`, so the header does not remount on navigation.

### `/` ApplicationsPage

Must handle: **loading** (skeletons or "Loading"), **error** (readable message), **empty** (nothing saved, with an add button), **no matches** (filters returned nothing, with a clear-filters button; must read differently from empty).

- Owns `search` and `stage` state (`useState` x2), lifted up and passed to `FilterBar`
- Counts come from `countByStage(allApplications)`, so they ignore the filters
- Filtered list is derived while rendering, not stored
- Sorted newest first by `createdAt`

### `/applications/:id` ApplicationPage

- Reads `id` with `useParams`
- Shows company, role, stage, date sent, days ago, nudge marker, advert link (new tab), notes
- Actions: change stage (saves, nudge disappears if not `applied`), save notes (button disabled while saving), delete (two-step confirm, then back to list)
- Unknown id: "we could not find that application" plus link back to list
- Survives refresh (id is in the URL)

### `/new` NewApplicationPage

- `useForm` with `defaultValues` (stage starts on the first stage)
- `useRef` focuses the first field on open (required technique)
- On submit with errors: messages under each broken field, first broken field gets focus
- On success: `add()`, then `navigate("/")`
- Save button disabled while `isSubmitting` (no double create)
- Cancel goes back without saving or asking

| Field | Required | Rule / message |
| --- | --- | --- |
| Company | Yes | min 2 chars, "Company is required" |
| Job title | Yes | min 2 chars, "Job title is required" |
| Link | No | valid URL, "That does not look like a link" |
| Date sent | Yes | not in the future, "You cannot have sent it tomorrow" |
| Stage | Yes | one of the five |
| Notes | No | free text |

Accessibility on the form: real `<label htmlFor>`, `role="alert"` on errors, `aria-invalid` and `aria-describedby` on inputs, full keyboard use, Enter submits.

### `*` NotFoundPage

"That page does not exist", with a button back to `/`.

---

## 5. Folder structure

```
applied/
├── src/
│   ├── api/
│   │   └── applications.ts        # async read/write over localStorage (300ms delay)
│   ├── components/
│   │   ├── ApplicationCard.tsx    # one job card
│   │   ├── ApplicationList.tsx    # maps applications to cards
│   │   ├── StageBadge.tsx         # colour AND the word
│   │   ├── StageSummary.tsx       # counts row
│   │   ├── FilterBar.tsx          # search box + stage dropdown
│   │   ├── ThemeToggle.tsx        # light/dark switch
│   │   └── ui/                    # shadcn/ui components (button, card, input, label, badge, select)
│   ├── context/
│   │   └── ThemeContext.tsx       # ThemeProvider + useTheme
│   ├── data/
│   │   └── seed.ts                # 7 sample applications (Application[])
│   ├── hooks/
│   │   └── useApplications.ts     # list, loading, error, add, update, remove, reload
│   ├── lib/
│   │   ├── applications.ts        # PURE functions, no React
│   │   └── applications.test.ts
│   ├── pages/
│   │   ├── ApplicationsPage.tsx   # /
│   │   ├── ApplicationPage.tsx    # /applications/:id
│   │   ├── NewApplicationPage.tsx # /new
│   │   └── NotFoundPage.tsx       # *
│   ├── types.ts                   # Stage, Application
│   ├── App.tsx                    # routes
│   └── main.tsx                   # providers
├── package.json
└── README.md
```

Additions not in the brief's tree but required by it: `src/data/seed.ts` (Step 01) and a layout component for the header (e.g. `components/Layout.tsx` or `Header.tsx`) to host the `<Outlet />`. Any deviation should be explainable.

---

## 6. Components

| Component | Props | State | Notes |
| --- | --- | --- | --- |
| `ApplicationCard` | `application` | none | Calculates `daysSince` and `needsNudge` while rendering; links to `/applications/:id`; uses `<article>` |
| `ApplicationList` | `applications` | none | `.map()` with `key={application.id}` |
| `StageBadge` | `stage` | none | Colour **and** word (never colour alone) |
| `StageSummary` | `counts: Record<Stage, number>` | none | Counts row |
| `FilterBar` | `search`, `onSearchChange`, `stage`, `onStageChange` | none (controlled) | Search input and stage select, both with labels |
| `ThemeToggle` | none | reads `useTheme()` | Toggles light/dark |
| Header / Layout | none | none | App name, `ThemeToggle`, "Add application" button, `<Outlet />` |
| Empty / no-match / error / loading views | message and action props | none | Small reusable pieces so the two "nothing to show" states stay distinct |

Rule of thumb: components **draw what they are given**. They never save, delete or change data directly. Pages and hooks do that.

### Reusable pieces

- `StageBadge`: used on the card and the detail page
- `ui/*` (shadcn): `Button`, `Card`, `Input`, `Label`, `Badge`, `Select` used across all pages
- A shared form-field wrapper (label + input + error with `role="alert"`) if the form gets repetitive
- A shared "nudge marker" and "days ago" display used on both the card and the detail page

---

## 7. Hooks

### Built-in hooks and where they are used

| Hook | Where | Why |
| --- | --- | --- |
| `useState` | `ApplicationsPage` (`search`, `stage`); `useApplications` (list, loading, error); delete-confirm toggle on `ApplicationPage`; notes text on `ApplicationPage`; `ThemeProvider` theme | Values that change what you see |
| `useEffect` | `useApplications` (load once on mount, `[]`); `ThemeProvider` (put/remove `dark` class on `<html>`, save to localStorage) | Talking to things outside React |
| `useRef` | `NewApplicationPage` | Focus first field when the form opens |
| `useParams` | `ApplicationPage` | Read `:id` |
| `useNavigate` | `NewApplicationPage`, `ApplicationPage` | Go back to list after save/delete |

**Not state** (derived while rendering): stage counts, filtered list, days since, needs-nudge.

### Custom hooks

**`useApplications()`** in `src/hooks/useApplications.ts`

```ts
const { applications, loading, error, add, update, remove, reload } = useApplications();
```

- `useState` for `applications`, `loading`, `error`
- `useEffect` loads once on mount
- After every write: call the API, then refresh the list, so screen and storage never disagree
- Should be generic-friendly and fully typed

**`useTheme()`** in `src/context/ThemeContext.tsx`: returns `{ theme, toggleTheme }` from context; throws a clear error if used outside the provider.

---

## 8. Pure functions (`src/lib/applications.ts`)

No React imports in this file.

```ts
daysSince(dateSent: string, today?: Date): number
needsNudge(application: Application, today?: Date): boolean
countByStage(applications: Application[]): Record<Stage, number>
```

The optional `today` makes the 14-day boundary testable with a fixed date.

---

## 9. Data layer (`src/api/applications.ts`)

Four async functions over `localStorage` with a deliberate **300 ms delay** so loading states are real:

```ts
fetchApplications(): Promise<Application[]>
createApplication(input: NewApplication): Promise<Application>
updateApplication(id: string, changes: Partial<Application>): Promise<Application>
deleteApplication(id: string): Promise<void>
```

- Seeds `localStorage` from `seed.ts` the first time the app runs
- Nothing above this file knows it is `localStorage`, so swapping to a real backend later means changing this one file only
- Every button is disabled while a write is in flight

---

## 10. Build plan (commit after each step)

| Step | What | Done when |
| --- | --- | --- |
| 01 | `types.ts`, `seed.ts` (7 apps, 2+ `applied` older than 14 days), `StageBadge`, `ApplicationCard`, `ApplicationList`, render with `.map()` | 7 cards on screen, clean console |
| 02 | React Router, 4 routes, layout route with `<Outlet />`, `useParams`, unknown id handling | All routes load, deep link survives refresh |
| 03 | Pure functions, `search`/`stage` state in `ApplicationsPage`, `FilterBar`, `StageSummary`, nudge marker | Filters work together, nothing derived in state |
| 04 | API file, `useApplications`, loading/error handling, seeding, disabled buttons | Data survives refresh, loading is visible |
| 05 | React Hook Form add form, validation, a11y, `useRef` focus | Empty submit shows all errors, future date refused |
| 06 | Tailwind v4, shadcn/ui, responsive grid, `ThemeProvider`, dark mode | Both themes readable, no overflow at 375 px |
| 07 | Vitest tests, RTL form test, keyboard pass, Lighthouse a11y | `npm test -- --run` green (3+ tests), full tab-through works |
| 08 | Remove dead code, Profiler note, README with screenshot, fresh-clone check | Someone else can clone, install, run |

---

## 11. Required checklist (Definition of done)

- [ ] Public GitHub repo with commits spread across the build
- [ ] TypeScript throughout, no unjustified `any`
- [ ] `Stage` is a union type
- [ ] All four pages exist, including the 404
- [ ] Deep link to one application survives refresh
- [ ] Add, open, change stage, edit notes, delete all work
- [ ] Data survives refresh
- [ ] Stage filter and search work together
- [ ] Stage counts derived, never stored
- [ ] `needsNudge` is pure and tested at the boundary (14 = no, 15 = yes)
- [ ] Form validates every rule with accessible errors
- [ ] Loading, error, empty and no-matches states handled; last two differ
- [ ] Buttons disable while a save is in flight
- [ ] Works at 375 px with no horizontal scroll
- [ ] Dark mode works, is remembered, readable in both themes
- [ ] Stage shown by colour **and** word
- [ ] Every control keyboard-reachable with visible focus
- [ ] At least 3 tests pass
- [ ] Fresh clone runs with `npm install` and `npm run dev`
- [ ] README has screenshot, tools used, how to run, one Profiler note

Required techniques: components/props/keys, `useState`, derived state, lifting state up, `useEffect`, custom hook, `useRef`, TS interfaces and unions, routing with params + layout + 404, Context, Tailwind, shadcn/ui, React Hook Form, accessibility, Profiler, Vitest + one RTL test.

---
