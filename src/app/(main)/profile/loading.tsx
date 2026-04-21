import { ProfileSkeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProfileSkeleton />
    </div>
  );
}