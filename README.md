# Neurix

A focus-tracking and analytics web app that helps you understand your productivity patterns. Log deep work sessions, rate your focus, and uncover insights about when and how you work best.

> **Status:** v0 complete — core session tracking and analytics live. Actively developing.
>
> **Live:** [neurix-anishbandapelli-1733s-projects.vercel.app](https://neurix-anishbandapelli-1733s-projects.vercel.app)

## What it does

- Start and end timed focus sessions with a live stopwatch
- Tag sessions by category (studying, coding, building, admin)
- Rate focus quality after each session
- View productivity analytics on a personal dashboard
- Visualize focus time by day and category with interactive charts
- Surface insights like best focus category and session trends

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Clerk
- **Charts:** Recharts
- **Deployment:** Vercel

## Roadmap

### v0 (complete)
- [x] Project setup and database schema
- [x] Auth integration (Clerk)
- [x] Deploy to Vercel
- [x] Session start/end flow with live timer
- [x] Post-session rating and notes
- [x] Dashboard with session history and summary stats
- [x] Analytics charts (daily focus, category breakdown)
- [x] Basic insights
- [x] Styling with Tailwind

### v1 (next)
- [ ] Energy level and distraction tracking
- [ ] Pattern engine (best time of day, flow trends)
- [ ] Weekly review summaries
- [ ] Improved session categories (dropdown)
- [ ] Mobile responsive polish

### v2 (future)
- [ ] AI-powered recommendations
- [ ] Browser extension for distraction signals
- [ ] Multi-user insights and comparison
- [ ] Calendar integration

## Running locally

```bash
git clone https://github.com/anish-band/neurix.git
cd neurix
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Requires a `.env` file with `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.