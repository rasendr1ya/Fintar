"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyAdminPin } from "@/features/auth/actions/admin-pin";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { XMarkIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export function VerifyAdminPinForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await verifyAdminPin(pin);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-xp/10 rounded-full blur-3xl -z-10" />

      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-muted hover:text-text transition-colors"
        >
          <XMarkIcon className="w-8 h-8" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block mb-4">
              <Finny pose="headset" size={120} />
            </div>
            <h1 className="text-3xl font-black text-text mb-2 tracking-tight">
              Verifikasi Admin
            </h1>
            <p className="text-muted text-lg">Masukkan PIN admin kamu</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border-2 border-white shadow-xl rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-500">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6 digit PIN"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-center text-2xl tracking-[0.5em]"
                  />
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading} size="lg" className="mt-2 shadow-lg shadow-primary/20">
                VERIFY
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
