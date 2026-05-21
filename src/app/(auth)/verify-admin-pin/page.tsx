import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { VerifyAdminPinForm } from "./VerifyAdminPinForm";

export default async function VerifyAdminPinPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (!profile.is_admin) redirect("/learn");

  if (!profile.admin_pin) redirect("/admin");

  return <VerifyAdminPinForm />;
}
