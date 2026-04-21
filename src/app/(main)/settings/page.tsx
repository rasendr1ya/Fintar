import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export const metadata = {
  title: "Settings - Fintar",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-text mb-6">Settings</h1>
      <SettingsForm 
        initialUsername={profile.username} 
        initialEmail={user.email} 
      />
    </div>
  );
}