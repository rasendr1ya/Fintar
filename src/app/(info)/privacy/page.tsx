import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - Fintar",
  description: "Kebijakan Privasi platform Fintar",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link href="/" className="text-primary font-semibold hover:underline mb-8 inline-block">
          &larr; Kembali ke Beranda
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
          Kebijakan Privasi
        </h1>
        <p className="text-muted mb-8">Terakhir diperbarui: April 2026</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">1. Pendahuluan</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar menghargai privasi kamu. Kebijakan Privasi ini menjelaskan jenis data yang kami kumpulkan,
              bagaimana kami menggunakan dan melindungi data tersebut, serta hak-hak kamu terkait informasi pribadi.
              Dengan menggunakan Fintar, kamu menyetujui praktik yang dijelaskan dalam kebijakan ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">2. Data yang Kami Kumpulkan</h2>
            <p className="text-text-secondary leading-relaxed mb-3">Kami mengumpulkan beberapa jenis informasi:</p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li><strong>Data Pendaftaran:</strong> Email, username, dan password (terenkripsi) saat kamu membuat akun.</li>
              <li><strong>Data Profil:</strong> Okupasi, tujuan keuangan, dan preferensi yang kamu pilih saat onboarding.</li>
              <li><strong>Data Aktivitas:</strong> Progress belajar, XP, streak, coins, dan interaksi dengan konten edukasi.</li>
              <li><strong>Data Teknis:</strong> Browser, perangkat, alamat IP, dan data penggunaan lainnya yang dikumpulkan secara otomatis.</li>
              <li><strong>Data Komunikasi:</strong> Informasi yang kamu berikan saat menghubungi tim dukungan kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">3. Cara Kami Menggunakan Data</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li>Menyediakan dan memperbaiki layanan platform Fintar.</li>
              <li>Memperpersonalisasi konten dan pengalaman belajar kamu.</li>
              <li>Menghitung dan menampilkan progress, streak, dan leaderboard.</li>
              <li>Mengirimkan notifikasi terkait akun dan aktivitas belajar.</li>
              <li>Menganalisis penggunaan platform untuk peningkatan layanan.</li>
              <li>Memenuhi kewajiban hukum dan melindungi hak kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">4. Penyimpanan dan Keamanan</h2>
            <p className="text-text-secondary leading-relaxed">
              Data kamu disimpan di server yang aman dengan enkripsi. Kami menggunakan Supabase sebagai penyedia
              infrastruktur database dan autentikasi, yang menerapkan standar keamanan industri termasuk enkripsi
              data saat transit dan saat disimpan (at rest). Kami menyimpan data selama akun kamu aktif, atau sesuai
              kebutuhan untuk menyediakan layanan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">5. Berbagi Data</h2>
            <p className="text-text-secondary leading-relaxed">
              Kami tidak menjual data pribadi kamu. Kami hanya berbagi data dalam situasi berikut:
            </p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li><strong>Penyedia Layanan:</strong> Kami menggunakan pihak ketiga untuk hosting, analitik, dan autentikasi yang memproses data sesuai instruksi kami.</li>
              <li><strong>Pengguna lain:</strong> Informasi seperti username dan XP mungkin terlihat di leaderboard publik.</li>
              <li><strong>Kepatuhan Hukum:</strong> Jika diwajibkan oleh hukum atau proses hukum yang sah.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">6. Hak Pengguna</h2>
            <p className="text-text-secondary leading-relaxed">Kamu memiliki hak untuk:</p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-6">
              <li>Mengakses dan mengunduh data pribadi kamu.</li>
              <li>Meminta perbaikan atas data yang tidak akurat.</li>
              <li>Meminta penghapusan akun dan data terkait.</li>
              <li>Menolak pemrosesan data untuk tujuan pemasaran.</li>
              <li>Menarik persetujuan kapan saja (tanpa mengurangi pemrosesan yang dilakukan sebelumnya).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">7. Cookie dan Teknologi Pelacakan</h2>
            <p className="text-text-secondary leading-relaxed">
              Kami menggunakan cookie dan teknologi serupa untuk memastikan platform berfungsi dengan baik,
              mengingat preferensi kamu, dan menganalisis penggunaan. Kamu dapat mengelola preferensi cookie
              melalui pengaturan browser kamu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">8. Privasi Anak</h2>
            <p className="text-text-secondary leading-relaxed">
              Fintar tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak secara sadar mengumpulkan data
              pribadi dari anak di bawah 13 tahun. Jika kami mengetahui bahwa kami telah mengumpulkan data dari
              anak di bawah 13 tahun tanpa persetujuan orang tua, kami akan menghapus data tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">9. Perubahan Kebijakan</h2>
            <p className="text-text-secondary leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan
              diberitahukan melalui platform atau email. Penggunaan platform secara berkelanjutan setelah
              perubahan berlaku merupakan penerimaan kamu terhadap kebijakan yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mt-8 mb-3">10. Kontak</h2>
            <p className="text-text-secondary leading-relaxed">
              Jika kamu memiliki pertanyaan atau permintaan terkait privasi data kamu, silakan hubungi kami di:
            </p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-none pl-0 mt-3">
              <li><strong>Email:</strong> hello@fintar.id</li>
              <li><strong>Alamat:</strong> Fintar - Platform Edukasi Keuangan, Jakarta, Indonesia</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted">
            Lihat juga:{" "}
            <Link href="/terms" className="text-primary font-semibold hover:underline">
              Syarat dan Ketentuan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}