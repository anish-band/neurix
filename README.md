# Neurix

A focus-tracking and analytics web app that helps you understand your productivity patterns. Log deep work sessions, rate your focus, and uncover insights about when and how you work best.

> **Status:** Early development — actively building during March 2026.
>
> **Live:** [neurix-anishbandapelli-1733s-projects.vercel.app](https://neurix-anishbandapelli-1733s-projects.vercel.app)

## What it does

- Start and end timed focus sessions
- Tag sessions by category (studying, coding, building, admin)
- Rate focus quality after each session
- View productivity analytics on a personal dashboard
- Surface insights like best focus times and category performance

## Tech stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Clerk
- **Charts:** Recharts
- **Deployment:** Vercel

## Roadmap

- [x] Project setup and database schema
- [x] Auth integration
- [x] Deploy to Vercel
- [ ] Session start/end flow
- [ ] Dashboard with session history
- [ ] Analytics charts
- [ ] ML Pattern insights
- [ ] Polish

## Running locally

```bash
git clone https://github.com/anish-band/neurix.git
cd neurix
npm install
npx prisma migrate dev
npm run dev
```

Requires a `.env` file with `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.