import { requireAdmin } from "@/features/admin/actions";
import { AdminSidebar } from "@/features/admin/components";

export const metadata = {
  title: "Admin Panel — Fintar",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
