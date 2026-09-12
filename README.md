# InRisk Weather Dashboard

Responsive React dashboard for fetching, archiving, and visualizing historical daily weather. It uses only the backend API; cloud credentials never enter the browser.

Companion API: https://github.com/ahtesham059/inrisk-backend

## Run locally

Requires Node.js 20+ and the companion backend at `http://localhost:8000`.

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to a different backend URL when needed.

## Features

- Reviewer login with short-lived backend-issued access token and logout
- Coordinate and inclusive 31-day date-range validation
- Fetch-and-store progress, success, and errors
- Stored JSON browser with metadata, manual refresh, and confirmed permanent deletion
- Cached file content with max/min line chart
- Actual/apparent temperature table with 10/20/50-row pagination
- Responsive and keyboard-friendly layout

Dates remain date-only strings to prevent timezone shifts. Missing observations appear as an em dash in the table and gaps in the chart. The file is loaded once and used locally for visualization and pagination.

The access token is kept in `sessionStorage`, sent as a bearer token, and removed on logout or any authenticated `401` response. Passwords and storage credentials never enter the frontend configuration or repository.

## Design and libraries

- **React and TypeScript** implement the dashboard and explicit UI states.
- **Tailwind CSS** provides the responsive layout and design system.
- **TanStack Query** caches archive listings/content and coordinates mutation refreshes.
- **Recharts** renders the responsive daily maximum/minimum line chart.
- **Lucide React** provides accessible interface icons.
- **Vitest and Testing Library** verify validation and the login interaction; ESLint and TypeScript check the build.

## Checks and deployment

```bash
npm test
npm run lint
npm run build
```

Import the repository into Vercel, set `VITE_API_BASE_URL` to the public backend URL, and deploy. Add the resulting frontend origin to the backend's `CORS_ORIGINS` setting.

Provider note: this project is intended for the Vercel Hobby plan. Confirm that the evaluator accepts it and Supabase as substitutions for the providers named in the case study.
