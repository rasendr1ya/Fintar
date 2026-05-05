import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface DummyUser {
  email: string;
  username: string;
  xp: number;
  coins: number;
  streak: number;
}

const dummyUsers: DummyUser[] = [
  { email: "leaderboard1@fintar.test", username: "RizkyMaulana", xp: 4200, coins: 280, streak: 45 },
  { email: "leaderboard2@fintar.test", username: "Putri_Ayu", xp: 3950, coins: 195, streak: 38 },
  { email: "leaderboard3@fintar.test", username: "BudiHartono", xp: 3610, coins: 210, streak: 52 },
  { email: "leaderboard4@fintar.test", username: "SitiNurhaliza", xp: 3280, coins: 175, streak: 30 },
  { email: "leaderboard5@fintar.test", username: "DewiLestari", xp: 2950, coins: 160, streak: 25 },
  { email: "leaderboard6@fintar.test", username: "AgungPrabowo", xp: 2720, coins: 145, streak: 33 },
  { email: "leaderboard7@fintar.test", username: "FitrianiR", xp: 2480, coins: 130, streak: 28 },
  { email: "leaderboard8@fintar.test", username: "HendroWijaya", xp: 2240, coins: 120, streak: 20 },
  { email: "leaderboard9@fintar.test", username: "NiaKurnia", xp: 1980, coins: 105, streak: 17 },
  { email: "leaderboard10@fintar.test", username: "DimasArdian", xp: 1750, coins: 95, streak: 22 },
  { email: "leaderboard11@fintar.test", username: "RinaSafitri", xp: 1520, coins: 88, streak: 15 },
  { email: "leaderboard12@fintar.test", username: "BayuSetiawan", xp: 1310, coins: 75, streak: 12 },
  { email: "leaderboard13@fintar.test", username: "TinaAndriani", xp: 1100, coins: 65, streak: 10 },
  { email: "leaderboard14@fintar.test", username: "FajarNugraha", xp: 870, coins: 50, streak: 8 },
  { email: "leaderboard15@fintar.test", username: "WulanPermata", xp: 640, coins: 40, streak: 5 },
];

async function seedLeaderboardDummy() {
  console.log("🌱 Creating dummy leaderboard users...\n");

  for (const user of dummyUsers) {
    // Step 1: Create auth user (trigger auto-creates profile)
    let userId: string | null = null;

    // Try to create the user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: "fintar123!",
      email_confirm: true,
      user_metadata: { username: user.username },
    });

    if (createError) {
      if (createError.message.includes("already been registered") || createError.status === 422) {
        console.log(`  ⚠️  ${user.email} already exists, looking up...`);
        // Look up existing user by email
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existing = users?.find((u) => u.email === user.email);
        if (existing) {
          userId = existing.id;
        }
      } else {
        console.error(`  ❌ Failed to create ${user.email}:`, createError.message);
        continue;
      }
    } else if (newUser?.user) {
      userId = newUser.user.id;
      console.log(`  ✅ Created ${user.username} (${user.email})`);
    }

    if (!userId) {
      console.log(`  ⛔ Skipping ${user.email} — could not resolve user ID`);
      continue;
    }

    // Step 2: Update profile with XP and other stats
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: user.username,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        onboarding_done: true,
        occupation: "pelajar",
        financial_goal: ["hutang", "investasi", "cashflow", "darurat"][Math.floor(Math.random() * 4)],
        hearts: 5,
      })
      .eq("id", userId);

    if (updateError) {
      console.error(`  ❌ Failed to update profile for ${user.username}:`, updateError.message);
    } else {
      console.log(`     ↳ Profile updated: ${user.xp.toLocaleString("id-ID")} XP | ${user.coins} 🪙 | ${user.streak} 🔥`);
    }
  }

  console.log("\n✅ Leaderboard dummy users created!");
  console.log(`   Run 'npm run dev' and visit /leaderboard to see them.\n`);
}

seedLeaderboardDummy().catch(console.error);
