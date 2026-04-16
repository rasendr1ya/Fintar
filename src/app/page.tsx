import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { Logo } from "@/components/branding/Logo";
import { InteractiveFinny } from "@/components/landing/InteractiveFinny";
import { Stars, Moon, CloudSmall, MoneyTree, Fireflies } from "@/components/illustrations";

export const metadata = {
  title: "Fintar - Belajar Keuangan Semudah Main Game",
  description:
    "Master personal finance melalui pembelajaran yang menyenangkan. Dapatkan XP, jaga streak, dan bersaing di leaderboard!",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[100vh] bg-linear-to-b from-[#1e1b4b] via-[#312e81] to-[#4338ca] overflow-hidden flex flex-col">
        {/* Navbar */}
        <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/">
              <Logo size="md" variant="light" />
            </Link>
            <div className="flex items-center gap-3">
              <Button
                href="/login"
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                Masuk
              </Button>
              <Button
                href="/register"
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white border-b-4 border-[#166534] active:border-b-0 active:translate-y-1"
              >
                Daftar
              </Button>
            </div>
          </div>
        </nav>

        {/* Sky decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars className="absolute top-0 left-0 w-full h-40 opacity-70" />
          {/* Moon with glow pulse animation */}
          <Moon className="absolute top-20 right-[5%] w-16 h-16 sm:w-20 sm:h-20 animate-moon-pulse" />
          {/* Clouds with drift animation */}
          <CloudSmall className="absolute top-28 left-[8%] w-24 h-12 opacity-25 animate-cloud-drift" />
          <CloudSmall className="absolute top-40 right-[20%] w-20 h-10 opacity-20 animate-cloud-drift-slow" />
          <CloudSmall className="absolute top-16 left-[40%] w-16 h-8 opacity-15 animate-cloud-drift" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center pb-32 sm:pb-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1]">
                Kuasai Uangmu,
                <br />
                <span className="text-[#FBBF24]">Raih Masa Depan!</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-md">
                Belajar keuangan cuma 5 menit sehari. Seru kayak main game,
                hasilnya nyata di dompet!
              </p>
              <div className="mt-8">
                <Button
                  href="/register"
                  size="lg"
                  className="bg-[#22C55E] hover:bg-[#16A34A] border-b-4 border-[#166534] text-white rounded-2xl"
                >
                  Mulai Gratis
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== GROUNDED SCENE ===== */}
        <div className="absolute bottom-0 left-0 right-0 z-0 h-auto overflow-visible">
          
          {/* 1. Back Hill Layer (Deepest) - Dark Green */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[180px] sm:h-[220px] md:h-[280px] z-0" 
            viewBox="0 0 1440 280" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <path
              d="M0 280V140C200 80 400 100 600 120C800 140 1000 100 1200 80C1300 70 1400 90 1440 110V280H0Z"
              fill="#166534"
            />
          </svg>

          {/* 2. Money Tree (Planted BEHIND Front Hill) */}
          {/* We push it down (bottom value lower) so its roots are hidden by the front hill */}
          <div className="absolute right-[5%] bottom-[40px] sm:bottom-[80px] md:bottom-[100px] z-10 animate-tree-sway">
             <MoneyTree className="w-40 h-56 sm:w-64 sm:h-[350px] md:w-[400px] md:h-[500px] drop-shadow-2xl filter brightness-110" />
             
             {/* Falling Coins from tree */}
             <div className="absolute top-[30%] left-[20%]">
               <div className="w-3 h-3 rounded-full bg-[#FBBF24] border border-[#F59E0B] animate-coin-fall opacity-80" />
             </div>
             <div className="absolute top-[25%] right-[25%]">
               <div className="w-2 h-2 rounded-full bg-[#FBBF24] border border-[#F59E0B] animate-coin-fall-delay-1 opacity-80" />
             </div>
             <div className="absolute top-[35%] left-[40%]">
               <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] border border-[#F59E0B] animate-coin-fall-delay-2 opacity-80" />
             </div>
             <div className="absolute top-[28%] right-[35%]">
               <div className="w-2 h-2 rounded-full bg-[#FBBF24] border border-[#F59E0B] animate-coin-fall-delay-3 opacity-80" />
             </div>
          </div>
          
          {/* Fireflies around the tree */}
          <Fireflies className="absolute right-[2%] bottom-[100px] sm:bottom-[150px] md:bottom-[200px] w-48 h-48 sm:w-64 sm:h-64 z-15 opacity-60" />

          {/* 3. Front Hill Layer (Covering Roots) - Light Green */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[100px] sm:h-[140px] md:h-[180px] z-20" 
            viewBox="0 0 1440 200" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <path
              d="M0 200V120C150 100 350 130 550 110C750 90 950 120 1150 100C1300 85 1400 100 1440 120V200H0Z"
              fill="#22C55E"
            />
          </svg>

          {/* 4. Finny Playground (ON Front Hill) */}
          {/* We lift Finny UP so he runs on the light green grass */}
          <div className="absolute bottom-[95px] sm:bottom-[130px] md:bottom-[160px] w-full z-30 pointer-events-none">
            <div className="animate-finny-run origin-bottom absolute left-1/2">
               {/* Finny Component - Flipped to face running direction (Left) */}
               <div className="transform scale-x-[-1]">
                 <Finny size={130} pose="default" className="drop-shadow-lg sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px]" />
               </div>
            </div>
          </div>


          {/* Grass tufts (Foreground) - with sway animation */}
          <div className="hidden sm:block absolute bottom-[30px] left-[10%] opacity-80 z-25 animate-grass-sway">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M5 30 Q7 15 4 5 Q10 18 12 30" fill="#4ADE80" />
              <path d="M15 30 Q18 10 14 0 Q22 15 25 30" fill="#22C55E" />
              <path d="M28 30 Q30 18 27 8 Q34 20 36 30" fill="#4ADE80" />
            </svg>
          </div>
          {/* Additional grass on the right */}
          <div className="hidden md:block absolute bottom-[35px] right-[25%] opacity-70 z-25 animate-grass-sway-delay">
            <svg width="35" height="25" viewBox="0 0 40 30" fill="none">
              <path d="M5 30 Q7 15 4 5 Q10 18 12 30" fill="#4ADE80" />
              <path d="M15 30 Q18 10 14 0 Q22 15 25 30" fill="#22C55E" />
              <path d="M28 30 Q30 18 27 8 Q34 20 36 30" fill="#4ADE80" />
            </svg>
          </div>
          {/* More grass scattered */}
          <div className="hidden lg:block absolute bottom-[28px] left-[30%] opacity-60 z-25 animate-grass-sway">
            <svg width="30" height="22" viewBox="0 0 40 30" fill="none">
              <path d="M8 30 Q10 18 7 10 Q13 20 16 30" fill="#22C55E" />
              <path d="M22 30 Q25 12 20 3 Q28 16 32 30" fill="#4ADE80" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES - ALTERNATING SECTIONS ===================== */}
      
      {/* Feature 1 */}
      <section className="py-20 md:py-28 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Gamifikasi</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Belajar yang Bikin Ketagihan
              </h2>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Setiap pelajaran selesai, kamu dapat XP. Jaga streak harianmu dan lihat 
                progressmu naik. Rasanya kayak naik level di game favorit!
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-gray-700 font-medium">Daily Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-gray-700 font-medium">XP Points</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center">
                  <Finny size={180} pose="celebrate" className="drop-shadow-lg" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2">
                  <span className="text-2xl font-bold text-primary">+50 XP</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="font-bold text-orange-500">7 hari</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Reversed */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative">
                <div className="w-72 h-auto md:w-80 bg-linear-to-br from-amber-100 to-orange-50 rounded-3xl flex items-center justify-center p-6">
                  {/* Phone mockup with actual quiz UI */}
                  <div className="w-full bg-white rounded-2xl shadow-xl border-4 border-gray-800 overflow-hidden">
                    {/* Phone notch */}
                    <div className="bg-gray-800 h-6 flex items-center justify-center">
                      <div className="w-16 h-3 bg-black rounded-full" />
                    </div>
                    
                    {/* Quiz Header */}
                    <div className="bg-white px-3 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        {/* Close button */}
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs font-bold">✕</span>
                        </div>
                        {/* Progress bar */}
                        <div className="flex-1 mx-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-3/5 bg-[#22C55E] rounded-full" />
                        </div>
                        {/* Hearts */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-red-500 text-sm">❤️</span>
                          <span className="text-xs font-bold text-red-500">5</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quiz Content */}
                    <div className="p-4 space-y-4">
                      {/* Question */}
                      <div className="text-center">
                        <p className="text-gray-800 font-bold text-sm leading-tight">
                          Apa yang dimaksud dengan &quot;Dana Darurat&quot;?
                        </p>
                      </div>
                      
                      {/* Answer Options */}
                      <div className="space-y-2">
                        {/* Option 1 */}
                        <div className="border-2 border-gray-200 rounded-xl p-2.5 flex items-center gap-2 bg-white">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          <span className="text-gray-700 text-xs">Uang untuk belanja bulanan</span>
                        </div>
                        {/* Option 2 - Correct answer (highlighted) */}
                        <div className="border-2 border-[#22C55E] bg-[#22C55E]/10 rounded-xl p-2.5 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-[#22C55E] bg-[#22C55E] flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700 text-xs font-medium">Simpanan untuk keadaan tak terduga</span>
                        </div>
                        {/* Option 3 */}
                        <div className="border-2 border-gray-200 rounded-xl p-2.5 flex items-center gap-2 bg-white">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          <span className="text-gray-700 text-xs">Dana untuk investasi saham</span>
                        </div>
                      </div>
                      
                      {/* Check Answer Button */}
                      <button className="w-full bg-[#22C55E] text-white font-bold py-2.5 rounded-xl border-b-4 border-[#166534] text-sm">
                        CEK JAWABAN
                      </button>
                    </div>
                    
                    {/* Bottom safe area */}
                    <div className="h-3 bg-white" />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg px-3 py-2 text-sm font-medium text-gray-600">
                  Cuma 5 menit ⏱️
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Bite-sized</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Pelajaran Singkat, Hasil Maksimal
              </h2>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Setiap lesson dirancang untuk diselesaikan dalam 5 menit. 
                Pas banget buat di sela-sela aktivitas. Nunggu kopi? Belajar. 
                Di commuter line? Belajar.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">✓</span>
                  Materi terstruktur dari dasar
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">✓</span>
                  Quiz interaktif setiap pelajaran
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">✓</span>
                  Progress tersimpan otomatis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Komunitas</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Belajar Bareng, Lebih Seru
              </h2>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Lihat siapa yang paling rajin belajar di leaderboard mingguan. 
                Challenge teman-temanmu dan jadilah yang teratas!
              </p>
              <div className="mt-6">
                <Button href="/register" variant="outline" size="lg">
                  Lihat Leaderboard
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 md:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-primary px-4 py-3">
                  <p className="text-white font-semibold text-center">🏆 Top Learners</p>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { rank: "🥇", name: "Andi", xp: "2,450" },
                    { rank: "🥈", name: "Budi", xp: "2,180" },
                    { rank: "🥉", name: "Citra", xp: "1,920" },
                    { rank: "4", name: "Kamu?", xp: "—", highlight: true },
                  ].map((user, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-xl ${user.highlight ? 'bg-primary/5 border-2 border-dashed border-primary/30' : ''}`}>
                      <span className="w-8 text-center font-bold text-lg">{user.rank}</span>
                      <span className="flex-1 font-medium text-gray-800">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS - SIMPLIFIED ===================== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mulai dalam 3 Langkah
            </h2>
          </div>

          <div className="relative">
            {/* Connector line - desktop only */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200" />
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-4">
              {[
                { num: "1", title: "Daftar", desc: "Bikin akun gratis dalam 30 detik" },
                { num: "2", title: "Belajar", desc: "Pilih topik dan mulai pelajaran pertama" },
                { num: "3", title: "Praktik", desc: "Terapkan ilmu di kehidupan nyata" },
              ].map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-2xl font-bold text-primary">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-20 md:py-28 bg-linear-to-br from-primary to-[#5B21B6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <InteractiveFinny 
              size={120} 
              defaultPose="waving" 
              hoverPose="celebrate" 
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Mulai Perjalananmu?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
            Gabung dengan ribuan orang yang sudah belajar keuangan dengan cara yang menyenangkan.
          </p>
          <Button
            href="/register"
            size="lg"
            className="bg-white !text-primary hover:bg-white/90 border-b-4 border-white/50 rounded-2xl"
          >
            Daftar Gratis Sekarang
          </Button>
        </div>
      </section>
    </div>
  );
}
