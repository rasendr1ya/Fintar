"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyOtp, resendOtp } from "@/features/auth/actions";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { XMarkIcon } from "@heroicons/react/24/outline";

const OTP_LENGTH = 8;

export default function VerifyCodePage() {
  const router = useRouter();
  const pendingEmail = typeof window !== "undefined"
    ? sessionStorage.getItem("pending_verification_email")
    : null;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingEmail) {
      router.push("/register");
    }
  }, [router, pendingEmail]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH - index).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError(`Masukkan kode ${OTP_LENGTH} digit`);
      return;
    }

    setIsLoading(true);
    const email = sessionStorage.getItem("pending_verification_email");

    if (!email) {
      setError("Session expired. Silakan daftar ulang.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", code);

    const result = await verifyOtp(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    sessionStorage.removeItem("pending_verification_email");
    await router.push("/onboarding");
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    const email = sessionStorage.getItem("pending_verification_email");
    if (!email) {
      router.push("/register");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    const result = await resendOtp(formData);
    if (result.error) {
      setError(result.error);
      return;
    }

    setResendCooldown(60);
    setOtp(Array(OTP_LENGTH).fill(""));
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
          href="/register"
          className="px-6 py-2.5 text-sm font-bold text-primary border-2 border-border/50 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-primary-50 hover:border-primary/30 transition-all uppercase tracking-wide shadow-sm"
        >
          Daftar Ulang
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block mb-4 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Finny pose="thinking" size={120} />
            </div>
            <h1 className="text-3xl font-black text-text mb-2 tracking-tight">
              Masukkan Kode
            </h1>
            <p className="text-muted text-lg">Cek email kamu untuk kode {OTP_LENGTH} digit.</p>
          </div>

          {pendingEmail && (
            <div className="mb-6 text-center">
              <p className="text-muted text-sm">
                Dikirim ke <span className="font-bold text-text">{pendingEmail}</span>
              </p>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-xl border-2 border-white shadow-xl rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-1.5" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={OTP_LENGTH}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                size="lg"
                disabled={otp.join("").length !== OTP_LENGTH}
                className="mt-2 shadow-lg shadow-primary/20"
              >
                {isLoading ? "Memverifikasi..." : "VERIFY"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                Tidak menerima kode?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400">Kirim ulang dalam {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary font-bold hover:underline"
                  >
                    Kirim ulang
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}