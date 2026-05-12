"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Finny } from "@/components/mascot/Finny";
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
} from "@heroicons/react/24/solid";
import { useState } from "react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    href: "/admin/blog",
    label: "Blog CMS",
    icon: DocumentTextIcon,
    iconActive: DocumentTextIconSolid,
  },
  {
    href: "/admin/lessons",
    label: "Lesson CMS",
    icon: AcademicCapIcon,
    iconActive: AcademicCapIconSolid,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            <Finny pose="default" size={32} />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-lg text-text block leading-tight truncate">Fintar</span>
            <span className="text-xs text-muted">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconActive : item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active
                      ? "bg-primary text-white shadow-md"
                      : "text-muted hover:bg-primary-50 hover:text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/learn"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted hover:bg-gray-100 hover:text-text transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 shrink-0" />
          Kembali ke App
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-xl shadow-md border border-border"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <XMarkIcon className="w-6 h-6 text-text" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-text" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-border min-h-screen flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
