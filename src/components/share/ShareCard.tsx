"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ShareCardProps {
  username: string;
  xp: number;
  streak: number;
  level: number;
  lessonsCompleted: number;
  onClose: () => void;
}

// X (Twitter) logo component
function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function ShareCard({ 
  username, 
  xp, 
  streak, 
  level, 
  lessonsCompleted,
  onClose 
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    
    setDownloading(true);
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#7C3AED",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `fintar-progress-${username || "user"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Gagal membuat gambar. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      `Saya sudah Level ${level} di Fintar!\n\n🔥 Streak: ${streak} hari\n⭐ XP: ${xp.toLocaleString()}\n📚 Lessons: ${lessonsCompleted}\n\nYuk belajar keuangan bareng!`
    );
    const url = encodeURIComponent("https://fintar.app");
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=550,height=420,noopener,noreferrer"
    );
  };

  // Format XP display
  const formatXP = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  // Get user initial
  const userInitial = (username || "?").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Share Progress</h2>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Card Preview - PURE INLINE STYLES for html2canvas */}
        <div className="p-3 sm:p-4">
          <div 
            ref={cardRef} 
            style={{
              backgroundColor: "#7C3AED",
              borderRadius: "20px",
              padding: "28px 24px",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textAlign: "center",
            }}
          >
            {/* Header Row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}>
                  🦊
                </div>
                <span style={{ fontWeight: 700, fontSize: "20px" }}>Fintar</span>
              </div>
              <div style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
              }}>
                Level {level}
              </div>
            </div>

            {/* Avatar Circle with Initial */}
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#FFFFFF",
              borderRadius: "50%",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 700,
              color: "#7C3AED",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              {userInitial}
            </div>

            {/* Username */}
            <div style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "4px",
            }}>
              {username || "Learner"}
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "24px",
            }}>
              Financial Learner
            </div>

            {/* Stats Row */}
            <div style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}>
              <div style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "14px 8px",
              }}>
                <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "2px" }}>
                  🔥 {streak}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
                  Streak
                </div>
              </div>
              <div style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "14px 8px",
              }}>
                <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "2px" }}>
                  ⭐ {formatXP(xp)}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
                  XP
                </div>
              </div>
              <div style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "14px 8px",
              }}>
                <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "2px" }}>
                  📚 {lessonsCompleted}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
                  Lessons
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "16px",
            }}>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", marginBottom: "4px" }}>
                Belajar keuangan yang seru! 💰
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                fintar.app
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
          <Button
            onClick={handleDownload}
            fullWidth
            disabled={downloading}
            className="flex items-center justify-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {downloading ? "Generating..." : "Download Image"}
          </Button>
          
          <Button
            onClick={handleShareToX}
            variant="outline"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <XLogo className="w-4 h-4" />
            Share to X
          </Button>
        </div>
      </div>
    </div>
  );
}