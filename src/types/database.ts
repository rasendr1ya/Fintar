export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  username: string | null;
  hearts: number;
  xp: number;
  coins: number;
  streak: number;
  financial_goal: string | null;
  occupation: string | null;
  current_unit_id: string | null;
  last_active_at: string | null;
  last_heart_refill_at: string | null;
  timezone: string | null;
  is_admin: boolean;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  color_theme: string | null;
  tags: string[] | null;
  is_deleted: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  order_index: number;
  is_deleted: boolean;
  created_at: string;
}

export interface Challenge {
  id: string;
  lesson_id: string;
  type: "SELECT" | "ASSIST";
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
  is_deleted: boolean;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string | null;
}

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  type: "XP" | "LESSON" | "LOGIN";
  target_value: number;
  reward_xp: number;
  reward_coins: number;
  is_daily: boolean;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  progress: number;
  is_completed: boolean;
  is_claimed: boolean;
  assigned_at: string;
  completed_at: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  type: "HEART_REFILL" | "STREAK_FREEZE" | "XP_BOOST" | "COSMETIC";
  price_coins: number;
  icon: string | null;
  is_active: boolean;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  purchased_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  read_time_minutes: number | null;
  author: string | null;
  is_featured: boolean;
  is_published: boolean;
  is_deleted: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type ChallengeType = "SELECT" | "ASSIST";
export type QuestType = "XP" | "LESSON" | "LOGIN";
export type ShopItemType = "HEART_REFILL" | "STREAK_FREEZE" | "XP_BOOST" | "COSMETIC";
