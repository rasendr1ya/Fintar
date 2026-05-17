-- Migration: buy_heart_refill RPC function
-- Sprint 17 — 2026-05-17
--
-- Tujuan: menggantikan logika check-then-update di application layer
-- dengan operasi atomic di database level menggunakan row-level lock (FOR UPDATE).
-- Mencegah race condition double coin deduction jika user klik beli dua kali cepat.
--
-- Formula max hearts: LEAST(15, 5 + FLOOR(xp / 100.0)::INTEGER)
-- Konsisten dengan calculateMaxHearts() di src/lib/constants.ts

CREATE OR REPLACE FUNCTION public.buy_heart_refill(
  p_user_id UUID,
  p_price INTEGER
)
RETURNS TABLE (
  success     BOOLEAN,
  new_coins   INTEGER,
  new_hearts  INTEGER,
  error_msg   TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coins   INTEGER;
  v_xp      INTEGER;
  v_hearts  INTEGER;
  v_max     INTEGER;
BEGIN
  -- Guard: pastikan pemanggil adalah user yang bersangkutan
  IF auth.uid() != p_user_id THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, 'Unauthorized'::TEXT;
    RETURN;
  END IF;

  -- Lock row untuk mencegah concurrent execution
  SELECT coins, xp, hearts
  INTO v_coins, v_xp, v_hearts
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Guard: profil tidak ditemukan
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, 'Profil tidak ditemukan'::TEXT;
    RETURN;
  END IF;

  -- Guard: saldo coins tidak cukup
  IF v_coins < p_price THEN
    RETURN QUERY SELECT FALSE, v_coins, v_hearts, 'Coins tidak cukup'::TEXT;
    RETURN;
  END IF;

  -- Hitung max hearts berdasarkan XP (konsisten dengan TypeScript)
  v_max := LEAST(15, 5 + FLOOR(v_xp / 100.0)::INTEGER);

  -- Guard: hearts sudah penuh, tidak perlu refill
  IF v_hearts >= v_max THEN
    RETURN QUERY SELECT FALSE, v_coins, v_hearts, 'Hearts sudah penuh'::TEXT;
    RETURN;
  END IF;

  -- Atomic update: coins berkurang, hearts direfill, timestamp direset
  UPDATE public.profiles
  SET
    coins               = coins - p_price,
    hearts              = v_max,
    last_heart_refill_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY SELECT TRUE, (v_coins - p_price)::INTEGER, v_max, NULL::TEXT;
END;
$$;
