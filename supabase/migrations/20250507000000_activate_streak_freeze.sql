-- ============================================
-- Fintar — Activate Streak Freeze
-- Migration: 20250507000000
-- Purpose: Add streak_freeze_active to profiles,
--          activate Streak Freeze shop item,
--          set Streak Freeze price to 200 coins
-- ============================================

-- 1. Add streak_freeze_active column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS streak_freeze_active BOOLEAN DEFAULT false;

-- 2. Activate Streak Freeze shop item (if exists)
UPDATE public.shop_items
SET is_active = true
WHERE type = 'STREAK_FREEZE';

-- 3. Ensure Streak Freeze price = 200 coins
UPDATE public.shop_items
SET price_coins = 200
WHERE type = 'STREAK_FREEZE';

-- 4. Seed Streak Freeze shop item (if not exists)
INSERT INTO public.shop_items (name, description, type, price_coins, icon, is_active)
SELECT
  'Streak Freeze',
  'Lindungi streak-mu! Jika kamu melewatkan 1 hari belajar, streak tidak akan hilang.',
  'STREAK_FREEZE',
  200,
  '🧊',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.shop_items WHERE type = 'STREAK_FREEZE'
);
