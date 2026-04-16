export interface StreakResult {
  newStreak: number;
  lastActiveAt: string;
  shouldReset: boolean;
}

export function calculateNewStreak(
  currentStreak: number,
  lastActiveAt: string | null,
  timezone: string = "Asia/Jakarta"
): StreakResult {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const todayStr = formatter.format(now);
  const today = new Date(todayStr);

  if (!lastActiveAt) {
    return {
      newStreak: 1,
      lastActiveAt: today.toISOString(),
      shouldReset: false,
    };
  }

  const lastActive = new Date(lastActiveAt);
  const lastActiveStr = formatter.format(lastActive);

  if (todayStr === lastActiveStr) {
    return {
      newStreak: currentStreak,
      lastActiveAt: lastActiveAt,
      shouldReset: false,
    };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatter.format(yesterday);

  if (lastActiveStr === yesterdayStr) {
    return {
      newStreak: currentStreak + 1,
      lastActiveAt: today.toISOString(),
      shouldReset: false,
    };
  }

  return {
    newStreak: 1,
    lastActiveAt: today.toISOString(),
    shouldReset: true,
  };
}

export function getHeartsToRefill(
  lastHeartRefillAt: string | null,
  currentHearts: number,
  maxHearts: number,
  _timezone: string = "Asia/Jakarta"
): number {
  if (currentHearts >= maxHearts) return 0;

  if (!lastHeartRefillAt) {
    return maxHearts - currentHearts;
  }

  const now = new Date();
  const lastRefill = new Date(lastHeartRefillAt);
  const diffInHours = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60));

  const hoursToAdd = Math.min(diffInHours, maxHearts - currentHearts);
  return hoursToAdd;
}

export function canRefillHeart(
  lastHeartRefillAt: string | null,
  _timezone: string = "Asia/Jakarta"
): boolean {
  if (!lastHeartRefillAt) return true;

  const now = new Date();
  const lastRefill = new Date(lastHeartRefillAt);
  const diffInHours = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60));

  return diffInHours >= 1;
}

export function getTimeUntilNextHeart(
  lastHeartRefillAt: string | null,
  _timezone: string = "Asia/Jakarta"
): number {
  if (!lastHeartRefillAt) return 0;

  const now = new Date();
  const lastRefill = new Date(lastHeartRefillAt);
  const diffInMs = now.getTime() - lastRefill.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours >= 1) return 0;

  return Math.ceil((1 - diffInHours) * 60);
}
