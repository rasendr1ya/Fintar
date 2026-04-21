"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

const occupations = [
  { id: "pelajar", label: "Pelajar / Mahasiswa", icon: AcademicCapIcon, highlight: true },
  { id: "karyawan", label: "Karyawan", icon: BriefcaseIcon, highlight: false },
  { id: "freelancer", label: "Freelancer", icon: ComputerDesktopIcon, highlight: false },
  { id: "bisnis", label: "Pemilik Bisnis", icon: BuildingStorefrontIcon, highlight: false },
];

const financialGoals = [
  { id: "hutang", label: "Melunasi Hutang", icon: CurrencyDollarIcon },
  { id: "investasi", label: "Mulai Investasi", icon: CurrencyDollarIcon },
  { id: "cashflow", label: "Mengatur Cash Flow", icon: CurrencyDollarIcon },
  { id: "darurat", label: "Dana Darurat", icon: CurrencyDollarIcon },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selectedOccupation) {
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

    const formData = new FormData();
    formData.append("occupation", selectedOccupation);
    formData.append("financialGoal", selectedGoal);

    const result = await completeOnboarding(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    await router.push("/learn");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-lavender flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Finny
            pose={step === 1 ? "waving" : "thinking"}
            size={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-text">
            {step === 1 ? "Kenalan Dulu Yuk!" : "Apa goal keuangan utamamu?"}
          </h1>
          <p className="text-muted mt-2">
            {step === 1
              ? "Apa kesibukan kamu saat ini?"
              : "Apa tujuan keuangan yang ingin kamu capai?"}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center mb-6 animate-shake">
            {error}
          </div>
        )}

        {/* Step 1: Occupation */}
        {step === 1 && (
          <div className="space-y-3 animate-float">
            <div className="grid grid-cols-1 gap-3">
              {occupations.map((occ) => {
                const Icon = occ.icon;
                const isSelected = selectedOccupation === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => {
                      setSelectedOccupation(occ.id);
                      setError("");
                    }}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                      ${isSelected
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-border hover:border-primary/30 text-text"
                      }
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-white" : "bg-bg"}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold">{occ.label}</span>
                      {occ.highlight && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                          Populer
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6">
              <Button
                fullWidth
                onClick={handleNext}
                disabled={!selectedOccupation}
                size="lg"
              >
                Lanjut
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="space-y-3 animate-float">
            <div className="grid grid-cols-1 gap-3">
              {financialGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      setError("");
                    }}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                      ${isSelected
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-border hover:border-primary/30 text-text"
                      }
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-white" : "bg-bg"}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold">{goal.label}</span>
                    {isSelected && (
                      <svg
                        className="w-6 h-6 text-primary ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
              >
                Kembali
              </Button>
              <div className="flex-1">
                <Button
                  fullWidth
                  onClick={handleComplete}
                  disabled={!selectedGoal || isLoading}
                  size="lg"
                  isLoading={isLoading}
                >
                  Mulai Petualangan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === 1 ? "bg-primary" : "bg-border"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === 2 ? "bg-primary" : "bg-border"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
