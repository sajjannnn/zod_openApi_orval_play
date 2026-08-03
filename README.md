# zod-openapi-play

A minimal, hands-on project that shows the full **"one API contract, two consumers"** pipeline:

```
zod schema → openapi.json → orval → typed react-query client → React app
                                   └────────── Express server (validation + data)
```

Everything is deliberately small so you can read every file end to end.

## Tech stack

| Layer | Tool |
|---|---|
| Schema / validation | [zod](https://github.com/colinhacks/zod) v4 |
| OpenAPI generation | [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) v9 |
| Client codegen | [orval](https://orval.dev) v8 |
| Server | [express](https://expressjs.com) v5 + `tsx` |
| Data fetching | [@tanstack/react-query](https://tanstack.com/query) v5 |
| UI | React 19 + Vite |

## Project structure

```
├── src/
│   ├── user.schema.ts        # SOURCE OF TRUTH: zod schema → type + validator + spec decoration
│   ├── openapi.ts            # OpenAPIRegistry: registers schemas + paths (the "contract")
│   ├── print-spec.ts         # serializes the registry → openapi.json (the snapshot)
│   ├── server.ts             # Express server: declares routes + validates with the same zod schema
│   └── client/
│       ├── custom-fetch.ts   # THE one hand-written layer: base URL, transport, error handling
│       ├── generated/        # orval output: endpoint functions + react-query hooks (DO NOT EDIT)
│       └── models/           # orval output: TypeScript types for the API data (DO NOT EDIT)
├── web/                      # Vite React app consuming the generated hooks
├── orval.config.ts           # codegen instructions (read openapi.json → emit client)
├── openapi.json              # committed spec snapshot (orval's input)
└── pnpm-workspace.yaml       # declares `web` as a workspace package
```

## Getting started

```bash
# 1. install (root project + web workspace)
pnpm install

# 2. start the API server (http://localhost:4000)
pnpm dev

# 3. in a second terminal, start the web app (http://localhost:5173)
pnpm web
```

### CORS (required before the browser app can talk to the API)

The web app (origin `http://localhost:5173`) calls the API (origin `http://localhost:4000`) — a **cross-origin** request. The browser blocks it unless the server opts in with CORS headers. Install and mount the middleware:

```bash
pnpm add cors
pnpm add -D @types/cors
```

```ts
// src/server.ts
import cors from "cors";
// ...
const app = express();
app.use(cors());   // before your routes
```

Without this, `fetch` from the browser fails with "Failed to fetch" and **no status code** — even though `curl` works (curl doesn't enforce CORS).

## API

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/users/{id}` | — | `200` → `User` · `404` → error |
| `POST` | `/users` | `{ name, email }` (no `id`!) | `201` → `User` · `400` → validation errors |
| `GET` | `/openapi.json` | — | the generated spec, served live |

The server validates every `POST` body with `createUserSchema.safeParse(...)` — the **same** schema that produced the frontend's `CreateUser` type.

> **Storage note:** users live in an in-memory `Map` (`server.ts`) — the demo's stand-in for a database.
> Restart the server and every user you created is gone. Only the seed user (Alice) survives, because she is hardcoded in the source.

## How the pipeline works (4 stages)

1. **Define** — `src/user.schema.ts` declares each model once as a zod schema. One declaration produces a runtime validator *and* a TypeScript type (`z.infer`), so they can never drift.
2. **Describe** — `src/openapi.ts` registers schemas and routes into an `OpenAPIRegistry`; `pnpm print-spec` serializes it to `openapi.json`.
3. **Compile** — orval reads `openapi.json` per `orval.config.ts` and emits a typed client into `src/client/`. The config's `mutator` makes every generated call go through your `custom-fetch.ts`.
4. **Consume** — the React app calls the generated hooks; react-query handles loading/error/cache.

## Regeneration workflow (the whole point)

Whenever the API changes, edit the schema, then recompile — TypeScript then catches every broken consumer:

```bash
pnpm print-spec    # 1. rebuild openapi.json from zod schemas
pnpm generate      # 2. re-run orval from the snapshot
pnpm --dir web exec tsc --noEmit   # 3. TS finds every place that now breaks
```

## Using the generated client

In frontend code, use only the `use*` hooks (everything else is scaffolding):

```ts
// GET → query hook: auto-fetches on render
const q = useGetUsersId(id);
q.isPending; q.isError; q.data?.data;

// POST → mutation hook: runs only when you call .mutate()
const m = usePostUsers();
m.mutate({ data: { name, email } });
m.isSuccess; m.error;
```

- **Query hooks** come from `GET` endpoints → auto-run, cache-keyed by URL.
- **Mutation hooks** come from non-`GET` endpoints → fire on demand.
- Never edit files under `src/client/generated/` or `src/client/models/` — they are regenerated.

## What this project is for

This project is a miniature of the API layer used at **akxr**:

| Demo file | akxr equivalent |
|---|---|
| `src/user.schema.ts` | `akxr-backend/src/validations/` |
| `src/openapi.ts` | `akxr-backend/src/config/openapi.ts` |
| `orval.config.ts` | `akxr-frontend/packages/api/orval.config.ts` |
| `src/client/custom-fetch.ts` | `akxr-frontend/packages/api/src/api/custom-fetch.ts` |
| `src/client/generated/` | `akxr-frontend/packages/api/src/api/generated/` |
| `src/client/models/` | `akxr-frontend/packages/api/src/api/models/` |

## Troubleshooting

- **"Unexpected store location" (pnpm):** `node_modules` is linked from a different store than the current shell resolves. Point pnpm at the same store, e.g. `pnpm config set store-dir /home/beast/.local/share/pnpm/store/v11 --global` (pnpm 11 reads the global `config.yaml`/`rc` under `~/.config/pnpm/` or `$XDG_CONFIG_HOME`).
- **Browser shows "Failed to fetch" but `curl` works:** CORS — see [CORS](#cors-required-before-the-browser-app-can-talk-to-the-api).
- **`pnpm dev` / `pnpm web` done nothing:** check the ports are free (`4000` API, `5173` web) and the servers started in separate terminals.
# zod_openApi_ovral_play
