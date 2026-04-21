import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    .lt("hearts", 15);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let count = 0;

  for (const profile of profiles || []) {
    const maxHearts = Math.min(15, 5 + Math.floor(profile.xp / 100));

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ hearts: maxHearts })
      .eq("id", profile.id);

    if (!updateError) count++;
  }

  return NextResponse.json({ success: true, count });
}