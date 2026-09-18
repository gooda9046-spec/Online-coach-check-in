# Forge Marketing Site

Next.js marketing site for Forge, including a real interactive product demo
at [`/product-demo`](app/product-demo/page.tsx) — real accounts, real
Postgres-backed data, meant for testing the core loop with an actual coach
and an actual client.

## Local development

```bash
npm install
cp .env.example .env   # point DATABASE_URL at a local Postgres
npx prisma migrate dev
npm run dev
```

`RESEND_API_KEY` is optional locally — without it, password-reset and 2FA
emails are just logged to the server console instead of actually sending,
so the whole flow is still testable without an email account.

## Accounts

- **Coaches** sign up directly at `/signup`.
- **Clients** never self-register. A coach adds them by name from the
  Clients tab, which generates a one-time invite link (`/join/<code>`); the
  real client sets their own email + password there, which links their
  account to that client record.
- Every client and program is scoped to the coach who owns it — enforced
  server-side on every API route, not just hidden in the UI.
- **Password reset**: `/forgot-password` → emailed link → `/reset-password/<token>`.
  Resetting a password invalidates every other active session.
- **2FA**: opt-in per account from `/account` (linked from the top bar once
  signed in). Email-code based — enable it and every future login emails a
  6-digit code that expires in 10 minutes. Disabling requires re-entering
  your password.

## Sending real email (Resend)

Password reset and 2FA both need to actually deliver an email. This app
uses [Resend](https://resend.com):

1. Create a free account at [resend.com](https://resend.com) and grab an
   API key from **API Keys** in the dashboard.
2. Locally: put it in `.env` as `RESEND_API_KEY`.
3. In production: add `RESEND_API_KEY` as an environment variable in your
   Vercel project settings.

Without a verified domain, emails send from Resend's shared
`onboarding@resend.dev` address — fine for a beta. Once you verify your own
domain in Resend, set `EMAIL_FROM` to a custom address (e.g.
`"Forge <noreply@yourdomain.com>"`).

## Deploying

1. **Database**: a free Postgres instance — [Neon](https://neon.tech) or
   [Supabase](https://supabase.com) both work. Copy the connection string.
2. **Deploy**: push this repo to GitHub, then import it on
   [Vercel](https://vercel.com/new). Add environment variables
   `DATABASE_URL` and `RESEND_API_KEY`.
3. **Migrate**: before (or right after) the first deploy, run migrations
   against that database from your machine:
   ```bash
   DATABASE_URL="<your connection string>" npx prisma migrate deploy
   ```
4. **Share**: send your coach `https://<your-app>.vercel.app/signup` to
   create their account, then have them invite you (or whoever the real
   client is) from the Clients tab.

## What's real vs. not

- **Real**: accounts, sessions, password reset, 2FA, program assignment,
  weight check-ins, exercise/lift logging with progression charts, and
  coach↔client messaging — all persisted in Postgres, all scoped per coach.
- **Not real yet**: payments, and the rest of the marketing site's forms
  (the "Book a Demo" / "Talk to Sales" pages) — those still show an honest
  "not wired up" message rather than pretending to work.
