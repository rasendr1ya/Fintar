export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function calculateMaxHearts(xp: number): number {
  const level = calculateLevel(xp);
  return Math.min(15, 5 + (level - 1));
}

export function xpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const nextLevelXp = currentLevel * 100;
  return nextLevelXp - xp;
}

export function xpProgressInCurrentLevel(xp: number): number {
  return xp % 100;
}
