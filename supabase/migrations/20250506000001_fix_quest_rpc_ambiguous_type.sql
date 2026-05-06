-- ============================================
-- Fintar — Fix RPC: qualify all `type` references
-- Migration: 20250506000001
-- Purpose: Replace get_or_create_daily_quests RPC
--          dengan semua reference `type` di-qualify
--          (q.type) untuk mencegah ambiguous column error
-- ============================================

CREATE OR REPLACE FUNCTION public.get_or_create_daily_quests(p_user_id UUID)
RETURNS TABLE(
  user_quest_id UUID,
  quest_id UUID,
  title TEXT,
  description TEXT,
  type quest_type,
  progress INTEGER,
  target_value INTEGER,
  is_completed BOOLEAN,
  is_claimed BOOLEAN,
  reward_xp INTEGER,
  reward_coins INTEGER
) AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  quest_record RECORD;
  existing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO existing_count
  FROM public.user_quests uq
  WHERE uq.user_id = p_user_id
    AND uq.assigned_at = today_date;

  IF existing_count = 0 THEN
    FOR quest_record IN
      SELECT q.id, q.type FROM public.quests q WHERE q.is_daily = true
    LOOP
      INSERT INTO public.user_quests (user_id, quest_id, progress, is_completed, is_claimed, assigned_at)
      VALUES (p_user_id, quest_record.id, 0, false, false, today_date);

      IF quest_record.type = 'LOGIN' THEN
        UPDATE public.user_quests uq
        SET progress = 1, is_completed = true, completed_at = now()
        WHERE uq.user_id = p_user_id
          AND uq.quest_id = quest_record.id
          AND uq.assigned_at = today_date;
      END IF;
    END LOOP;
  END IF;

  RETURN QUERY
  SELECT
    uq.id AS user_quest_id,
    q.id AS quest_id,
    q.title,
    q.description,
    q.type,
    uq.progress,
    q.target_value,
    uq.is_completed,
    uq.is_claimed,
    q.reward_xp,
    q.reward_coins
  FROM public.user_quests uq
  JOIN public.quests q ON q.id = uq.quest_id
  WHERE uq.user_id = p_user_id
    AND uq.assigned_at = today_date
  ORDER BY uq.is_completed ASC, q.type ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
