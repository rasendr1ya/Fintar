import { requireAdmin } from "@/features/admin/actions";
import { AdminSidebar } from "@/features/admin/components";
import { Toaster } from "sonner";

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
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 min-w-0">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster
        position="bottom-right"
        richColors={false}
        toastOptions={{
          duration: 3000,
          classNames: {
            toast:
              "!bg-white !text-[#0F172A] !border !border-[#E2E8F0] !shadow-md !rounded-xl !font-[Nunito,sans-serif]",
            title: "!font-semibold !text-sm",
            description: "!text-xs !text-[#64748B]",
            icon: "!text-[#10B981] [&[data-type=error]]:!text-[#F43F5E]",
          },
        }}
      />
    </div>
  );
}
