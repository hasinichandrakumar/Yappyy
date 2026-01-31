# Yappyy

A simplified recording & session-analysis web app with filler-word detection, session analytics, and Google OAuth. Built as a TypeScript full‑stack app with a Vite + client frontend and an Express + bundled server backend. The project is designed to run locally (development), be built for production, and hosted on platforms like Replit or a typical Node host.

Quick highlights
- Lightweight recording UI (client) + Express server (server/index.ts)
- Filler-word detection and session analysis
- Optional integrations with Deepgram, Anthropic, Hugging Face
- Google OAuth support (see repository OAuth docs)
- Uses Drizzle for database migrations + Neon serverless/Postgres patterns

Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Build & run (production)](#build--run-production)
- [Database](#database)
- [Useful repo docs](#useful-repo-docs)
- [Testing & checks](#testing--checks)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- Record audio from the browser and upload/analyze sessions.
- Detect filler words and generate session analytics.
- Session storage and export (PDF/JSON examples exist in repo).
- Google OAuth sign-in flow for user sessions (setup docs present).
- Integrations with AI/audio providers for later processing (optional).

## Tech stack
- Language: TypeScript (server and client)
- Server: Node.js + Express (server/index.ts)
- Frontend: Vite-powered client (see `/client`) — likely React + Tailwind
- Styling: Tailwind CSS (tailwind.config.ts)
- Database / ORM: Drizzle + Neon (drizzle.config.ts, neon serverless dependency)
- Bundling: Vite (frontend) and esbuild for server bundle
- Dev tooling: tsx for dev server, tsc for type checking, ESLint config present
- Third-party integrations found in package.json:
  - @deepgram/sdk, @anthropic-ai/sdk, @huggingface/inference
  - @mediapipe packages for browser pose/hand/face detection
  - Radix UI components, Rive canvas, etc.

Files that informed this README:
- package.json
- server/index.ts
- vite.config.ts
- tailwind.config.ts

Note: repository file listing may be incomplete; view the repo to explore all files: https://github.com/hasinichandrakumar/Yappyy/tree/main

## Requirements
- Node.js v18+ recommended
- npm (or yarn/pnpm)
- A Postgres-compatible database for production (Neon / PostgreSQL)
- Optional API keys for integrations:
  - Deepgram, Anthropic, Hugging Face, Google OAuth

## Installation

1. Clone
```
git clone https://github.com/hasinichandrakumar/Yappyy.git
cd Yappyy
```

2. Install dependencies
```
npm install
# or
# yarn install
```

3. Create an environment file
```
cp .env.example .env
# then edit .env with the values below
```

## Environment variables

Create `.env` (or set the variables in your host). Variables used by the app (examples — adjust to your setup):

- NODE_ENV=development | production
- PORT=5000
- HOST=0.0.0.0
- DATABASE_URL=postgres://user:pass@host:port/dbname              # Drizzle / Neon connection
- NEON_DATABASE_URL=...                                           # if using Neon serverless
- GOOGLE_CLIENT_ID=your-google-client-id
- GOOGLE_CLIENT_SECRET=your-google-client-secret
- DEEPGRAM_API_KEY=your-deepgram-key
- ANTHROPIC_API_KEY=your-anthropic-key
- HUGGINGFACE_API_TOKEN=your-hf-token
- SENTRY_DSN=... (optional monitoring)
- JWT_SECRET or SECRET_KEY=... (if the app uses JWT/session secrets)
- VITE_... environment variables for client-exposed values (prefix with VITE_)

Note: See the repository's OAuth docs for Google-specific setup details:
- GOOGLE_OAUTH_SETUP.md
- OAUTH_SETUP_INSTRUCTIONS.md

## Running locally

Development (hot reload for server + client)
```
npm run dev
```
This runs the development script defined in package.json:
- "dev": NODE_ENV=development tsx server/index.ts

Open your browser at the port printed in the server logs (defaults to PORT or 5000).

Server-only (run index.ts directly)
```
npx tsx server/index.ts
```

## Build & run (production)
Build client and bundle server, then run the produced bundle
```
npm run build
npm start
```
- "build" runs: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- "start" runs: `NODE_ENV=production node dist/index.js`

The server binds to the PORT env var (defaults to 5000).

## Database
Drizzle config and migration tooling present. There is a package.json script:
```
npm run db:push
```
which maps to `drizzle-kit push`. Make sure `DATABASE_URL` (or NEON url) is configured before running migrations.

## Useful repo docs & scripts
- DEPLOYMENT-GUIDE.md — deployment notes
- REPLIT_SECRETS_FIX.md and other Replit guides — helpful for running on Replit
- Script examples:
  - `start-with-correct-env.sh` — helper to set environment and start
  - `simple-server.js` — small server helper
- See the `/server` folder for route registration and server logic (server/index.ts).

## Testing & code checks
There are no explicit test scripts in package.json, but the project includes:
- `npm run check` — runs `tsc` for type checks
- ESLint config is present (eslint.config.js) — run your lint command if you add it
Add tests and a test script (e.g. Jest or Vitest) if you want automated unit/integration tests.

## Contributing
- Fork the repo
- Create a feature branch: git checkout -b feat/your-change
- Commit & push, then open a PR
- Include testing and TypeScript checks; CI is recommended

Developer notes for reviewers
- The server logs indicate features: "Core recording functionality", "Filler word detection", "Session analysis", and "Google OAuth configured" — start by running dev mode and visiting the client to validate these flows.
- Check the client folder for UI and Vite dev server behavior.
- Review OAuth docs to configure Google credentials for local testing.

## License
MIT — see package.json license field and add a LICENSE file if not present.

## Contact
- Maintainer: hasinichandrakumar — https://github.com/hasinichandrakumar/Yappyy

---

Notes about repository scan
- I inspected key files (package.json, server/index.ts, config files) to customize this README. View the repository in the GitHub UI to explore all files: https://github.com/hasinichandrakumar/Yappyy/tree/main