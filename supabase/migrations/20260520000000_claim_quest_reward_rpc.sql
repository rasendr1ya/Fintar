-- Migration: claim_quest_reward RPC function
-- Sprint 20 — 2026-05-20
--
-- Tujuan: membuat claim quest reward atomic di database level.
-- Mencegah double reward jika user menekan claim berulang atau request berjalan concurrent.

CREATE OR REPLACE FUNCTION public.claim_quest_reward(
  p_user_id UUID,
  p_user_quest_id UUID
)
RETURNS TABLE (
  success      BOOLEAN,
  xp_earned    INTEGER,
  coins_earned INTEGER,
  leveled_up   BOOLEAN,
  error_msg    TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_quest_id     UUID;
  v_is_completed BOOLEAN;
  v_is_claimed   BOOLEAN;
  v_reward_xp    INTEGER;
  v_reward_coins INTEGER;
  v_xp           INTEGER;
  v_coins        INTEGER;
  v_old_level    INTEGER;
  v_new_xp       INTEGER;
  v_new_level    INTEGER;
  v_max_hearts   INTEGER;
BEGIN
  -- Guard: pastikan pemanggil adalah user yang bersangkutan
  IF auth.uid() != p_user_id THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Unauthorized'::TEXT;
    RETURN;
  END IF;

  -- Lock row user_quests agar claim concurrent tidak bisa memberi reward ganda.
  SELECT uq.quest_id, uq.is_completed, uq.is_claimed
  INTO v_quest_id, v_is_completed, v_is_claimed
  FROM public.user_quests uq
  WHERE uq.id = p_user_quest_id
    AND uq.user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Quest not found'::TEXT;
    RETURN;
  END IF;

  IF NOT v_is_completed THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Quest not yet completed'::TEXT;
    RETURN;
  END IF;

  IF v_is_claimed THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Reward already claimed'::TEXT;
    RETURN;
  END IF;

  SELECT q.reward_xp, q.reward_coins
  INTO v_reward_xp, v_reward_coins
  FROM public.quests q
  WHERE q.id = v_quest_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Quest data not found'::TEXT;
    RETURN;
  END IF;

  SELECT p.xp, p.coins
  INTO v_xp, v_coins
  FROM public.profiles p
  WHERE p.id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::INTEGER, 0::INTEGER, FALSE, 'Profile not found'::TEXT;
    RETURN;
  END IF;

  UPDATE public.user_quests
  SET is_claimed = TRUE
  WHERE id = p_user_quest_id
    AND user_id = p_user_id;

  v_new_xp := v_xp + v_reward_xp;
  v_old_level := FLOOR(v_xp / 100.0)::INTEGER + 1;
  v_new_level := FLOOR(v_new_xp / 100.0)::INTEGER + 1;
  v_max_hearts := LEAST(15, 5 + FLOOR(v_new_xp / 100.0)::INTEGER);

  IF v_new_level > v_old_level THEN
    UPDATE public.profiles
    SET
      xp = v_new_xp,
      coins = v_coins + v_reward_coins,
      hearts = v_max_hearts,
      last_heart_refill_at = NOW()
    WHERE id = p_user_id;
  ELSE
    UPDATE public.profiles
    SET
      xp = v_new_xp,
      coins = v_coins + v_reward_coins
    WHERE id = p_user_id;
  END IF;

  RETURN QUERY SELECT TRUE, v_reward_xp, v_reward_coins, (v_new_level > v_old_level), NULL::TEXT;
END;
$$;
