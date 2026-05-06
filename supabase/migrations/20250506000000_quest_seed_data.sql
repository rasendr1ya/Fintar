-- ============================================
-- Fintar — Quest Seed Data & RPC Fix
-- Migration: 20250506000000
-- Purpose: Seed daily quest templates ke database
--          (seed di migration awal tidak teraplikasi
--           karena migration sudah di-run sebelumnya)
-- ============================================

-- ─── Seed Daily Quest Templates ───
-- Target: mahasiswa/pelajar, tone casual Indonesia

INSERT INTO public.quests (title, description, type, target_value, reward_xp, reward_coins, is_daily)
SELECT
  'Absen Dulu!',
  'Login ke Fintar hari ini dan tandai kehadiranmu',
  'LOGIN',
  1,
  10,
  5,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.quests WHERE type = 'LOGIN' AND is_daily = true
);

INSERT INTO public.quests (title, description, type, target_value, reward_xp, reward_coins, is_daily)
SELECT
  'Satu Langkah Maju',
  'Selesaikan 1 lesson hari ini',
  'LESSON',
  1,
  30,
  10,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.quests WHERE type = 'LESSON' AND is_daily = true
);

INSERT INTO public.quests (title, description, type, target_value, reward_xp, reward_coins, is_daily)
SELECT
  'Kejar Setoran XP',
  'Kumpulkan 30 XP dari belajar hari ini',
  'XP',
  30,
  20,
  8,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.quests WHERE type = 'XP' AND is_daily = true
);
