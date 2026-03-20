# Humanity & Blessings Home Health

Full-stack web application for Humanity & Blessings Home Health, a family-owned home health care agency serving Broward County, FL.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, React 19, SSR/SSG)
- **Styling:** Tailwind CSS v4 + custom design system
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (admin dashboard)
- **Email:** Resend
- **Deployment:** Vercel

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local` with:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `NOTIFICATION_EMAIL` | Email address to receive form notifications |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., https://www.humanityandblessings.com) |

### 3. Set up Supabase database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `supabase-migration.sql`
3. Copy your project URL and keys to `.env.local`

### 4. Set up Resend

1. Create an account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Copy the API key to `.env.local`

### 5. Create admin user

1. Go to your Supabase project → Authentication → Users
2. Click "Add User" and create an admin account with email/password
3. Use these credentials to log in at `/admin/login`

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and configures everything

## Project Structure

```
app/
├── page.tsx                    # Home
├── services/page.tsx           # Services
├── about/page.tsx              # About
├── contact/page.tsx            # Contact
├── book/page.tsx               # Book Appointment
├── admin/
│   ├── login/page.tsx          # Admin login
│   ├── page.tsx                # Leads dashboard
│   └── appointments/page.tsx   # Appointments dashboard
└── api/
    ├── leads/route.ts          # Lead form API
    ├── appointments/route.ts   # Appointment form API
    └── admin/route.ts          # Admin data API
```

## Brand Colors

All colors are defined as CSS variables in `app/globals.css` via Tailwind's `@theme` directive. To update the brand palette, edit the `@theme` block in that file.
