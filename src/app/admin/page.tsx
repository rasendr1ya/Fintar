import { getAdminStats } from "@/features/admin/actions";
import { Finny } from "@/components/mascot/Finny";
import Link from "next/link";
import {
  DocumentTextIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  CubeIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export const metadata = {
  title: "Dashboard — Admin Fintar",
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  iconColor: string;
}

function StatCard({ title, value, icon: Icon, href, iconColor }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white border border-border rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
    >
      <Icon className={`w-8 h-8 ${iconColor} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-muted">{title}</p>
    </Link>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

function QuickAction({ title, description, href, icon: Icon, iconBgColor, iconColor }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <PlusIcon className="w-5 h-5 text-muted shrink-0" />
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  if ("error" in stats) {
    return (
      <div className="text-center py-12">
        <Finny pose="sad" size={120} />
        <p className="text-hearts mt-4">{stats.error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-finny-light rounded-2xl flex items-center justify-center shrink-0">
          <Finny pose="waving" size={50} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
          <p className="text-muted">Kelola konten Fintar dari sini</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Artikel"
          value={stats.articles}
          icon={DocumentTextIcon}
          href="/admin/blog"
          iconColor="text-success"
        />
        <StatCard
          title="Unit"
          value={stats.units ?? 0}
          icon={CubeIcon}
          href="/admin/lessons"
          iconColor="text-primary"
        />
        <StatCard
          title="Lesson"
          value={stats.lessons}
          icon={AcademicCapIcon}
          href="/admin/lessons"
          iconColor="text-xp"
        />
        <StatCard
          title="Challenge"
          value={stats.challenges}
          icon={QuestionMarkCircleIcon}
          href="/admin/lessons"
          iconColor="text-streak"
        />
        <StatCard
          title="Pengguna"
          value={stats.users}
          icon={UserGroupIcon}
          href="/admin"
          iconColor="text-coins"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-text mb-4">Aksi Cepat</h2>
        <div className="space-y-3">
          <QuickAction
            title="Buat Artikel Baru"
            description="Tulis konten edukasi untuk blog"
            href="/admin/blog/new"
            icon={DocumentTextIcon}
            iconBgColor="bg-success/10"
            iconColor="text-success"
          />
          <QuickAction
            title="Tambah Unit Belajar"
            description="Buat modul pembelajaran baru"
            href="/admin/lessons"
            icon={AcademicCapIcon}
            iconBgColor="bg-xp/10"
            iconColor="text-xp"
          />
        </div>
      </div>

      <div className="bg-finny-light rounded-2xl p-5 flex items-center gap-4">
        <Finny pose="reading" size={70} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text">Tips Admin</p>
          <p className="text-sm text-muted">
            Buat konten yang bite-sized dan engaging. Learners lebih suka pelajaran singkat 5-10 menit!
          </p>
        </div>
      </div>
    </div>
  );
}
