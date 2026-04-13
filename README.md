# 🇬🇧 UK Study Guide — Ebook Lead Generation Platform

A full-stack Next.js 15 web application that collects email registrations on a landing page and automatically sends a free ebook PDF to each subscriber via email. Includes a complete admin dashboard for managing subscribers and ebooks.

---

## ✨ Features

**Landing Page**

- Full-viewport London hero image (Unsplash)
- Glassmorphism registration form with confetti on success
- Bento-grid features section with hover animations
- Auto-advancing testimonials carousel
- 2026 editorial design — deep navy + gold palette, Playfair Display headings

**Email Delivery**

- Automatic ebook delivery via Nodemailer (Gmail SMTP) on registration
- Branded HTML email template with personalised greeting and download button
- Handles duplicates gracefully — resends if email was not previously delivered
- Batch resend to all pending subscribers

**Admin Dashboard** (`/admin`)

- Secure login (credentials via `.env.local`)
- Overview with animated stats cards (count-up effect)
- Subscribers table — search, paginate, resend per-row, delete, CSV export
- Ebook management — drag-and-drop PDF upload → Supabase Storage → set active
- Settings — test email, config display, danger zone (delete all subscribers)
- Mobile-responsive sidebar

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (public `ebooks` bucket) |
| Auth | NextAuth.js v4 (Credentials provider) |
| Email | Nodemailer + Gmail SMTP |
| Styling | Tailwind CSS v4 + inline styles |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |
| Images | Unsplash (via `next/image`) |
| Deploy | Vercel |

---

## 🚀 Quick Start

### 1 — Clone & install

```bash
git clone <your-repo-url>
cd uk-study-guide
npm install
```

### 2 — Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values (see reference below).

### 3 — Set up Supabase database

1. Go to [supabase.com](https://supabase.com) → create a new project
2. Navigate to **SQL Editor → New Query**
3. Paste and run the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Verify the output shows `row_security = OFF` for both tables

### 4 — Create the storage bucket

If the SQL migration didn't create it automatically:

1. Go to **Storage → New Bucket**
2. Name: `ebooks`
3. Toggle **Public bucket** ON
4. Click **Save**

### 5 — Run locally

```bash
npm run dev
```

- Landing page → [http://localhost:3000](http://localhost:3000)
- Admin login → [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Environment Variables Reference

```env
# ── Supabase ──────────────────────────────────────────────────────────────
# Found in: Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ── Email (Gmail SMTP) ────────────────────────────────────────────────────
# IMPORTANT: Use an App Password, NOT your Gmail account password
# Generate at: https://myaccount.google.com/apppasswords
# (Requires 2-Step Verification to be enabled on your Google account)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM="UK Study Guide <your-gmail@gmail.com>"

# ── Admin credentials ─────────────────────────────────────────────────────
# These are the credentials you use to log into /admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=choose-a-strong-password-here

# ── NextAuth ──────────────────────────────────────────────────────────────
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-64-char-secret-string
# Use your actual production URL when deploying
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗄 Database Schema

```sql
-- subscribers
CREATE TABLE public.subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_sent    BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ
);

-- ebooks
CREATE TABLE public.ebooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- RLS disabled on both tables
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks DISABLE ROW LEVEL SECURITY;
```

---

## 📁 Project Structure

```
uk-study-guide/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout + SEO metadata
│   ├── loading.tsx                       # Global loading skeleton
│   ├── error.tsx                         # Global error boundary
│   ├── not-found.tsx                     # 404 page
│   ├── opengraph-image.tsx               # Auto-generated OG image
│   ├── robots.ts                         # robots.txt
│   ├── sitemap.ts                        # sitemap.xml
│   ├── globals.css                       # Tailwind v4 + global styles
│   ├── admin/
│   │   ├── page.tsx                      # Admin login
│   │   ├── layout.tsx                    # Admin layout (SessionProvider)
│   │   └── dashboard/
│   │       ├── page.tsx                  # Overview (stats + recent subs)
│   │       ├── subscribers/page.tsx      # Subscribers management
│   │       ├── ebooks/page.tsx           # Ebook upload & history
│   │       └── settings/page.tsx         # Settings + danger zone
│   └── api/
│       ├── subscribe/route.ts            # POST — public registration
│       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│       └── admin/
│           ├── stats/route.ts            # GET dashboard stats
│           ├── test-email/route.ts       # POST test email
│           ├── subscribers/
│           │   ├── route.ts              # GET list / DELETE all
│           │   ├── [id]/route.ts         # GET single / DELETE
│           │   ├── [id]/resend/route.ts  # POST resend ebook
│           │   └── resend-pending/route.ts # POST batch resend
│           └── ebook/
│               ├── upload/route.ts       # POST upload / GET list
│               └── [id]/route.ts         # PATCH activate / DELETE
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── BentoFeatures.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── DashboardLayout.tsx
│       └── SessionProvider.tsx
├── lib/
│   ├── supabase.ts                       # Server + admin Supabase clients
│   ├── supabase-browser.ts               # Browser Supabase client
│   ├── email.ts                          # Nodemailer + HTML template
│   ├── auth.ts                           # NextAuth config
│   ├── validations.ts                    # Zod schemas
│   └── utils.ts                          # cn(), formatDate(), CSV export
├── types/index.ts                        # All TypeScript interfaces
├── middleware.ts                         # Protects /admin/dashboard/*
├── supabase/migrations/
│   └── 001_initial_schema.sql            # Full DB setup script
├── .env.example
├── vercel.json
└── README.md
```

---

## 🌐 Deploying to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables from `.env.example`
5. Set `NEXTAUTH_URL` to your production URL (e.g. `https://your-app.vercel.app`)
6. Deploy

### After deploying

- Update `NEXTAUTH_URL` in Vercel environment variables to your real domain
- Redeploy for the change to take effect

---

## 📧 Gmail SMTP Setup (Step by Step)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security → 2-Step Verification** — enable it if not already on
3. **Security → App passwords** (search for it in the search bar)
4. Select app: **Mail**, select device: **Other** → type "UK Study Guide"
5. Copy the 16-character password shown
6. Paste it into `EMAIL_PASS` in your `.env.local` (keep the spaces: `xxxx xxxx xxxx xxxx`)

---

## 🔄 How the Email Flow Works

```
User submits form
      ↓
POST /api/subscribe
      ↓
Validate with Zod
      ↓
Check duplicate email in Supabase
      ↓
Insert subscriber record
      ↓
Fetch active ebook (is_active = true) from ebooks table
      ↓
Send email via Nodemailer with ebook download URL
      ↓
Update subscriber: email_sent = true, email_sent_at = now()
      ↓
Return success → show confetti on frontend
```

---

## 🎯 First Steps After Setup

1. **Deploy the app** and visit `/admin`
2. **Log in** with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. **Upload your ebook** in the Ebook tab (drag & drop a PDF)
4. **Send a test email** in Settings to verify Nodemailer is working
5. **Share your landing page** — every registration triggers automatic delivery

---

## 📄 License

MIT — free to use and modify for your own projects.
