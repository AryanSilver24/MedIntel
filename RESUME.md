# MedIntel — resume checklist

Updated **20 Aug 2026**. Everything built and verified, persistence included.

---

## Unblocked — 20 Aug 2026

Atlas M0 is connected (database `medintel`), seeded, and the full end-to-end suite passes
**108/108**. There is no outstanding blocker.

### The Atlas URI had to be written in non-SRV form

`mongodb+srv://` fails on this machine with `querySrv ECONNREFUSED` — Node's resolver cannot
do SRV lookups here, even though `nslookup -type=SRV` resolves the record fine. Not an Atlas,
credentials, or Network Access problem. `MONGODB_URI` in `server/.env` uses the seed-list form
instead:

```
mongodb://<user>:<pass>@ac-vtz02m2-shard-00-0{0,1,2}.rokzd0q.mongodb.net:27017/medintel
  ?ssl=true&replicaSet=atlas-hnj23u-shard-0&authSource=admin&retryWrites=true&w=majority
```

Rebuild it after any cluster change with:

```bash
nslookup -type=SRV _mongodb._tcp.medintelcluster.rokzd0q.mongodb.net 8.8.8.8  # shard hosts
nslookup -type=TXT medintelcluster.rokzd0q.mongodb.net 8.8.8.8                # authSource, replicaSet
```

> Do **not** try the in-memory MongoDB fallback. It needs a 600 MB binary from
> fastdl.mongodb.org and that download died with `ECONNRESET` after 3 retries, twice, on this
> connection.

## Run

```bash
cd server && npm run dev     # http://localhost:4000
cd client && npm run dev     # http://localhost:5173
```

Demo account: `aarav.menon@example.com` / `MedIntel2025!`

## State at pause

### Done and verified

| Area | Status |
|---|---|
| Layer 5 — Data Access | 7 models, 7 repositories, cache interface (memory + Redis drivers), job queue |
| Layer 4 — AI Service | 7-stage pipeline, provider registry, circuit breakers, redactor, validator |
| Layer 3 — Business | 20-rule engine, triage/chat/reports/reminders/history/auth/profile/dashboard |
| Layer 2 — API | Express 5, JWT + refresh rotation, zod validation, 4 rate-limit tiers, error envelope |
| Frontend | All 8 pages on the real API, auth context, route guard, `mock.js` deleted, builds clean |

Verified live without a database:

- **126/126** rules + safety unit tests
- Layer-boundary audit — zero skip-layer or upward imports
- Groq: triage, chat, report summarisation all round-trip
- Groq → Gemini failover, and the circuit breaker opening then skipping in 0 ms
- Emergency path makes **zero** model calls
- `vite build` clean

### Verified against Atlas on 20 Aug 2026

`npm run seed` succeeded and `npm run test:api` passed **108/108** — auth and refresh rotation,
triage, chat, reports, unified history, profile, dashboard, per-resource RBAC, the response
envelope, and logout revoking refresh tokens.

---

## Keys in `server/.env`

| Key | State |
|---|---|
| `GROQ_API_KEY` | Set, verified live |
| `GEMINI_API_KEY` | Set, verified live (failover tested) |
| `MONGODB_URI` | Set (non-SRV seed list), connected and seeded |
| `OCR_SPACE_API_KEY` | Empty. Uploads work; PDF/image extraction skipped, reports land `Failed` with a clear reason. Plain-text uploads still summarise. |
| `JWT_SECRET` | Still the dev default. Fine locally, must change before any deployment. |
| `REDIS_URL` | Empty. In-process cache/queue — correct for a single-instance demo. |

### Model IDs move — check before debugging a 404

Groq had retired **every Llama model**; Google had retired `gemini-2.0-flash`. Both showed up
as a bare 404, which looks like an auth problem but isn't. List what's actually available:

```bash
curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
```

Current: `GROQ_MODEL=openai/gpt-oss-120b` (reasoning model, 10–12 s/call, hence
`AI_TIMEOUT_MS=45000`) and `GEMINI_MODEL=gemini-flash-latest`.

---

## Resolved

**Gemini model choice — decided 20 Aug 2026.** Reproducible output is *not* required, so
`GEMINI_MODEL` stays the alias `gemini-flash-latest`. It survives the next model retirement,
which matters more here than pinning a version. No change needed.

## Repo cleanup — 20 Aug 2026

- Documents moved to `docs/` (report PDF, UML, overview PDF + PPTX, concept notes,
  `FRONTEND_SOURCE_CODE.md`, `make_medintel_ppt.py`).
- Deleted the stale mock-data frontend that shadowed `client/` at the repo root
  (`src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json`,
  `.oxlintrc.json`, `.php-preview-router.php`) and the tracked 28 MB `client.zip`.
  All recoverable from git history at commit `9cdc0a2`.
- Root `README.md` rewritten — it previously documented the deleted mock frontend.

Re-verified after the cleanup: `client` production build clean, `npm test` 126/126 passing.

Root is now `client/`, `server/`, `docs/`, `README.md`, `RESUME.md`. **Not yet committed.**

## Suggested next steps after the smoke test passes

1. Click through the running app end-to-end
2. Commit the cleanup
3. Optional: OCR key, so report upload demos the full extraction path
4. Optional: generate a real `JWT_SECRET`
