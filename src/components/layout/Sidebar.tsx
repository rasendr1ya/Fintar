"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TrophyIcon,
  UserIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  TrophyIcon as TrophyIconSolid,
  UserIcon as UserIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
} from "@heroicons/react/24/solid";
import { Logo } from "@/components/branding/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: "/learn",
    label: "Learn",
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    href: "/shop",
    label: "Shop",
    icon: ShoppingBagIcon,
    activeIcon: ShoppingBagIconSolid,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: TrophyIcon,
    activeIcon: TrophyIconSolid,
  },
  {
    href: "/blog",
    label: "Journal",
    icon: BookOpenIcon,
    activeIcon: BookOpenIconSolid,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
];

const adminNavItem: NavItem = {
  href: "/admin",
  label: "Admin Panel",
  icon: WrenchScrewdriverIcon,
  activeIcon: WrenchScrewdriverIconSolid,
};

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen bg-white border-r border-border fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-center">
        <Link href="/learn">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-200
                    ${isActive
                      ? "bg-primary-50 text-primary border-2 border-primary/20"
                      : "text-text-secondary hover:bg-bg hover:text-text"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border space-y-2">
        {isAdmin && (
          <Link
            href={adminNavItem.href}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all duration-200"
          >
            <adminNavItem.icon className="w-6 h-6" />
            <span>{adminNavItem.label}</span>
          </Link>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-text-secondary hover:bg-bg hover:text-text transition-all duration-200"
        >
          <Cog6ToothIcon className="w-6 h-6" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
