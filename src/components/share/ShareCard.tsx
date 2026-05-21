"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  ArrowDownTrayIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

interface ShareCardProps {
  username: string;
  xp: number;
  streak: number;
  level: number;
  lessonsCompleted: number;
  role: string;
  onClose: () => void;
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

// ─── Native Canvas API rendering ──────────────────────────────────────
// Render share card directly via Canvas 2D primitives. No DOM-to-canvas.
// Pixel-perfect across all browsers, no html2canvas alignment quirks.

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 1000;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draw mini Finny mascot at given (cx, cy) where size = total visible width/height in canvas px
function drawFinny(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  // Translate so Finny's 200x200 viewBox is centered at (cx, cy) and scaled to `size`
  ctx.translate(cx - size / 2, cy - size / 2);
  const s = size / 200;
  ctx.scale(s, s);
  // Now drawing in SVG viewBox coords (0..200, 0..200), exact match with Finny.tsx

  // Arms
  ctx.fillStyle = "#F97316";
  ctx.beginPath();
  ctx.ellipse(55, 145, 12, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(145, 145, 12, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#F97316";
  ctx.beginPath();
  ctx.ellipse(100, 150, 45, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  ctx.ellipse(100, 155, 30, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head & Ears (exact SVG path from Finny.tsx — uses Path2D)
  ctx.fillStyle = "#F97316";
  const headPath = new Path2D(
    "M 55 85 A 45 45 0 0 0 145 85 A 45 45 0 0 0 140 55 L 128 18 L 112 52 Q 100 48 88 52 L 72 18 L 60 55 A 45 45 0 0 0 55 85 Z"
  );
  ctx.fill(headPath);

  // Inner ears
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  ctx.moveTo(66, 52);
  ctx.lineTo(72, 30);
  ctx.lineTo(82, 50);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(118, 50);
  ctx.lineTo(128, 30);
  ctx.lineTo(134, 52);
  ctx.closePath();
  ctx.fill();

  // Face mask
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  ctx.ellipse(100, 95, 32, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (normal)
  ctx.fillStyle = "#0F172A";
  ctx.beginPath();
  ctx.arc(83, 78, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(117, 78, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(86, 75, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, 75, 3, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = "#0F172A";
  ctx.beginPath();
  ctx.ellipse(100, 92, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (smile)
  ctx.strokeStyle = "#0F172A";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(90, 105);
  ctx.quadraticCurveTo(100, 113, 110, 105);
  ctx.stroke();

  ctx.restore();
}

function drawFlameIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 20, size / 20);
  ctx.fillStyle = "#FB923C";
  // Heroicons fire path simplified
  const path = new Path2D(
    "M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
  );
  ctx.fill(path, "evenodd");
  ctx.restore();
}

function drawStarIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 20, size / 20);
  ctx.fillStyle = "#FBBF24";
  const path = new Path2D(
    "M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
  );
  ctx.fill(path, "evenodd");
  ctx.restore();
}

function drawBookIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 20, size / 20);
  ctx.fillStyle = "#FFFFFF";
  const path = new Path2D(
    "M10.75 16.82A7.462 7.462 0 0115 15.5c1.33 0 2.597.288 3.75.804V4.804A7.968 7.968 0 0015 4c-1.532 0-2.973.343-4.25.954v11.866zM9.25 4.954A7.968 7.968 0 005 4c-1.33 0-2.597.288-3.75.804v11.5C2.403 15.788 3.67 15.5 5 15.5c1.532 0 2.973.343 4.25.954V4.954z"
  );
  ctx.fill(path);
  ctx.restore();
}

function formatXP(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

interface CardData {
  username: string;
  xp: number;
  streak: number;
  level: number;
  lessonsCompleted: number;
  role: string;
}

// Generate the share card as HTMLCanvasElement using native 2D API
function generateShareCanvas(data: CardData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = "#7C3AED";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.font =
    '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  // ─── Header Row ─────────────────────────────────────
  // Finny logo box (top-left)
  const logoX = 60;
  const logoY = 60;
  const logoSize = 90;
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, logoX, logoY, logoSize, logoSize, 22);
  ctx.fill();
  // Finny visible size: ~66 px in 90 px box (matches preview ratio ~73%)
  drawFinny(ctx, logoX + logoSize / 2, logoY + logoSize / 2, 66);

  // "Fintar" text next to logo
  ctx.fillStyle = "#FFFFFF";
  ctx.font =
    '700 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Fintar", logoX + logoSize + 24, logoY + logoSize / 2);

  // Level badge (top-right)
  const levelText = `Level ${data.level}`;
  ctx.font =
    '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const levelTextWidth = ctx.measureText(levelText).width;
  const levelPadX = 30;
  const levelPadY = 14;
  const levelBoxW = levelTextWidth + levelPadX * 2;
  const levelBoxH = 28 + levelPadY * 2;
  const levelBoxX = CANVAS_WIDTH - 60 - levelBoxW;
  const levelBoxY = logoY + (logoSize - levelBoxH) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  roundRect(ctx, levelBoxX, levelBoxY, levelBoxW, levelBoxH, levelBoxH / 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(levelText, levelBoxX + levelBoxW / 2, levelBoxY + levelBoxH / 2);

  // ─── Avatar Circle (centered) ───────────────────────
  const avatarRadius = 90;
  const avatarCx = CANVAS_WIDTH / 2;
  const avatarCy = 320;

  // Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, avatarRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Initial inside
  const initial = (data.username || "?").charAt(0).toUpperCase();
  ctx.fillStyle = "#7C3AED";
  ctx.font =
    '700 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initial, avatarCx, avatarCy + 4);

  // ─── Username ───────────────────────────────────────
  ctx.fillStyle = "#FFFFFF";
  ctx.font =
    '700 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(data.username || "Learner", CANVAS_WIDTH / 2, 480);

  // ─── Subtitle (role) ────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font =
    '400 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(data.role, CANVAS_WIDTH / 2, 524);

  // ─── Stats Row ──────────────────────────────────────
  const statsY = 580;
  const statsHeight = 160;
  const statsSpacing = 24;
  const statsTotalWidth = CANVAS_WIDTH - 120;
  const statBoxW = (statsTotalWidth - statsSpacing * 2) / 3;

  type StatDef = {
    icon: (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => void;
    value: string;
    label: string;
  };

  const stats: StatDef[] = [
    { icon: drawFlameIcon, value: data.streak.toString(), label: "Streak" },
    { icon: drawStarIcon, value: formatXP(data.xp), label: "XP" },
    { icon: drawBookIcon, value: data.lessonsCompleted.toString(), label: "Lessons" },
  ];

  stats.forEach((stat, i) => {
    const x = 60 + i * (statBoxW + statsSpacing);

    // Box background
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    roundRect(ctx, x, statsY, statBoxW, statsHeight, 28);
    ctx.fill();

    // Icon + value row, centered horizontally
    const iconSize = 44;
    const valueText = stat.value;
    ctx.font =
      '700 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const valueWidth = ctx.measureText(valueText).width;
    const groupWidth = iconSize + 12 + valueWidth;
    const groupStartX = x + (statBoxW - groupWidth) / 2;
    const groupCenterY = statsY + 64;

    // Icon
    stat.icon(ctx, groupStartX + iconSize / 2, groupCenterY, iconSize);

    // Value text
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(valueText, groupStartX + iconSize + 12, groupCenterY);

    // Label
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font =
      '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(stat.label, x + statBoxW / 2, statsY + statsHeight - 32);
  });

  // ─── Divider ────────────────────────────────────────
  const dividerY = 800;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, dividerY);
  ctx.lineTo(CANVAS_WIDTH - 60, dividerY);
  ctx.stroke();

  // ─── Footer ─────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font =
    '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Belajar keuangan yang seru!", CANVAS_WIDTH / 2, 880);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font =
    '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.fillText("fintar.app", CANVAS_WIDTH / 2, 920);

  return canvas;
}

export function ShareCard({
  username,
  xp,
  streak,
  level,
  lessonsCompleted,
  role,
  onClose,
}: ShareCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function"
    ) {
      // Probe with a sample file payload (canShare requires actual data shape)
      try {
        const probe = new File([new Blob()], "probe.png", { type: "image/png" });
        if (navigator.canShare({ files: [probe] })) {
          setCanNativeShare(true);
        }
      } catch {
        // canShare not supported with files
      }
    }
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const data: CardData = { username, xp, streak, level, lessonsCompleted, role };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const canvas = generateShareCanvas(data);
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
      `Saya sudah Level ${level} di Fintar! 🎓\n\n🔥 Streak: ${streak} hari\n⭐ XP: ${xp.toLocaleString()}\n📚 Lessons: ${lessonsCompleted}\n\nYuk belajar keuangan bareng di fintar.app!`
    );
    const url = encodeURIComponent("https://fintar.app");
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=550,height=420,noopener,noreferrer"
    );
  };

  const handleNativeShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const canvas = generateShareCanvas(data);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) {
        alert("Gagal membuat gambar.");
        return;
      }
      const file = new File(
        [blob],
        `fintar-progress-${username || "user"}.png`,
        { type: "image/png" }
      );
      const shareData: ShareData = {
        files: [file],
        title: "Progress Fintar",
        text: `Saya sudah Level ${level} di Fintar! Yuk belajar keuangan bareng.`,
      };
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Sharing tidak didukung di browser ini.");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Native share failed:", error);
      }
    } finally {
      setSharing(false);
    }
  };

  const userInitial = (username || "?").charAt(0).toUpperCase();

  // Mini Finny SVG for HTML preview (logo top-left of card)
  const FinnyLogo = () => (
    <svg width="32" height="32" viewBox="0 0 200 200" style={{ display: "block" }}>
      <ellipse cx="55" cy="145" rx="12" ry="18" fill="#F97316" />
      <ellipse cx="145" cy="145" rx="12" ry="18" fill="#F97316" />
      <ellipse cx="100" cy="150" rx="45" ry="35" fill="#F97316" />
      <ellipse cx="100" cy="155" rx="30" ry="25" fill="#FEF3C7" />
      <path d="M 55 85 A 45 45 0 0 0 145 85 A 45 45 0 0 0 140 55 L 128 18 L 112 52 Q 100 48 88 52 L 72 18 L 60 55 A 45 45 0 0 0 55 85 Z" fill="#F97316" />
      <polygon points="66,52 72,30 82,50" fill="#FEF3C7" />
      <polygon points="118,50 128,30 134,52" fill="#FEF3C7" />
      <ellipse cx="100" cy="95" rx="32" ry="28" fill="#FEF3C7" />
      <circle cx="83" cy="78" r="8" fill="#0F172A" />
      <circle cx="117" cy="78" r="8" fill="#0F172A" />
      <circle cx="86" cy="75" r="3" fill="white" />
      <circle cx="120" cy="75" r="3" fill="white" />
      <ellipse cx="100" cy="92" rx="6" ry="5" fill="#0F172A" />
      <path d="M 90 105 Q 100 113 110 105" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/80 overflow-y-auto p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md overflow-hidden shadow-2xl my-auto">
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

        {/* Card Preview - HTML-only, used for visual preview only */}
        <div className="p-3 sm:p-4">
          <div className="relative bg-primary rounded-3xl p-6 text-white text-center" style={{ backgroundColor: "#7C3AED" }}>
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
                  <FinnyLogo />
                </div>
                <span className="font-bold text-xl">Fintar</span>
              </div>
              <div className="bg-white/20 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                Level {level}
              </div>
            </div>

            {/* Avatar Circle */}
            <div
              className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold shadow-lg"
              style={{ color: "#7C3AED" }}
            >
              {userInitial}
            </div>

            {/* Username */}
            <div className="text-2xl font-bold mb-1">{username || "Learner"}</div>

            {/* Subtitle */}
            <div className="text-sm text-white/70 mb-6">{role}</div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="bg-white/15 rounded-2xl p-3.5">
                <div className="text-xl font-bold mb-0.5 flex items-center justify-center gap-1">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="#FB923C">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span>{streak}</span>
                </div>
                <div className="text-xs text-white/80">Streak</div>
              </div>
              <div className="bg-white/15 rounded-2xl p-3.5">
                <div className="text-xl font-bold mb-0.5 flex items-center justify-center gap-1">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="#FBBF24">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  <span>{formatXP(xp)}</span>
                </div>
                <div className="text-xs text-white/80">XP</div>
              </div>
              <div className="bg-white/15 rounded-2xl p-3.5">
                <div className="text-xl font-bold mb-0.5 flex items-center justify-center gap-1">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="#FFFFFF">
                    <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c1.33 0 2.597.288 3.75.804V4.804A7.968 7.968 0 0015 4c-1.532 0-2.973.343-4.25.954v11.866zM9.25 4.954A7.968 7.968 0 005 4c-1.33 0-2.597.288-3.75.804v11.5C2.403 15.788 3.67 15.5 5 15.5c1.532 0 2.973.343 4.25.954V4.954z" />
                  </svg>
                  <span>{lessonsCompleted}</span>
                </div>
                <div className="text-xs text-white/80">Lessons</div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/20 pt-4">
              <div className="text-sm font-semibold mb-1">Belajar keuangan yang seru!</div>
              <div className="text-xs text-white/55">fintar.app</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
          <Button
            onClick={handleDownload}
            fullWidth
            disabled={downloading}
            className="justify-center flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {downloading ? "Generating..." : "Download Image"}
          </Button>

          <Button
            onClick={handleShareToX}
            variant="outline"
            fullWidth
            className="justify-center flex items-center gap-2"
          >
            <XLogo className="w-4 h-4" />
            Share to X
          </Button>

          {canNativeShare && (
            <Button
              onClick={handleNativeShare}
              variant="outline"
              fullWidth
              disabled={sharing}
              className="justify-center flex items-center gap-2"
            >
              <ArrowUpOnSquareIcon className="w-5 h-5" />
              {sharing ? "Preparing..." : "Share via..."}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
