import { getCurrentProfile } from "@/lib/supabase/server";

export default async function LearnPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Learn Page</h1>
      <p className="text-gray-600 mt-2">Welcome, {profile?.username || "Learner"}!</p>
    </div>
  );
}
