import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { AdminFAB } from "./AdminFAB";

interface AppShellProps {
  children: ReactNode;
  hearts?: number;
  streak?: number;
  coins?: number;
  xp?: number;
  lastHeartRefillAt?: string | null;
  streakFreezeActive?: boolean;
  isAdmin?: boolean;
}

export function AppShell({ 
  children, 
  hearts = 5, 
  streak = 0, 
  coins = 0,
  xp = 0,
  lastHeartRefillAt,
  streakFreezeActive = false,
  isAdmin = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop Sidebar */}
      <Sidebar isAdmin={isAdmin} />

      {/* Main Content Area */}
      <div className="md:ml-64 lg:ml-72">
        {/* Top Bar */}
        <TopBar 
          hearts={hearts} 
          streak={streak} 
          coins={coins} 
          xp={xp}
          lastHeartRefillAt={lastHeartRefillAt}
          streakFreezeActive={streakFreezeActive}
        />

        {/* Page Content */}
        <main className="pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Mobile Admin FAB */}
      {isAdmin && <AdminFAB isAdmin />}
    </div>
  );
}

export default AppShell;
