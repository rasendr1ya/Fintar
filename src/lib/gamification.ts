import { XP_PER_LEVEL, BASE_HEARTS, MAX_HEARTS_CAP } from "@/lib/constants";

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calculateMaxHearts(xp: number): number {
  const level = calculateLevel(xp);
  return Math.min(MAX_HEARTS_CAP, BASE_HEARTS + (level - 1));
}

export function xpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const nextLevelXp = currentLevel * XP_PER_LEVEL;
  return nextLevelXp - xp;
}

export function xpProgressInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
