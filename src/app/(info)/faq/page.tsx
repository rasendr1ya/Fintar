import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { Logo } from "@/components/branding/Logo";

export const metadata = {
  title: "FAQ - Pertanyaan yang Sering Diajukan | Fintar",
  description: "Temukan jawaban untuk pertanyaan yang sering diajukan tentang Fintar.",
};

const faqs = [
  {
    category: "Umum",
    questions: [
      {
        q: "Apa itu Fintar?",
        a: "Fintar adalah platform belajar keuangan yang menggunakan pendekatan gamifikasi seperti Duolingo. Kamu bisa belajar tentang mengelola uang, investasi, dan perencanaan keuangan dengan cara yang menyenangkan dan bite-sized.",
      },
      {
        q: "Apakah Fintar gratis?",
        a: "Ya! Fintar 100% gratis untuk memulai. Kamu bisa mengakses semua pelajaran dasar tanpa biaya. Kami mungkin akan menambahkan fitur premium di masa depan, tapi core learning experience akan selalu gratis.",
      },
      {
        q: "Siapa yang cocok menggunakan Fintar?",
        a: "Fintar cocok untuk siapa saja yang ingin belajar keuangan, baik pemula yang baru mulai kerja, mahasiswa, atau siapapun yang ingin meningkatkan literasi finansialnya.",
      },
    ],
  },
  {
    category: "Belajar",
    questions: [
      {
        q: "Berapa lama waktu yang dibutuhkan untuk belajar setiap hari?",
        a: "Setiap pelajaran dirancang untuk diselesaikan dalam 5 menit. Kamu bisa belajar kapan saja - saat menunggu kopi, di commuter line, atau sebelum tidur!",
      },
      {
        q: "Apa itu XP dan bagaimana cara mendapatkannya?",
        a: "XP (Experience Points) adalah poin yang kamu dapatkan setiap menyelesaikan pelajaran atau quiz. Semakin banyak XP, semakin tinggi levelmu di leaderboard!",
      },
      {
        q: "Apa yang terjadi jika hearts saya habis?",
        a: "Jika hearts habis, kamu perlu menunggu untuk regenerasi atau membeli refill di Shop menggunakan coins yang sudah dikumpulkan. Hearts mencegah kamu buru-buru dan memastikan kamu benar-benar memahami materi.",
      },
      {
        q: "Bagaimana cara menjaga streak?",
        a: "Streak dihitung berdasarkan hari berturut-turut kamu belajar. Selesaikan minimal satu pelajaran setiap hari untuk menjaga streak-mu tetap menyala!",
      },
    ],
  },
  {
    category: "Akun",
    questions: [
      {
        q: "Bagaimana cara membuat akun?",
        a: "Klik tombol 'Daftar' di halaman utama, masukkan email dan password, lalu ikuti langkah onboarding untuk personalisasi pengalamanmu.",
      },
      {
        q: "Apakah data saya aman?",
        a: "Keamanan datamu adalah prioritas kami. Kami menggunakan enkripsi standar industri dan tidak pernah menjual data penggunamu ke pihak ketiga.",
      },
      {
        q: "Bagaimana cara menghapus akun saya?",
        a: "Kamu bisa menghapus akun melalui halaman Settings. Semua data akan dihapus permanen dalam 30 hari setelah permintaan.",
      },
    ],
  },
];

export default function FAQPage() {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Finny size={100} pose="thinking" className="mx-auto drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-xl text-gray-600">
            Punya pertanyaan? Kami punya jawabannya!
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, i) => (
            <div key={i} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {i + 1}
                </span>
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, j) => (
                  <details
                    key={j}
                    className="group bg-gray-50 rounded-2xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-100 transition-colors">
                      <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                      <span className="text-primary text-xl group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Finny size={80} pose="waving" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Masih punya pertanyaan?
          </h2>
          <p className="text-gray-600 mb-6">
            Jangan ragu untuk menghubungi kami!
          </p>
          <Button
            href="mailto:hello@fintar.id"
            variant="outline"
            className="rounded-xl"
          >
            Hubungi Kami
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" variant="light" animated={false} />
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/about" className="hover:text-white">Tentang</Link>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Fintar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}