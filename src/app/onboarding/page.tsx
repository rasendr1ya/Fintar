"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

const occupations = [
  { id: "pelajar", label: "Pelajar / Mahasiswa", icon: "📚" },
  { id: "karyawan", label: "Karyawan", icon: "💼" },
  { id: "freelancer", label: "Freelancer", icon: "💻" },
  { id: "bisnis", label: "Pemilik Bisnis", icon: "🏪" },
];

const financialGoals = [
  { id: "hutang", label: "Melunasi Hutang", description: "Kelola dan lunasi semua hutang", icon: "💳" },
  { id: "investasi", label: "Mulai Investasi", description: "Mulai perjalanan investasi", icon: "📈" },
  { id: "cashflow", label: "Mengatur Cash Flow", description: "Atur pemasukan dan pengeluaran", icon: "💰" },
  { id: "darurat", label: "Dana Darurat", description: "Bangun dana darurat", icon: "🛡️" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !selectedOccupation) {
      setError("Pilih okupasi kamu dulu ya!");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleComplete = async () => {
    if (!selectedGoal) {
      setError("Pilih tujuan keuangan kamu dulu!");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await completeOnboarding(selectedOccupation, selectedGoal);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    await router.push("/learn");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-xp/10 rounded-full blur-3xl -z-10" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-300"}`} />
            <div className={`w-12 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-gray-300"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-300"}`} />
          </div>

          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <Finny pose={step === 1 ? "waving" : "celebrate"} size={120} />
            </div>
            <h1 className="text-2xl font-bold text-text">
              {step === 1 ? "Hai! Siapa kamu?" : "Apa tujuan keuanganmu?"}
            </h1>
            <p className="text-muted mt-2">
              {step === 1
                ? "Pilih okupasi yang paling sesuai dengan kamu"
                : "Pilih tujuan yang ingin kamu capai"}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center mb-6 animate-shake">
              {error}
            </div>
          )}

          {/* Step 1: Occupation */}
          {step === 1 && (
            <div className="space-y-3">
              {occupations.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccupation(occ.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedOccupation === occ.id
                      ? "border-primary bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{occ.icon}</span>
                    <span className="font-medium text-text">{occ.label}</span>
                    {selectedOccupation === occ.id && (
                      <svg className="ml-auto w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}

              <Button onClick={handleNext} className="w-full mt-6" size="lg">
                Lanjut
              </Button>
            </div>
          )}

          {/* Step 2: Financial Goal */}
          {step === 2 && (
            <div className="space-y-3">
              {financialGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedGoal === goal.id
                      ? "border-primary bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <div className="font-medium text-text">{goal.label}</div>
                      <div className="text-sm text-muted">{goal.description}</div>
                    </div>
                    {selectedGoal === goal.id && (
                      <svg className="ml-auto w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleBack} variant="secondary" className="flex-1" size="lg">
                  Kembali
                </Button>
                <Button onClick={handleComplete} className="flex-1" isLoading={isLoading} size="lg">
                  Mulai Belajar!
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted mt-8">
            Langkah {step} dari 2
          </p>
        </div>
      </main>
    </div>
  );
}
