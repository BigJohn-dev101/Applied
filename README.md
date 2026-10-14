# Applied

A job-application tracker built with React, TypeScript and Vite. It keeps a list of the jobs you have applied for, shows how far each one has got, and points out the ones that have gone quiet.

Built as the final project for the ITTHYNK Smart Solutions React Development course (Cohort 2026).

![Applied running in light and dark mode](docs/screenshot.png)

## What it does

Each application holds a company, a job title, an optional link to the advert, the date it was sent, a stage (`Saved`, `Applied`, `Interview`, `Offer` or `Closed`) and optional notes.

- Add an application through a validated form
- Search by company or job title (ignores capital letters)
- Filter by stage; search and filter work together
- See how many applications are at each stage
- Open one to change its stage, edit its notes, or delete it (with a confirmation step)
- A **Needs a nudge** marker appears on anything still at `Applied` more than 14 days after it was sent
- Light and dark theme, remembered between visits
- Loading, error, empty and "no matches" states are all handled, and the last two read differently

There is no backend and no login. Data is saved in the browser's `localStorage`.

## Tools used

| Tool | Used for |
| --- | --- |
| React 19, TypeScript, Vite | The app, its types, the build |
| React Router | Four routes, a layout route, a URL parameter, a 404 |
| React Hook Form | The add form and its validation |
| Context API | The theme |
| Tailwind CSS v4 | Styling, responsive layout, dark mode |
| shadcn/ui | Button, Card, Input, Label, Badge, Textarea |
| Vitest, React Testing Library | Unit tests and a form test |

## Running it locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173. (`npm install` and `npm run dev` work too.)

Other commands:

```bash
pnpm test -- --run   # run the tests once
pnpm build           # type-check and build for production
```

## Project structure

```
src/
  api/          applications.ts          async read/write over localStorage (300 ms delay)
  components/   ApplicationCard, ApplicationDetail, ApplicationList, FieldError,
                FilterBar, Layout, NativeSelect, StageBadge, StageSummary, ThemeToggle
    ui/         shadcn/ui components
  context/      ThemeContext.tsx         ThemeProvider and useTheme
  data/         seed.ts                  sample applications for a first visit
  hooks/        useApplications.ts       list, loading, error, add, update, remove, reload
  lib/          applications.ts          pure functions (daysSince, needsNudge, countByStage, ...)
                stages.ts                stage order and display words
                validation.ts            isValidUrl, isFutureDate
  pages/        ApplicationsPage (/), ApplicationPage (/applications/:id),
                NewApplicationPage (/new), NotFoundPage (*)
  test/         setup.ts
  types.ts      Stage and Application
```

## How it works

- **State lives in the right place.** The search text and stage filter are `useState` in `ApplicationsPage`, the nearest parent of both the filter bar and the list. `FilterBar` holds no state of its own.
- **Anything that can be calculated is not stored.** The stage counts, the filtered list, "days ago" and "needs a nudge" are all worked out while rendering. Storing them would create a second version of the truth.
- **The nudge rule is a pure function.** `needsNudge(application, today)` takes the date as a parameter, so the 14-day boundary can be tested without waiting. Exactly 14 days is not a nudge; 15 is.
- **The data layer hides where data lives.** `api/applications.ts` exposes four async functions. Nothing above it knows it is `localStorage`, so replacing it with a real backend would change that one file.
- **`useApplications` loads once on mount** with `useEffect`, and refreshes the list after every write so the screen never disagrees with what is stored.
- **Components only draw.** They receive data as props and never save or delete directly.
- **Stage is never shown by colour alone.** Every badge carries its word.
- The `wishlist` stage value is displayed as **Saved**.

## Tests

24 tests in 3 files:

- `needsNudge` at its boundary (14 days is not a nudge, 15 is), for every stage
- `countByStage`, `daysSince`, `formatDaysAgo`, `toISODate`
- `isValidUrl` and `isFutureDate`
- The add form: submitting it empty shows an error under each required field, linked to its input, and fixing a field clears only that error. Elements are found by role and label, never by test id.

## Accessibility

Every input has a real label. Errors use `role="alert"` and are linked to their field with `aria-invalid` and `aria-describedby`. The whole app can be used from the keyboard with visible focus, and the first broken field gets focus on a failed submit. Lighthouse Accessibility was run in both themes.

## Differences from the brief

- `ApplicationDetail.tsx` is a separate component so the notes box can start from the saved notes without copying props into state in an effect.
- Native `<select>` elements (wrapped in `NativeSelect`) are used instead of shadcn's Radix `Select`, because they work directly with React Hook Form's `register`.
- `stages.ts`, `validation.ts`, `FieldError.tsx` and `Layout.tsx` were added to avoid repeating stage labels, validation rules and markup.

## Performance note

[Replace this line with one sentence about what re-rendered when you typed in the search box, from the React DevTools Profiler.]

## What I would do next

[Edit this to your own words. Suggestions: replace the hand-written data hook with TanStack Query and count the lines removed; move the form rules into a Zod schema; make stage changes optimistic with a rollback; add an activity log per application with `useReducer`; add a Playwright test and CI.]