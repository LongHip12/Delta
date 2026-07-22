# Lonely Bypass

A link bypass service website that copies the UI of izen.lol. Bypasses 50+ link shorteners and key systems instantly.

## Run & Operate

- `pnpm --filter @workspace/lonely-bypass run dev` — run the frontend (auto via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (auto via workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `bash scripts/autocommit.sh "message"` — commit and push all changes to GitHub

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/lonely-bypass/src/pages/` — all page components (home, supported, pricing, why-choose, support)
- `artifacts/lonely-bypass/src/components/layout.tsx` — global nav + layout shell
- `artifacts/api-server/src/routes/` — bypass, supported, stats, apiKeys route handlers
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — DB tables: apiKeys, bypassStats

## Pages

- `/` — Home: bypass input (Single/Bulk/+API Key tabs), stats, popular services
- `/supported` — Service catalog with search and grouped categories
- `/why-choose` — Features and reasons to use Lonely Bypass
- `/pricing` — API pricing: Pay-as-you-go ($1/1000 req) and Monthly ($8/30 days)
- `/support` — Discord, FAQ accordion, contact

## GitHub

Remote: https://github.com/LongHip12/Delta

## User preferences

- UI should copy izen.lol exactly (dark #0e0f14 bg, emerald green accent)
- Title: "Lonely Bypass" not "Delta_"
- Navigation: Home · Supported · Why Choose · Pricing · Support
- No comments in code
- Auto commit to GitHub on changes
