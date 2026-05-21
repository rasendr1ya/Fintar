-- ============================================================
-- Sprint 21 Mei: UI Polishing — Database Changes
-- ============================================================

-- 1. Tambah admin_role ke profiles
-- 'dev' = Tim Fintar internal, 'practitioner' = dosen/pakar eksternal
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS admin_role TEXT
  CHECK (admin_role IN ('dev', 'practitioner'))
  DEFAULT NULL;

-- 2. Tambah admin_pin ke profiles
-- SHA-256 hash dari 6-digit PIN, untuk 2FA admin login per-session
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS admin_pin TEXT DEFAULT NULL;

-- 3. Tambah published_by ke articles
-- Source of truth untuk publisher identity. Field `author TEXT` lama
-- DIPERTAHANKAN sebagai fallback display name (default "Tim Fintar")
-- supaya artikel lama tanpa published_by tetap bisa ditampilkan.
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS published_by UUID
  REFERENCES profiles(id) ON DELETE SET NULL
  DEFAULT NULL;

-- 4. Index untuk published_by (filter by publisher kemungkinan terjadi)
CREATE INDEX IF NOT EXISTS idx_articles_published_by ON articles(published_by);

-- 5. RLS Note: admin_pin TIDAK boleh dibaca client.
-- Akses hanya via service role di server action verifyAdminPin().
-- Pastikan RLS profiles tidak SELECT * untuk anon/authenticated yang expose admin_pin.
-- Jika RLS existing terlalu permisif, tambahkan policy yang exclude admin_pin
-- (atau pastikan client tidak pernah .select("*") dari profiles tanpa filter kolom).

-- Comments
COMMENT ON COLUMN profiles.admin_role IS 'Jenis admin: dev = Tim Fintar internal, practitioner = pakar eksternal. NULL untuk non-admin.';
COMMENT ON COLUMN profiles.admin_pin IS 'SHA-256 hash 6-digit PIN admin untuk 2FA login. Hanya boleh diakses via service role.';
COMMENT ON COLUMN articles.published_by IS 'UUID profile yang publish artikel. NULL untuk artikel lama, fallback ke field author.';
