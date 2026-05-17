-- Migration: leaderboard_profiles view
-- Sprint 17 — 2026-05-17
--
-- Tujuan: expose kolom terbatas dari profiles untuk leaderboard query,
-- sehingga leaderboard action tidak perlu memakai service role client.
-- View ini hanya mengexpose data publik: id, username, xp.
-- Kolom sensitif (hearts, coins, financial_goal, is_admin, dll.) tidak diexpose.

CREATE OR REPLACE VIEW public.leaderboard_profiles AS
SELECT
  id,
  username,
  xp
FROM public.profiles;

ALTER VIEW public.leaderboard_profiles OWNER TO postgres;

-- Grant read access ke semua authenticated dan anonymous users
GRANT SELECT ON public.leaderboard_profiles TO anon;
GRANT SELECT ON public.leaderboard_profiles TO authenticated;
