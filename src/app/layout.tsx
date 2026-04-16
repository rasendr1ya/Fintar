import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Fintar - Belajar Keuangan Semudah Main Game",
  description: "Master personal finance melalui pembelajaran yang menyenangkan. Dapatkan XP, jaga streak, dan bersaing di leaderboard!",
  keywords: ["finance", "learning", "education", "personal finance", "money", "investing"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${nunito.variable} antialiased bg-white text-text`}
      >
        {children}
      </body>
    </html>
  );
}
