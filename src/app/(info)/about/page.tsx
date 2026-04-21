import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { Logo } from "@/components/branding/Logo";

export const metadata = {
  title: "Tentang Fintar - Misi Kami",
  description: "Pelajari tentang Fintar, platform belajar keuangan yang menyenangkan seperti bermain game.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="md" variant="dark" animated={false} />
          </Link>
          <Button href="/register" size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-xl">
            Mulai Gratis
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Finny size={120} pose="celebrate" className="mx-auto drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tentang <span className="text-primary">Fintar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami percaya bahwa belajar keuangan seharusnya menyenangkan, mudah diakses, dan relevan untuk semua orang.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Misi Kami</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 mb-4">
                Literasi Finansial untuk Semua
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Indonesia memiliki tingkat literasi keuangan yang masih rendah. Banyak orang tidak tahu cara mengelola uang, berinvestasi, atau merencanakan masa depan finansial mereka.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Fintar hadir untuk mengubah itu. Dengan pendekatan gamifikasi seperti Duolingo, kami membuat belajar keuangan menjadi <strong>menyenangkan</strong>, <strong>bite-sized</strong>, dan <strong>accessible</strong> untuk siapa saja.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center">
              <div className="text-6xl font-bold text-primary mb-2">5</div>
              <div className="text-gray-600">menit per hari</div>
              <div className="mt-6 text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">gratis untuk memulai</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nilai-Nilai Kami</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎮",
                title: "Fun First",
                desc: "Belajar harus menyenangkan. Jika tidak fun, orang tidak akan konsisten.",
              },
              {
                icon: "🎯",
                title: "Practical",
                desc: "Semua materi bisa langsung diterapkan dalam kehidupan sehari-hari.",
              },
              {
                icon: "🤝",
                title: "Inclusive",
                desc: "Finansial untuk semua, tanpa memandang latar belakang atau pendapatan.",
              },
            ].map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finny Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl p-8 flex items-center justify-center">
                <Finny size={200} pose="waving" className="drop-shadow-lg" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Maskot Kami</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 mb-4">
                Kenalan dengan Finny! 🦊
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Finny adalah rubah yang pintar dan friendly. Dia akan menemanimu di setiap perjalanan belajar keuangan. Dari pelajaran pertama sampai kamu jadi ahli finansial!
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kenapa rubah? Karena rubah dikenal cerdik dan adaptif - sifat yang diperlukan untuk sukses dalam mengelola keuangan!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Perjalananmu?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Bergabung dengan Fintar dan mulai belajar keuangan dengan cara yang menyenangkan!
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" variant="light" animated={false} />
              <p className="mt-4 text-gray-400 text-sm">
                Belajar keuangan semudah main game.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/learn" className="hover:text-white">Mulai Belajar</Link></li>
                <li><Link href="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Fintar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}