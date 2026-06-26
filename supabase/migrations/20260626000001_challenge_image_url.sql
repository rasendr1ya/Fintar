-- Migration: Add image_url to challenges + create challenge-images bucket
-- Sprint — Challenge Image Support + Admin CRUD Validation

-- 1. Tambah kolom image_url ke tabel challenges (nullable, default null)
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- 2. Buat bucket challenge-images di Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-images', 'challenge-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Policy: Public dapat READ (SELECT) gambar challenge
DROP POLICY IF EXISTS "Public can view challenge images" ON storage.objects;
CREATE POLICY "Public can view challenge images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'challenge-images');

-- 4. RLS Policy: Hanya admin yang dapat INSERT (upload) gambar challenge
DROP POLICY IF EXISTS "Admins can upload challenge images" ON storage.objects;
CREATE POLICY "Admins can upload challenge images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'challenge-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- 5. RLS Policy: Hanya admin yang dapat UPDATE gambar challenge
DROP POLICY IF EXISTS "Admins can update challenge images" ON storage.objects;
CREATE POLICY "Admins can update challenge images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'challenge-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    bucket_id = 'challenge-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- 6. RLS Policy: Hanya admin yang dapat DELETE gambar challenge
DROP POLICY IF EXISTS "Admins can delete challenge images" ON storage.objects;
CREATE POLICY "Admins can delete challenge images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'challenge-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );
