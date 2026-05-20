-- Migration: blog-images storage RLS policies
-- Sprint 20 — 2026-05-20
--
-- Bucket blog-images sudah ada. Migration ini hanya membuat policy akses object.

DROP POLICY IF EXISTS "blog_images_public_read" ON storage.objects;
CREATE POLICY "blog_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog_images_admin_insert" ON storage.objects;
CREATE POLICY "blog_images_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "blog_images_admin_update" ON storage.objects;
CREATE POLICY "blog_images_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "blog_images_admin_delete" ON storage.objects;
CREATE POLICY "blog_images_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );
