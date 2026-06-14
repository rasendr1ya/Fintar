"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminPin } from "@/features/auth/actions/admin-pin";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PIN_LENGTH = 6;

export function VerifyAdminPinForm() {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, PIN_LENGTH - 1));
    inputRefs.current[clamped]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value === "") {
      const newPin = [...pin];
      newPin[index] = "";
      setPin(newPin);
      return;
    }

    const digits = value.replace(/\D/g, "").split("");
    if (digits.length === 0) return;

    const newPin = [...pin];
    let lastFilled = index;

    for (let i = 0; i < digits.length && index + i < PIN_LENGTH; i++) {
      newPin[index + i] = digits[i];
      lastFilled = index + i;
    }

    setPin(newPin);

    const nextIndex = Math.min(lastFilled + 1, PIN_LENGTH - 1);
    if (nextIndex !== index || digits.length >= PIN_LENGTH - index) {
      focusIndex(nextIndex);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (pin[index]) {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
        return;
      }

      if (index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
      return;
    }

    if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
      return;
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const newPin = [...pin];
      newPin[index] = e.key;
      setPin(newPin);
      if (index < PIN_LENGTH - 1) {
        focusIndex(index + 1);
      }
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (pastedData.length === 0) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);
    focusIndex(Math.min(pastedData.length, PIN_LENGTH - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = pin.join("");
    if (code.length !== PIN_LENGTH) {
      setError("Masukkan 6-digit PIN lengkap");
      return;
    }

    setIsLoading(true);
    const result = await verifyAdminPin(code);

    if (result.error) {
      setError(result.error);
      setPin(Array(PIN_LENGTH).fill(""));
      setIsLoading(false);
      focusIndex(0);
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
        <button
          type="button"
          onClick={async () => {
            await import("@/features/auth/actions").then((m) => m.logoutUser());
            router.push("/onboarding");
            router.refresh();
          }}
          className="w-10 h-10 flex items-center justify-center text-muted hover:text-text transition-colors"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
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
                <div className="flex items-center justify-center gap-1.5" onPaste={handlePaste}>
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={(e) => e.target.select()}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 focus:bg-white ${
                        digit
                          ? "border-primary/40 bg-primary-50/30"
                          : "border-gray-300 bg-white"
                      }`}
                    />
                  ))}
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
