-- ============================================================
-- UK Study Guide — Supabase Database Setup
-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ─── 1. Create subscribers table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_sent    BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ
);

-- ─── 2. Create ebooks table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ebooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- ─── 3. DISABLE Row Level Security on all tables ─────────────────────────
-- This allows the service role and anon key to read/write freely
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks DISABLE ROW LEVEL SECURITY;

-- ─── 4. Create indexes for common queries ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON public.subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email_sent ON public.subscribers (email_sent);
CREATE INDEX IF NOT EXISTS idx_ebooks_is_active ON public.ebooks (is_active);
CREATE INDEX IF NOT EXISTS idx_ebooks_uploaded_at ON public.ebooks (uploaded_at DESC);

-- ─── 5. Storage bucket setup ─────────────────────────────────────────────
-- Run these separately if needed via Supabase Dashboard → Storage → New Bucket
-- Bucket name: ebooks
-- Public bucket: YES (so download URLs work without auth)
--
-- Or via SQL (may require elevated permissions):
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads from the ebooks bucket
CREATE POLICY IF NOT EXISTS "Public ebook reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebooks');

-- Allow service role to upload
CREATE POLICY IF NOT EXISTS "Service role ebook uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebooks');

-- Allow service role to delete
CREATE POLICY IF NOT EXISTS "Service role ebook deletes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ebooks');

-- ─── 6. Verification queries ─────────────────────────────────────────────
-- After running, verify with:
SELECT table_name, row_security FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('subscribers', 'ebooks');

-- Expected output:
-- subscribers | OFF
-- ebooks      | OFF
