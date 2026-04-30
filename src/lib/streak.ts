export interface StreakResult {
  newStreak: number;
  lastActiveAt: string;
  shouldReset: boolean;
}

export const DEFAULT_TIMEZONE = "Asia/Jakarta";

/**
 * Helper untuk mendapatkan string tanggal (YYYY-MM-DD) dalam timezone tertentu.
 * Menggunakan Intl.DateTimeFormat untuk menghindari bug timezone naive.
 */
function getDateInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Menghitung streak baru berdasarkan aktivitas terakhir user.
 *
 * Logika:
 * - Null / belum pernah aktif → streak = 1
 * - Terakhir aktif hari ini → streak tetap (tidak dobel increment)
 * - Terakhir aktif kemarin → streak + 1
 * - Terakhir aktif >1 hari lalu → streak reset ke 1
 *
 * Timezone default: Asia/Jakarta. Perbandingan menggunakan calendar day
 * (bukan raw hours) untuk menghindari bug timezone dan daylight saving.
 *
 * Catatan: jika profil user memiliki timezone berbeda, parameter timezone
 * dapat dioverride. Saat ini Fintar hanya mendukung Indonesia (Asia/Jakarta).
 */
export function calculateNewStreak(
  currentStreak: number,
  lastActiveAt: string | null,
  timezone: string = DEFAULT_TIMEZONE
): StreakResult {
  const now = new Date();
  const todayStr = getDateInTimezone(now, timezone);

  if (!lastActiveAt) {
    return {
      newStreak: 1,
      lastActiveAt: now.toISOString(),
      shouldReset: false,
    };
  }

  const lastActive = new Date(lastActiveAt);
  const lastActiveStr = getDateInTimezone(lastActive, timezone);

  if (todayStr === lastActiveStr) {
    return {
      newStreak: currentStreak,
      lastActiveAt: lastActiveAt,
      shouldReset: false,
    };
  }

  // Hitung kemarin dalam timezone target
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getDateInTimezone(yesterday, timezone);

  if (lastActiveStr === yesterdayStr) {
    return {
      newStreak: currentStreak + 1,
      lastActiveAt: now.toISOString(),
      shouldReset: false,
    };
  }

  return {
    newStreak: 1,
    lastActiveAt: now.toISOString(),
    shouldReset: true,
  };
}
