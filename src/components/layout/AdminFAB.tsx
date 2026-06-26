"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

interface AdminFABProps {
  isAdmin?: boolean;
}

export function AdminFAB({ isAdmin = false }: AdminFABProps) {
  const router = useRouter();
  const pathname = usePathname();
  const fabRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handler = (e: PointerEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const id = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!isAdmin) return null;

  const handleClick = () => {
    if (!open) {
      setOpen(true);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div
      ref={fabRef}
      className="fixed bottom-20 right-0 z-40 md:hidden"
      aria-label="Admin Panel"
      title="Admin Panel"
    >
      <button
        onClick={handleClick}
        aria-label="Admin Panel"
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg ring-2 ring-purple-500 transition-transform duration-300 ease-out active:scale-95 ${
          open ? "-translate-x-4" : "translate-x-[28px]"
        }`}
      >
        <WrenchScrewdriverIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default AdminFAB;
