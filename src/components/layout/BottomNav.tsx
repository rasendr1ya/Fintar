"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TrophyIcon,
  UserIcon,
  ShoppingBagIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  TrophyIcon as TrophyIconSolid,
  UserIcon as UserIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  BookOpenIcon as BookOpenIconSolid,
} from "@heroicons/react/24/solid";

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
    label: "Rank",
    icon: TrophyIcon,
    activeIcon: TrophyIconSolid,
  },
  {
    href: "/blog",
    label: "Blog",
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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-primary/70"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
