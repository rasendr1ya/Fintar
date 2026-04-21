"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/features/auth/actions";
import { InteractiveFinny } from "@/components/landing/InteractiveFinny";
import { Button } from "@/components/ui/Button";
import { XMarkIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("pending_verification_email", email);
    router.push("/verify-code");
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
        <Link
          href="/login"
          className="px-6 py-2.5 text-sm font-bold text-primary border-2 border-border/50 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-primary-50 hover:border-primary/30 transition-all uppercase tracking-wide shadow-sm"
        >
          Masuk
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block mb-4">
              <InteractiveFinny size={120} defaultPose="waving" hoverPose="celebrate" />
            </div>
            <h1 className="text-3xl font-black text-text mb-2 tracking-tight">
              Gabung Fintar
            </h1>
            <p className="text-muted text-lg">Mulai perjalanan finansialmu.</p>
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
                    <UserIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    autoComplete="username"
                    minLength={3}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 chars)"
                    required
                    autoComplete="new-password"
                    minLength={6}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-text placeholder:text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading} size="lg" className="mt-2 shadow-lg shadow-primary/20">
                CREATE ACCOUNT
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Dengan mendaftar, kamu menyetujui{" "}
            <Link href="/terms" className="text-primary font-bold hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-primary font-bold hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </p>
        </div>
      </main>
    </div>
  );
}