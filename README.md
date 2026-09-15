# Forge Marketing Site

Next.js marketing site for Forge, including an interactive product demo at
[`/product-demo`](app/product-demo/page.tsx) — a real (if minimal) coach +
client experience backed by Postgres, meant for testing the core loop with
an actual coach and an actual client.

## Local development

```bash
npm install
cp .env.example .env   # point DATABASE_URL at a local Postgres
npx prisma migrate dev
npm run dev
```

The demo's `REPO_DRIVER`-equivalent here is just "does `DATABASE_URL` point
somewhere real" — there's no in-memory fallback for this app, since the
whole point of `/product-demo`'s backend is durable, shared state.

## Sharing `/product-demo` with a real coach + client (beta)

This is a **single shared instance** — no login, no multi-tenant isolation.
That's intentional for a first 1:1 test: whoever opens the link sees the
same data, updates in real time (polled every 4s), on whatever device they're
on. Don't share the deployed link beyond the people you're actually testing
with — anyone with it can act as any client or the coach.

1. **Database**: create a free Postgres instance — [Neon](https://neon.tech)
   or [Supabase](https://supabase.com) both work. Copy the connection
   string.
2. **Deploy**: push this repo to GitHub, then import it on
   [Vercel](https://vercel.com/new). Add an environment variable
   `DATABASE_URL` with the connection string from step 1.
3. **Migrate**: before (or right after) the first deploy, run migrations
   against that database from your machine:
   ```bash
   DATABASE_URL="<your connection string>" npx prisma migrate deploy
   ```
4. **Share**: send your coach `https://<your-app>.vercel.app/product-demo`.
   They can toggle "Coach view" / "Client view" themselves, or you can walk
   them through it — the point of the client view is that their actual
   client can open the same link on their own phone and it stays in sync.

## What's real vs. not

- **Real**: program assignment, weight check-ins, and coach↔client
  messages — all persisted in Postgres, visible to every viewer of the link.
- **Not real yet**: authentication (anyone with the link is "in"), payments,
  and the rest of the marketing site's forms (signup/login/demo-request) —
  those still show an honest "not wired up" message rather than pretending
  to work.
