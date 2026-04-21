import Link from "next/link";

export const metadata = {
  title: "Syarat dan Ketentuan - Fintar",
  description: "Syarat dan Ketentuan penggunaan platform Fintar",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link href="/" className="text-primary font-semibold hover:underline mb-8 inline-block">
          &larr; Kembali ke Beranda
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
          Syarat dan Ketentuan
        </h1>
        <p className="text-muted mb-8">Terakhir diperbarui: April 2026</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">1. Penerimaan Syarat</h2>
            <p className="text-text-secondary leading-relaxed">
              Dengan mengakses dan menggunakan Fintar, kamu menyetujui untuk terikat oleh syarat dan ketentuan ini.
              Jika kamu tidak menyetujui syarat-syarat ini, mohon untuk tidak menggunakan platform kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">2. Tentang Fintar</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar adalah platform edukasi literasi keuangan bergamifikasi. Konten yang disediakan di platform ini
              bersifat edukatif dan <strong>bukan merupakan saran keuangan profesional</strong>. Fintar tidak memberikan
              rekomendasi investasi, perencanaan keuangan personal, atau konsultasi finansial individual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">3. Akun Pengguna</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li>Kamu harus berusia minimal 13 tahun untuk membuat akun.</li>
              <li>Kamu bertanggung jawab atas kerahasiaan informasi akun kamu.</li>
              <li>Informasi yang kamu berikan saat pendaftaran harus akurat dan lengkap.</li>
              <li>Fintar berhak menangguhkan atau menutup akun yang melanggar ketentuan ini.</li>
              <li>Satu orang hanya boleh memiliki satu akun aktif.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">4. Penggunaan Platform</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li>Kamu setuju untuk menggunakan Fintar hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini.</li>
              <li>Dilarang menggunakan platform untuk aktivitas yang merugikan, melanggar hukum, atau mengganggu pengguna lain.</li>
              <li>Dilarang melakukan otomatisasi, scraping, atau ekstraksi data dari platform tanpa izin tertulis.</li>
              <li>Kamu tidak boleh memanipulasi sistem gamifikasi (XP, streak, leaderboard, dll.) dengan cara yang tidak sah.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">5. Konten Pihak Ketiga</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar mungkin berisi tautan ke situs web, produk, atau layanan pihak ketiga. Fintar tidak bertanggung jawab
              atas ketersediaan, akurasi, atau keamanan konten pihak ketiga tersebut. Penggunaan konten pihak ketiga
              merupakan tanggung jawab kamu sendiri.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">6. Konten Edukasi</h2>
            <p className="text-text-secondary leading-relaxed">
              Konten edukasi di Fintar disusun untuk tujuan pembelajaran umum. Meskipun kami berusaha memberikan
              informasi yang akurat, Fintar tidak menjamin kelengkapan atau keakuratan konten. Selalu konsultasikan
              keputusan keuangan penting dengan profesional keuangan bersertifikat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">7. Hak Kekayaan Intelektual</h2>
            <p className="text-text-secondary leading-relaxed">
              Semua konten di Fintar, termasuk teks, grafik, logo, ikon, gambar, klip audio, konten digital,
              dan perangkat lunak, adalah milik Fintar atau pemberi lisensinya dan dilindungi oleh hukum hak cipta
              Indonesia. Kamu tidak boleh menyalin, memodifikasi, mendistribusikan, atau membuat karya turunan
              dari konten kami tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">8. Batasan Tanggung Jawab</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial
              yang timbul dari penggunaan atau ketidakmampuan menggunakan platform. Ini termasuk, namun tidak terbatas
              pada, kerugian finansial yang mungkin timbul dari pengambilan keputusan berdasarkan konten edukasi kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">9. Perubahan Ketentuan</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku setelah dipublikasikan
              di platform. Penggunaan platform secara berkelanjutan setelah perubahan berlaku merupakan penerimaan
              kamu terhadap ketentuan yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">10. Hubungi Kami</h2>
            <p className="text-text-secondary leading-relaxed">
              Jika kamu memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui
              email di <strong>hello@fintar.id</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted">
            Lihat juga:{" "}
            <Link href="/privacy" className="text-primary font-semibold hover:underline">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}