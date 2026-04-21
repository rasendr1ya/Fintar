-- ============================================
-- Fintar Initial Database Schema
-- Run this in Supabase SQL Editor or via setup-db script
-- ============================================

-- ─── Custom Enums ───
DO $$ BEGIN
  CREATE TYPE challenge_type AS ENUM ('SELECT', 'ASSIST');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quest_type AS ENUM ('XP', 'LESSON', 'LOGIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE shop_item_type AS ENUM ('HEART_REFILL', 'STREAK_FREEZE', 'XP_BOOST', 'COSMETIC');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Profiles ───
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  hearts INTEGER NOT NULL DEFAULT 5,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  financial_goal TEXT,
  occupation TEXT,
  current_unit_id UUID,
  last_active_at TIMESTAMPTZ,
  last_heart_refill_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  onboarding_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Units ───
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  color_theme TEXT,
  tags TEXT[],
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Lessons ───
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Challenges ───
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type challenge_type NOT NULL DEFAULT 'SELECT',
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- ─── User Progress ───
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- ─── Quests ───
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type quest_type NOT NULL DEFAULT 'LOGIN',
  target_value INTEGER NOT NULL DEFAULT 1,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  reward_coins INTEGER NOT NULL DEFAULT 0,
  is_daily BOOLEAN NOT NULL DEFAULT true
);

-- ─── User Quests ───
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, quest_id, assigned_at)
);

-- ─── Shop Items ───
CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type shop_item_type NOT NULL DEFAULT 'HEART_REFILL',
  price_coins INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ─── User Inventory ───
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Articles ───
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  read_time_minutes INTEGER,
  author TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON public.lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_challenges_lesson_id ON public.challenges(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON public.user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(is_published, is_deleted);

-- ─── Enable RLS on all tables ───
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ───

-- Profiles: users can read/write their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Units: all authenticated users can read
CREATE POLICY "Authenticated users can read units"
  ON public.units FOR SELECT
  USING (auth.role() = 'authenticated');

-- Lessons: all authenticated users can read
CREATE POLICY "Authenticated users can read lessons"
  ON public.lessons FOR SELECT
  USING (auth.role() = 'authenticated');

-- Challenges: all authenticated users can read
CREATE POLICY "Authenticated users can read challenges"
  ON public.challenges FOR SELECT
  USING (auth.role() = 'authenticated');

-- User Progress: users can read/write their own progress
CREATE POLICY "Users can read own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quests: all authenticated users can read
CREATE POLICY "Authenticated users can read quests"
  ON public.quests FOR SELECT
  USING (auth.role() = 'authenticated');

-- User Quests: users can read/write their own quests
CREATE POLICY "Users can read own quests"
  ON public.user_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
  ON public.user_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
  ON public.user_quests FOR UPDATE
  USING (auth.uid() = user_id);

-- Shop Items: all authenticated users can read
CREATE POLICY "Authenticated users can read shop items"
  ON public.shop_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- User Inventory: users can read/write their own inventory
CREATE POLICY "Users can read own inventory"
  ON public.user_inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON public.user_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Articles: all authenticated users can read published articles
CREATE POLICY "Authenticated users can read published articles"
  ON public.articles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── Auto-create profile on signup ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, hearts, xp, coins, streak, onboarding_done, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    5, 0, 0, 0, false, false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── RPC: get_or_create_daily_quests ───
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
      SELECT id, type FROM public.quests WHERE is_daily = true
    LOOP
      INSERT INTO public.user_quests (user_id, quest_id, progress, is_completed, is_claimed, assigned_at)
      VALUES (p_user_id, quest_record.id, 0, false, false, today_date);

      IF quest_record.type = 'LOGIN' THEN
        UPDATE public.user_quests
        SET progress = 1, is_completed = true, completed_at = now()
        WHERE user_id = p_user_id
          AND quest_id = quest_record.id
          AND assigned_at = today_date;
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
  ORDER BY q.type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Updated_at trigger ───
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
