# GitHub Repo Searcher — Technical Task by Rosa Haro (August 2025)

A responsive web application built with **React + TypeScript** to search GitHub users and explore their repositories, and filter them by name and language.
It was developed as a technical assignment with focus on **clean architecture, scalability, accessibility, and developer best practices**.

---

## 📑 Table of Contents
- [📸 Preview](#-preview)  
- [✨ Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [🏗 Architecture & Design Decisions](#-architecture--design-decisions)  
- [🔗 API Layer](#-api-layer)  
- [♿ Accessibility](#-accessibility)  
- [🧪 Testing Strategy](#-testing-strategy)
- [📚 Storybook](#-storybook)
- [🎨 UI & Styling](#-ui--styling)  
- [🚀 Getting Started](#-getting-started)  
- [🔄 Development Workflow](#-development-workflow)  
- [📈 Future Improvements](#-future-improvements)  
- [📝 Personal Process Log](#-personal-process-log)  
- [📌 Notes](#-notes)  

---

## 📸 Preview

*Screenshots and demo video to be added here*
- Desktop: Home + UserPage
- Mobile: Home + UserPage
- Short gif showing the flow: search user → view profile → filter repos

---

## ✨ Features

### Core functionality
- **User search with suggestions**  
  - Powered by GitHub’s Search API.  
  - Suggestions dropdown opens when typing ≥ 2 characters.  
  - Keyboard navigation: ↑/↓ to move, Enter to select, Escape to close.  
  - Accessible combobox/listbox pattern with ARIA roles.  
  - Empty state in dropdown: “No results”.

- **User profile**  
  - Avatar, name, login, bio, followers/following, location.  
  - Nlog link normalized (`https://` added if missing).  
  - Responsive layout: larger avatar and centered layout on desktop.  

- **Repository list**  
  - Card layout with name, description, language (colored badge mimicking GitHub's interface), stars, forks, and last updated.  
  - Clickable cards linking directly to GitHub repos.  
  - **Filtering**:  
    - By name (applied on form submit, not on every keystroke).  
    - By language (select dynamically populated from dataset).  
    - Combinable filters (text + language).  
  - **Reset filters** button clears both text and language; disabled if no filters are active.  
  - Local pagination: “Show more” button reveals additional repos in steps of 12.  
  - Empty state when no repositories match the filters.

### UI/UX & accessibility
- **UI states**: Loader (`role="status"`), Error (`role="alert"`), Empty states reused across pages.  
- **Responsive design**: Optimized for both desktop and mobile.  
- **Clean and consistent design system**: built with TailwindCSS v4 tokens (colors, typography, etc.).  
- **Accessibility-first**: semantic roles, keyboard navigation, focus-visible styles. 

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript 5 + Vite 5
- **Styling**: TailwindCSS v4 with custom tokens  
- **API**: GitHub REST API v3  
- **Routing**: React Router v6  
- **Testing**: Vitest, React Testing Library, MSW (Mock Service Worker)  
- **Icons**: Custom SVGs imported as React components  
- **Loader**: `react-spinners` (ClipLoader)  

### Why Vite?
I chose **Vite** because it offers a much faster developer experience compared to traditional React tooling. Instant dev server startup, HMR, and an optimized build process let me iterate quickly during this technical task.

### Why Tailwind?
I used **TailwindCSS v4** because it enables consistent styling with design tokens, keeps CSS co-located with components, and speeds up prototyping while maintaining a clean, modern design. It also avoids context switching between CSS files and TSX.

---

## 🏗 Architecture & Design Decisions

The application is designed for **maintainability and scalability**:

- **Separation of concerns**  
  - `core/api`: GitHub API helpers (`fetchUserData`, `fetchUserRepos`, `fetchAllUserRepos`).  
  - `core/utils`: reusable utilities (`timeAgo`, `normalizeUrl`, `languageColors`).  
  - `components`: small, focused, presentational components.  
  - `pages`: high-level containers (HomePage, UserPage).  
  - `layouts`: reusable layout (HeaderLayout with navigation).  

- **Local state instead of global state**  
  - I initially considered Redux, as I have experience with it, but for this scope it would be over-engineering.  
  - Local state and URL params are sufficient.  
  - Simpler, easier to follow, and lighter codebase.  
  - If requirements grow (e.g., persisted filters, recent searches, caching), adding Redux Toolkit or React Query would be straightforward.  

- **Component per folder**  
  - Each component lives in its own folder (even if today it has only one file).  
  - Makes imports stable and predictable.  

- **Error handling contract**  
  - `fetchUserData`: returns user or null (404), throws error otherwise.  
  - `fetchUserRepos`: returns `{ data, hasNextPage }`, empty array on error.  
  - `fetchAllUserRepos`: loops through pages until all repos are loaded.  
  - `searchUserFetch`: returns suggestions or empty array.  
  - `AbortError` is treated as a benign cancellation.  

### Additional rationale

- **Why Testing Library + MSW**  
  I wanted tests that validate accessibility and real behavior, not just implementation details.  
  Using React Testing Library enforces queries by role/label, and MSW lets me mock the GitHub API as if it were real, including error and empty states.  

- **Why AbortController**  
  Canceling in-flight requests prevents inconsistent UI states (e.g., showing old results after navigating away).  
  It’s a small detail, but it makes the app feel more stable.  

- **Why component-per-folder structure**  
  This structure scales naturally: it makes it easy to co-locate stories, tests, and styles next to each component if desired.  

- **Why local state + URL params**  
  Using local state keeps the code simple and lightweight.  
  URL parameters (like `:username`) act as the single source of truth, so the UI is always in sync with navigation.  

---

## 🔗 API Layer

- **Endpoints**  
  - `GET /search/users?q=<query>` → user suggestions  
  - `GET /users/:username` → user profile  
  - `GET /users/:username/repos?per_page=100&sort=updated` → repositories  

- **Example responses**  
  - User:
    ```json
    {
      "login": "rosa-haro",
      "avatar_url": "https://example.com/avatar.png",
      "name": "Rosa",
      "followers": 10,
      "following": 5,
      "location": "Málaga, Spain",
      "blog": "rosa.dev"
    }
    ```
  - Repo:
    ```json
    {
      "id": 1,
      "name": "remember-me",
      "language": "TypeScript",
      "stargazers_count": 5,
      "forks": 0,
      "description": "A TS repo",
      "updated_at": "2025-08-01T12:00:00Z"
    }
    ```

- **Pagination**  
  - `fetchUserRepos`: returns a batch of repositories with pagination info (`{ data, hasNextPage }`), or empty array on error.  
  - `fetchAllUserRepos`: loops until completion to fetch *all* repos for a user, ensuring filters (text + language) work on the full dataset.  

- **Resilience**  
  - All API helpers accept an optional `AbortSignal`.  
  - Errors are caught and surfaced in the UI as an error state, instead of crashing.  
  - `AbortError` is treated as a benign cancellation.  
  - Console logging is disabled in production (in a real-world app we could integrate Sentry or similar).  

- **Limitations**  
  - GitHub REST API v3 enforces **rate limits** (60 requests/hour without authentication).  
  - A personal access token can be set via `VITE_GITHUB_TOKEN` to increase the limit to 5,000 requests/hour.

---

## ♿ Accessibility

Accessibility was a conscious focus during development.  
Instead of a simple input for suggestions, I implemented a proper **combobox/listbox pattern** following WAI-ARIA Authoring Practices.

- **Combobox pattern**
  ```html
  <div role="combobox" aria-expanded="true" aria-controls="user-suggestions">
    <input aria-activedescendant="suggestion-0" />
  </div>

- **Listbox pattern**  
  ```html
  <ul role="listbox" id="user-suggestions">
    <li role="option" aria-selected="true">rosa-haro</li>
  </ul>

- **UI states**
  - Loader: `role="status"` with optional `aria-label="Loading..."`.  
  - Error: `role="alert"` with assertive live region. 
  - Empty states with clear, descriptive copy.

- **Keyboard support**
  - ↑/↓ to navigate suggestions.
  - Enter to select the active option.
  - Escape to close the dropdown.

This ensures the search and repository filtering flow remains usable for screen-reader and keyboard users.

---

## 🧪 Testing Strategy

- **Framework**: Vitest + jsdom  
- **Libraries**: React Testing Library, @testing-library/user-event, MSW v2  

### What is tested
- **HomePage (user suggestions)**  
  - Shows suggestions on typing.  
  - Navigates to UserPage when selecting.  

- **UserPage (repo filters)**  
  - Filters repositories by text (on submit).  
  - Filters by language.  
  - Combines text + language filters.  

- **UserPage (states)**  
  - Loader while fetching.  
  - Empty state when 0 repos.  
  - Error state when API fails.  

- **Utils**  
  - `languageColors`: consistent mapping, fallback colors.  
  - `timeAgo`: relative time formatting.  
  - `normalizeUrl`: ensures valid URLs.  

### How it is tested
- API calls are mocked with **MSW** per test.  
- Each test isolates one scenario: success, empty, or error.  
- Assertions use `getByRole` / `findByRole` (accessible queries).  
- Tests avoid brittle selectors; they assert on visible text/roles.  

---

## 📚 Storybook

This project includes a slim Storybook to document presentational components.

### Run
\`\`\`bash
npm run storybook
# build static
npm run build-storybook
\`\`\`

### Covered components
- UI States: \`LoaderComponent\`, \`EmptyStateComponent\`, \`ErrorStateComponent\`
- Filters + Search: \`LanguageFilterComponent\`, \`SearchBarComponent\`, \`UserSuggestionsComponent\`
- Repos: \`RepoCardComponent\`, \`RepoListComponent\`

### Configuration (Storybook v9 + Vite)
- Tailwind styles are loaded in \`.storybook/preview.ts\`:
  \`\`\`ts
  import "../src/index.css";
  \`\`\`
- SVG as React components enabled with **SVGR** in \`.storybook/main.ts\` via \`viteFinal\`.
- In Storybook **v9**, Essentials/Interactions are part of core; no addon entries are required.
- Stories live under \`src/**/*.stories.tsx\`.

---

## 🎨 UI & Styling

- Dark theme inspired by GitHub.  
- Tokens defined in `index.css`:  
  - Colors (`--color-bg`, `--color-surface`, `--color-accent`, etc.).  
  - Typography scale (`--font-display`, `--font-h2`, etc.).  
  - Utility tokens: radius, shadows.  
- Shared utility classes (`card-base`, `input-base`, `button-primary`) keep styles consistent.  
- Responsive grid: 1-column on mobile, 2-column on desktop.  
- Focus-visible styles and hover transitions for better UX.  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Installation
```bash
git clone <repo-url>
cd github-repo-searcher
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test
```

### Optional: GitHub token
To avoid API rate limits during development:
```
VITE_GITHUB_TOKEN=ghp_xxx
```

---

## 🔄 Development Workflow

- **Conventional Commits** (feat, fix, docs, test, chore).  
- **Feature branches** per scope, merged with `--squash` into `develop`.  
- Example:  
  - `feat(repo-filters): add Reset filters and unify 'All languages' handling`  
  - `fix(stability): improve API error handling and remove unused email field`  

---

## 📈 Future Improvements

- **Hybrid loading strategy for repositories**  
  Currently all repositories are fetched upfront so filters (text + language) operate on the full dataset. For better initial performance on very large accounts, load the first page by default and fetch the rest in the background when the user starts typing in the text filter or opens the language select.

- **GraphQL API (v4)**  
  Consider switching to GraphQL to request exactly the fields needed, reduce network calls, and simplify nested resources.

- **State management & caching**  
  Persist filters in URL params, add recent searches (optional persistence), and cache GitHub requests with React Query or SWR.

- **UI/UX**  
  Expand Storybook coverage to pages/flows and add click-outside behavior for suggestions dropdown.

---

## 📝 Personal Process Log

**Sprint Day 1 — Project setup & foundations**  
Created the project with Vite, installed dependencies, mapped the app flow (Home → UserPage) and component structure. Designed the UI direction and started consolidating my TypeScript knowledge. I had used TS before in exercises and small projects, but this was my first “serious” project with it.

**Sprint Day 2 — TypeScript deepening & data layer**  
Kept studying TS (typing API responses, utility types) and implemented the GitHub fetchers for user data and repositories.

**Sprint Day 3 — UserPage logic (without filters)**  
Built the main UserPage flow: loading user profile and repositories, wiring state, and rendering core sections.

**Sprint Day 4 — Home suggestions**  
Implemented the suggestions dropdown on Home (search-as-you-type with keyboard navigation).

**Sprint Day 5 — Filters & UI states**  
Implemented repository filters (by name and language), added reusable UI states (Loader, Error, Empty), and started layout/styling.

**Sprint Day 6 — Layout & tests**  
Refined layout and styles, applied small improvements, and added initial tests.

**Sprint Day 7 — Final touches**  
Completed the test suite, wrote the README and code documentation (I had been documenting along the way; this day I cleaned up and integrated everything). Added Storybooks and deployed to Vercel.

### Challenges I tackled
- **Abort handling** — Introduced `AbortController` to cancel in-flight requests and avoid inconsistent UI after navigation.  
- **Redux decision** — Decided not to add a global state manager for this scope; kept local state + URL as the source of truth.  
- **Repository fetching strategy** — Chose to fetch all repos upfront so filters work on the full dataset; documented a future hybrid strategy for performance on very large accounts.

### Mindset
I approached the task with a focus on **scalability, maintainability, and accessibility**: small reusable components, clear separation of concerns, typed helpers, and user-friendly states. I prioritized delivering a complete, high-quality experience while documenting trade-offs and next steps.

---

## 📌 Notes

- Code was written with **scalability and maintainability** in mind: architecture is ready to grow if requirements expand.
- Local state and URL are used as the **single source of truth**, avoiding unnecessary global state managers.  
- The app is highly **componentized** for reusability, clarity, and clean architecture.  

