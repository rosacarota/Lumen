**Project Purpose**: This repository contains a Vite + React frontend for the "Lumen" app. The frontend lives in `frontend/`. There is a `db/lumen.sql` file with DB schema, but no backend/server code in this repo.

**Quick Start (frontend)**:
- **Install deps:** `cd frontend; npm install`
- **Dev server:** `npm run dev` (from `frontend/`) — Vite with `@vitejs/plugin-react` and HMR.
- **Build:** `npm run build` (from `frontend/`)
- **Lint:** `npm run lint` uses the flat ESLint config in `frontend/eslint.config.js`.

**Entry points & routing**:
- **App entry:** `frontend/src/main.jsx` mounts the React app and wraps it with `BrowserRouter` (so routing is expected).
- **App component:** `frontend/src/App.jsx` is the high-level app component; routing and layout live here.

**Important directories & files**:
- `frontend/src/components/` : reusable React components (e.g. `Navbar.jsx`, `SchedaEvento.jsx`).
- `frontend/src/pages/` : route pages (e.g. `Home.jsx`).
- `frontend/src/stylesheets/` : component-specific CSS (e.g. `Navbar.css`).
- `frontend/package.json` : scripts and dependencies for the frontend.
- `frontend/vite.config.js` : Vite config (uses `@vitejs/plugin-react`).
- `frontend/eslint.config.js` : project ESLint config — uses the new flat config format.

**Patterns & conventions specific to this codebase**:
- Components are stored in `frontend/src/components/` and typically use PascalCase filenames (e.g. `SchedaEvento.jsx`).
- CSS files live under `stylesheets/` and class names in JSX often use kebab-case (e.g. `className="Header-Scheda"`).
- Routing is client-side (React Router). Changes touching routes should update `main.jsx` and `App.jsx`.
- ESLint is configured with the flat configuration API via `frontend/eslint.config.js` — follow its rules when adding new files.

**Discoverable issues you may encounter** (do not assume these will be auto-fixed):
- `frontend/src/main.jsx` imports `react-router-dom` but `react-router-dom` is not listed in `frontend/package.json` dependencies. If you add/modify routing, run `npm install react-router-dom`.
- `frontend/src/components/Navbar.jsx` contains syntax errors (duplicate/invalid function declarations). Review before editing or run lint to locate problems.
- `frontend/src/components/SchedaEvento.jsx` references undefined identifiers (e.g. `ente`) and inconsistent property names (`evento.Nome` vs `evento.data`). Validate data shapes passed into components.

**How to make safe edits**:
- Small changes: edit the file, run `npm run lint` and `npm run dev` to verify HMR and the browser.
- Dependency changes: modify `frontend/package.json` and run `cd frontend; npm install`.
- Styling changes: CSS is plain `.css` files; Vite will pick them up via imports in JSX files.

**When creating PRs / commits**:
- Keep changes minimal and focused. Mention which files were tested with `npm run dev` and which manual checks were done.
- If fixing runtime errors in components, include before/after screenshots or describe console errors so reviewers can verify.

**Guidance for AI agents**:
- Prefer small, focused edits. If a component import or dependency is missing (example: `react-router-dom`), add the dependency and update `package.json`, but do not upgrade other unrelated packages.
- Do not refactor large parts of the app or rename many files without human approval — this project appears incomplete and fragile in places.
- If you fix syntax/runtime errors in a file, run `npm run lint` and mention any new/remaining lint rules violations.
- Use these files as ground truth for project structure: `frontend/package.json`, `frontend/vite.config.js`, `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/eslint.config.js`.

**Examples (PowerShell)**:
```powershell
cd frontend; npm install
npm run dev
npm run lint
```

If you spot missing runtime deps while editing (e.g. `react-router-dom`), install it in `frontend/`:
```powershell
cd frontend; npm install react-router-dom
```

If anything below is unclear or you want the agent to be more/less aggressive making fixes, say what level of autonomy is allowed (e.g. "Only fix small syntax errors", or "You may add and install missing dependencies").
