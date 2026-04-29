import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MAX_HEARTS_CAP } from "@/lib/constants";
import { calculateMaxHearts } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("id, xp, last_heart_refill_at")
    .lt("hearts", MAX_HEARTS_CAP);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let refilled = 0;

  for (const profile of profiles || []) {
    const maxHearts = calculateMaxHearts(profile.xp);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        hearts: maxHearts,
        last_heart_refill_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error(`Error refilling hearts for profile ${profile.id}:`, updateError);
    } else {
      refilled++;
    }
  }

  return NextResponse.json({ success: true, refilled });
}