import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ─── Fixed UUIDs for idempotent upsert ───
const UNIT_IDS = {
  unit1: "a1b2c3d4-0001-4000-8000-000000000001",
  unit2: "a1b2c3d4-0002-4000-8000-000000000002",
  unit3: "a1b2c3d4-0003-4000-8000-000000000003",
};

const LESSON_IDS: Record<string, string> = {};
for (let u = 1; u <= 3; u++) {
  for (let l = 1; l <= 5; l++) {
    LESSON_IDS[`u${u}l${l}`] = `b2c3d4e5-000${u}-4000-8000-0000000${u}0${l}00`;
  }
}

const QUEST_IDS = {
  login: "c3d4e5f6-0001-4000-8000-000000000001",
  xp50: "c3d4e5f6-0002-4000-8000-000000000002",
  lesson2: "c3d4e5f6-0003-4000-8000-000000000003",
};

const SHOP_IDS = {
  heartRefill: "d4e5f6a7-0001-4000-8000-000000000001",
  streakFreeze: "d4e5f6a7-0002-4000-8000-000000000002",
};

const ARTICLE_IDS = {
  danaDarurat: "e5f6a7b8-0001-4000-8000-000000000001",
  budgeting503020: "e5f6a7b8-0002-4000-8000-000000000002",
  reksadana: "e5f6a7b8-0003-4000-8000-000000000003",
};

async function seed() {
  console.log("🌱 Starting Fintar seed data (idempotent)...\n");

  // ─── Units ───
  console.log("📦 Seeding units...");
  const { data: units, error: unitsError } = await supabase
    .from("units")
    .upsert(
      [
        {
          id: UNIT_IDS.unit1,
          title: "Dasar Keuangan Mahasiswa",
          description: "Budgeting uang saku & catat pengeluaran harian",
          order_index: 1,
          color_theme: "#7C3AED",
          tags: ["basics", "budgeting", "debt"],
          is_deleted: false,
        },
        {
          id: UNIT_IDS.unit2,
          title: "Mulai Menabung",
          description: "Bangun dana darurat & kebiasaan menabung",
          order_index: 2,
          color_theme: "#22C55E",
          tags: ["basics", "banking", "savings"],
          is_deleted: false,
        },
        {
          id: UNIT_IDS.unit3,
          title: "Investasi Pertamamu",
          description: "Kenali reksadana & mulai investasi dari nol",
          order_index: 3,
          color_theme: "#F59E0B",
          tags: ["investing", "stocks", "property"],
          is_deleted: false,
        },
      ],
      { onConflict: "id" }
    )
    .select();

  if (unitsError) {
    console.error("Error seeding units:", unitsError);
    process.exit(1);
  }
  console.log(`  ✅ ${units!.length} units upserted`);

  // ─── Lessons ───
  console.log("📚 Seeding lessons...");
  const lessonsData = [
    { id: LESSON_IDS.u1l1, unit_id: UNIT_IDS.unit1, title: "Apa Itu Keuangan Pribadi?", order_index: 1, is_deleted: false },
    { id: LESSON_IDS.u1l2, unit_id: UNIT_IDS.unit1, title: "Uang Saku: Masuk & Keluar", order_index: 2, is_deleted: false },
    { id: LESSON_IDS.u1l3, unit_id: UNIT_IDS.unit1, title: "Aturan 50/30/20 Versi Mahasiswa", order_index: 3, is_deleted: false },
    { id: LESSON_IDS.u1l4, unit_id: UNIT_IDS.unit1, title: "Mencatat Pengeluaran dengan Benar", order_index: 4, is_deleted: false },
    { id: LESSON_IDS.u1l5, unit_id: UNIT_IDS.unit1, title: "Bedakan Kebutuhan & Keinginan", order_index: 5, is_deleted: false },
    { id: LESSON_IDS.u2l1, unit_id: UNIT_IDS.unit2, title: "Kenapa Harus Menabung?", order_index: 1, is_deleted: false },
    { id: LESSON_IDS.u2l2, unit_id: UNIT_IDS.unit2, title: "Emergency Fund Versi Mahasiswa", order_index: 2, is_deleted: false },
    { id: LESSON_IDS.u2l3, unit_id: UNIT_IDS.unit2, title: "Bikin Rekening Terpisah", order_index: 3, is_deleted: false },
    { id: LESSON_IDS.u2l4, unit_id: UNIT_IDS.unit2, title: "Tips Nabung dengan Uang Saku Terbatas", order_index: 4, is_deleted: false },
    { id: LESSON_IDS.u2l5, unit_id: UNIT_IDS.unit2, title: "Menabung vs Investasi: Kapan Mulai?", order_index: 5, is_deleted: false },
    { id: LESSON_IDS.u3l1, unit_id: UNIT_IDS.unit3, title: "Apa Itu Investasi?", order_index: 1, is_deleted: false },
    { id: LESSON_IDS.u3l2, unit_id: UNIT_IDS.unit3, title: "Reksadana Pasar Uang: Mulai dari Rp10.000", order_index: 2, is_deleted: false },
    { id: LESSON_IDS.u3l3, unit_id: UNIT_IDS.unit3, title: "Bunga Majemuk: Sahabat Waktu Kamu", order_index: 3, is_deleted: false },
    { id: LESSON_IDS.u3l4, unit_id: UNIT_IDS.unit3, title: "Risiko vs Return: Jangan Serakah!", order_index: 4, is_deleted: false },
    { id: LESSON_IDS.u3l5, unit_id: UNIT_IDS.unit3, title: "Langkah Pertama Investasi untuk Mahasiswa", order_index: 5, is_deleted: false },
  ];

  const { error: lessonsError } = await supabase
    .from("lessons")
    .upsert(lessonsData, { onConflict: "id" });

  if (lessonsError) {
    console.error("Error seeding lessons:", lessonsError);
    process.exit(1);
  }
  console.log(`  ✅ ${lessonsData.length} lessons upserted`);

  // ─── Challenges ───
  console.log("🎯 Seeding challenges...");
  const challengesData: any[] = [];

  const challengeId = (unit: number, lesson: number, idx: number) =>
    `f6a7b8c9-000${unit}-4000-8000-00000${unit}${lesson}0${idx}000`;

  // Unit 1, Lesson 1
  challengesData.push(
    { id: challengeId(1,1,1), lesson_id: LESSON_IDS.u1l1, type: "SELECT", question: "Apa yang dimaksud dengan keuangan pribadi?", options: JSON.stringify(["Mengelola uang milik perusahaan", "Mengelola uang dan keputusan keuangan kamu sendiri", "Mengelola uang orang tua", "Mengelola uang negara"]), correct_answer: "Mengelola uang dan keputusan keuangan kamu sendiri", order_index: 1, is_deleted: false },
    { id: challengeId(1,1,2), lesson_id: LESSON_IDS.u1l1, type: "SELECT", question: "Mengapa literasi keuangan penting untuk mahasiswa?", options: JSON.stringify(["Biar bisa jadi trader saham", "Supaya bisa mengatur uang saku dengan bijak dan mempersiapkan masa depan", "Karena dosen minta", "Tidak penting, nanti juga belajar sendiri"]), correct_answer: "Supaya bisa mengatur uang saku dengan bijak dan mempersiapkan masa depan", order_index: 2, is_deleted: false },
    { id: challengeId(1,1,3), lesson_id: LESSON_IDS.u1l1, type: "SELECT", question: "Manakah yang BUKAN termasuk aspek keuangan pribadi?", options: JSON.stringify(["Pengeluaran", "Tabungan", "Nama panggilan", "Pendapatan"]), correct_answer: "Nama panggilan", order_index: 3, is_deleted: false },
    { id: challengeId(1,1,4), lesson_id: LESSON_IDS.u1l1, type: "SELECT", question: "Apa risiko jika tidak paham keuangan pribadi?", options: JSON.stringify(["Bisa kaya mendadak", "Habit hidup di atas kemampuan dan terlilit hutang", "Tidak ada risiko", "Otomatis jadi karyawan"]), correct_answer: "Habit hidup di atas kemampuan dan terlilit hutang", order_index: 4, is_deleted: false },
    { id: challengeId(1,1,5), lesson_id: LESSON_IDS.u1l1, type: "SELECT", question: "Kapan waktu terbaik mulai belajar keuangan pribadi?", options: JSON.stringify(["Sudah kerja saja", "Saat sudah punya hutang", "Saat masih muda, termasuk masa kuliah", "Tidak perlu belajar"]), correct_answer: "Saat masih muda, termasuk masa kuliah", order_index: 5, is_deleted: false },
  );

  // Unit 1, Lesson 2
  challengesData.push(
    { id: challengeId(1,2,1), lesson_id: LESSON_IDS.u1l2, type: "SELECT", question: "Uang saku bulanan kamu Rp1.500.000. Setelah bayar kos Rp500.000, sisanya berapa?", options: JSON.stringify(["Rp1.000.000", "Rp1.500.000", "Rp500.000", "Rp2.000.000"]), correct_answer: "Rp1.000.000", order_index: 1, is_deleted: false },
    { id: challengeId(1,2,2), lesson_id: LESSON_IDS.u1l2, type: "SELECT", question: "Apa yang dimaksud dengan 'cash flow'?", options: JSON.stringify(["Arus uang masuk dan keluar", "Jumlah uang di bank", "Hutang yang harus dibayar", "Gaji tiap bulan"]), correct_answer: "Arus uang masuk dan keluar", order_index: 2, is_deleted: false },
    { id: challengeId(1,2,3), lesson_id: LESSON_IDS.u1l2, type: "SELECT", question: "Contoh pengeluaran tetap (fixed expense) untuk mahasiswa adalah?", options: JSON.stringify(["Makan di café", "Jajan boba", "Bayar kos", "Nonton bioskop"]), correct_answer: "Bayar kos", order_index: 3, is_deleted: false },
    { id: challengeId(1,2,4), lesson_id: LESSON_IDS.u1l2, type: "SELECT", question: "Jika pemasukan < pengeluaran, maka kamu mengalami?", options: JSON.stringify(["Surplus", "Defisit", "Break even", "Investasi"]), correct_answer: "Defisit", order_index: 4, is_deleted: false },
    { id: challengeId(1,2,5), lesson_id: LESSON_IDS.u1l2, type: "SELECT", question: "Apa cara terbaik untuk mengetahui kemana uang saku kamu pergi?", options: JSON.stringify(["Ikuti saja", "Catat semua pengeluaran", "Simpan di bantal", "Transfer ke teman"]), correct_answer: "Catat semua pengeluaran", order_index: 5, is_deleted: false },
  );

  // Unit 1, Lesson 3
  challengesData.push(
    { id: challengeId(1,3,1), lesson_id: LESSON_IDS.u1l3, type: "SELECT", question: "Dalam aturan 50/30/20, angka 50 artinya?", options: JSON.stringify(["50% untuk tabungan", "50% untuk kebutuhan", "50% untuk hiburan", "50% untuk investasi"]), correct_answer: "50% untuk kebutuhan", order_index: 1, is_deleted: false },
    { id: challengeId(1,3,2), lesson_id: LESSON_IDS.u1l3, type: "SELECT", question: "Uang saku Rp1.000.000/bulan. Berapa yang sebaiknya dialokasikan untuk kebutuhan (needs)?", options: JSON.stringify(["Rp500.000", "Rp300.000", "Rp200.000", "Rp1.000.000"]), correct_answer: "Rp500.000", order_index: 2, is_deleted: false },
    { id: challengeId(1,3,3), lesson_id: LESSON_IDS.u1l3, type: "SELECT", question: "Contoh kebutuhan (needs) mahasiswa adalah?", options: JSON.stringify(["Makan di restoran mahal", "Kopi boba tiap hari", "Biaya print tugas akhir", "Beli game baru"]), correct_answer: "Biaya print tugas akhir", order_index: 3, is_deleted: false },
    { id: challengeId(1,3,4), lesson_id: LESSON_IDS.u1l3, type: "SELECT", question: "Berapa persen yang sebaiknya ditabung menurut aturan 50/30/20?", options: JSON.stringify(["50%", "30%", "20%", "10%"]), correct_answer: "20%", order_index: 4, is_deleted: false },
    { id: challengeId(1,3,5), lesson_id: LESSON_IDS.u1l3, type: "SELECT", question: "Versi mahasiswa dari 50/30/20 bisa disesuaikan. Jika uang saku terbatas, prioritas pertama?", options: JSON.stringify(["Hiburan", "Kebutuhan pokok", "Investasi saham", "Beli gadget baru"]), correct_answer: "Kebutuhan pokok", order_index: 5, is_deleted: false },
  );

  // Unit 1, Lesson 4
  challengesData.push(
    { id: challengeId(1,4,1), lesson_id: LESSON_IDS.u1l4, type: "SELECT", question: "Apa tujuan utama mencatat pengeluaran?", options: JSON.stringify(["Menghakimi diri sendiri", "Mengetahui pola pengeluaran dan mengatur keuangan", "Buat conten sosmed", "Mengikuti tren"]), correct_answer: "Mengetahui pola pengeluaran dan mengatur keuangan", order_index: 1, is_deleted: false },
    { id: challengeId(1,4,2), lesson_id: LESSON_IDS.u1l4, type: "SELECT", question: "Metode pencatatan pengeluaran yang paling praktis untuk mahasiswa?", options: JSON.stringify(["Tulis di kertas lalu buang", "Pakai aplikasi di smartphone", "Simpan di kepala aja", "Tidak perlu mencatat"]), correct_answer: "Pakai aplikasi di smartphone", order_index: 2, is_deleted: false },
    { id: challengeId(1,4,3), lesson_id: LESSON_IDS.u1l4, type: "SELECT", question: "Kategori pengeluaran yang sering luput dicatat mahasiswa?", options: JSON.stringify(["Bayar kos", "Jajan kecil (kopi, cemilan)", "Biaya SKS", "Uang parkir kendaraan"]), correct_answer: "Jajan kecil (kopi, cemilan)", order_index: 3, is_deleted: false },
    { id: challengeId(1,4,4), lesson_id: LESSON_IDS.u1l4, type: "SELECT", question: "Seberapa sering kamu harus mengecek catatan pengeluaran?", options: JSON.stringify(["Sekali setahun", "Setiap hari atau mingguan", "Saat sudah bokek saja", "Tidak perlu dicek"]), correct_answer: "Setiap hari atau mingguan", order_index: 4, is_deleted: false },
  );

  // Unit 1, Lesson 5
  challengesData.push(
    { id: challengeId(1,5,1), lesson_id: LESSON_IDS.u1l5, type: "SELECT", question: "Mana yang termasuk KEBUTUHAN?", options: JSON.stringify(["Beli kopi artisan tiap hari", "Bayar listrik kos", "Langganan streaming", "Beli sepatu branded"]), correct_answer: "Bayar listrik kos", order_index: 1, is_deleted: false },
    { id: challengeId(1,5,2), lesson_id: LESSON_IDS.u1l5, type: "SELECT", question: "Mana yang termasuk KEINGINAN?", options: JSON.stringify(["Makan siang", "Ojek online", "Langganan Spotify", "Bayar Internet"]), correct_answer: "Langganan Spotify", order_index: 2, is_deleted: false },
    { id: challengeId(1,5,3), lesson_id: LESSON_IDS.u1l5, type: "SELECT", question: "Tips membedakan kebutuhan dan keinginan?", options: JSON.stringify(["Beli semua yang diinginkan", "Tanya: 'Apakah aku butuh ini dalam 1 minggu ke depan?'", "Ikuti saja kata hati", "Beli dulu, pikirin nanti"]), correct_answer: "Tanya: 'Apakah aku butuh ini dalam 1 minggu ke depan?'", order_index: 3, is_deleted: false },
    { id: challengeId(1,5,4), lesson_id: LESSON_IDS.u1l5, type: "SELECT", question: "Strategi mengurangi pengeluaran keinginan?", options: JSON.stringify(["Tidak belanja sama sekali", "Tunggu 24 jam sebelum beli barang yang diinginkan", "Belanja dengan kartu kredit", "Gimana kata teman aja"]), correct_answer: "Tunggu 24 jam sebelum beli barang yang diinginkan", order_index: 4, is_deleted: false },
  );

  // Unit 2, Lesson 1
  challengesData.push(
    { id: challengeId(2,1,1), lesson_id: LESSON_IDS.u2l1, type: "SELECT", question: "Manfaat utama menabung adalah?", options: JSON.stringify(["Bisa beli barang mewah", "Mempersiapkan dana tak terduga dan masa depan", "Menjadi orang terkaya", "Membeli semua yang diinginkan"]), correct_answer: "Mempersiapkan dana tak terduga dan masa depan", order_index: 1, is_deleted: false },
    { id: challengeId(2,1,2), lesson_id: LESSON_IDS.u2l1, type: "SELECT", question: "Waktu terbaik untuk mulai menabung?", options: JSON.stringify(["Sudah kerja saja", "Setelah menikah", "Sekarang, meski jumlahnya kecil", "Sudah punya gaji besar"]), correct_answer: "Sekarang, meski jumlahnya kecil", order_index: 2, is_deleted: false },
    { id: challengeId(2,1,3), lesson_id: LESSON_IDS.u2l1, type: "SELECT", question: "Berapa minimal dana darurat yang disarankan?", options: JSON.stringify(["1 bulan pengeluaran", "3-6 bulan pengeluaran", "1 tahun gaji", "Tidak perlu dana darurat"]), correct_answer: "3-6 bulan pengeluaran", order_index: 3, is_deleted: false },
    { id: challengeId(2,1,4), lesson_id: LESSON_IDS.u2l1, type: "SELECT", question: "Apa yang terjadi jika tidak punya dana darurat?", options: JSON.stringify(["Tidak masalah", "Terpaksa berhutang saat ada kebutuhan mendadak", "Bisa minta ke teman terus", "Pemerintah akan bantu"]), correct_answer: "Terpaksa berhutang saat ada kebutuhan mendadak", order_index: 4, is_deleted: false },
  );

  // Unit 2, Lesson 2
  challengesData.push(
    { id: challengeId(2,2,1), lesson_id: LESSON_IDS.u2l2, type: "SELECT", question: "Emergency fund versi mahasiswa minimal berapa?", options: JSON.stringify(["Rp100.000", "Rp1.000.000", "Rp5.000.000", "Rp10.000.000"]), correct_answer: "Rp1.000.000", order_index: 1, is_deleted: false },
    { id: challengeId(2,2,2), lesson_id: LESSON_IDS.u2l2, type: "SELECT", question: "Apa fungsi emergency fund?", options: JSON.stringify(["Beli gadget baru", "Menutupi kebutuhan mendadak seperti sakit atau kos naik", "Investasi saham", "Beli kado teman"]), correct_answer: "Menutupi kebutuhan mendadak seperti sakit atau kos naik", order_index: 2, is_deleted: false },
    { id: challengeId(2,2,3), lesson_id: LESSON_IDS.u2l2, type: "SELECT", question: "Darimana sebaiknya dana darurat disimpan?", options: JSON.stringify(["Di bawah kasur", "Di rekening terpisah yang mudah diakses", "Di investasi saham", "Di dompet"]), correct_answer: "Di rekening terpisah yang mudah diakses", order_index: 3, is_deleted: false },
  );

  // Unit 2, Lesson 3
  challengesData.push(
    { id: challengeId(2,3,1), lesson_id: LESSON_IDS.u2l3, type: "SELECT", question: "Kenapa penting punya rekening terpisah untuk tabungan?", options: JSON.stringify(["Biar kelihatan kaya", "Supaya uang tabungan tidak terpakai untuk kebutuhan harian", "Karena bank suruh", "Tidak penting"]), correct_answer: "Supaya uang tabungan tidak terpakai untuk kebutuhan harian", order_index: 1, is_deleted: false },
    { id: challengeId(2,3,2), lesson_id: LESSON_IDS.u2l3, type: "SELECT", question: "Jenis rekening yang cocok untuk mahasiswa pertama kali menabung?", options: JSON.stringify(["Deposito 5 tahun", "Tabungan biasa / rekening digital", "Rekening valas", "Tidak perlu rekening"]), correct_answer: "Tabungan biasa / rekening digital", order_index: 2, is_deleted: false },
  );

  // Unit 2, Lesson 4
  challengesData.push(
    { id: challengeId(2,4,1), lesson_id: LESSON_IDS.u2l4, type: "SELECT", question: "Strategi menabung meski uang saku terbatas?", options: JSON.stringify(["Tabung sisa uang di akhir bulan", "Bayar diri dulu: sisihkan untuk tabungan di awal", "Tidak perlu menabung jika uang sedikit", "Pinjam uang lalu ditabung"]), correct_answer: "Bayar diri dulu: sisihkan untuk tabungan di awal", order_index: 1, is_deleted: false },
    { id: challengeId(2,4,2), lesson_id: LESSON_IDS.u2l4, type: "SELECT", question: "Berapa persen minimal yang sebaiknya ditabung dari uang saku?", options: JSON.stringify(["50%", "10%", "0%", "100%"]), correct_answer: "10%", order_index: 2, is_deleted: false },
  );

  // Unit 2, Lesson 5
  challengesData.push(
    { id: challengeId(2,5,1), lesson_id: LESSON_IDS.u2l5, type: "SELECT", question: "Perbedaan menabung dan berinvestasi?", options: JSON.stringify(["Tidak ada perbedaan", "Menabung = simpan di bank dengan risiko rendah, investasi = tumbuhkan uang dengan risiko", "Menabung lebih menguntungkan", "Investasi itu menabung"]), correct_answer: "Menabung = simpan di bank dengan risiko rendah, investasi = tumbuhkan uang dengan risiko", order_index: 1, is_deleted: false },
    { id: challengeId(2,5,2), lesson_id: LESSON_IDS.u2l5, type: "SELECT", question: "Kapan mahasiswa boleh mulai investasi?", options: JSON.stringify(["Sudah kerja saja", "Setelah punya dana darurat dan uang saku stabil", "Segera, hutang dulu modalnya", "Tidak perlu investasi"]), correct_answer: "Setelah punya dana darurat dan uang saku stabil", order_index: 2, is_deleted: false },
  );

  // Unit 3, Lesson 1
  challengesData.push(
    { id: challengeId(3,1,1), lesson_id: LESSON_IDS.u3l1, type: "SELECT", question: "Apa itu investasi?", options: JSON.stringify(["Meminjamkan uang ke teman", "Mengorbankan uang saat ini untuk mendapatkan hasil di masa depan", "Menabung di celengan", "Berjudi"]), correct_answer: "Mengorbankan uang saat ini untuk mendapatkan hasil di masa depan", order_index: 1, is_deleted: false },
    { id: challengeId(3,1,2), lesson_id: LESSON_IDS.u3l1, type: "SELECT", question: "Contoh instrumen investasi?", options: JSON.stringify(["Celengan ayam", "Reksadana, saham, obligasi", "Kotak amal", "Martabak"]), correct_answer: "Reksadana, saham, obligasi", order_index: 2, is_deleted: false },
    { id: challengeId(3,1,3), lesson_id: LESSON_IDS.u3l1, type: "SELECT", question: "Prinsip dasar investasi?", options: JSON.stringify(["High risk = high return", "Low risk = low return", "Semua investasi pasti untung", "A dan B benar"]), correct_answer: "A dan B benar", order_index: 3, is_deleted: false },
  );

  // Unit 3, Lesson 2
  challengesData.push(
    { id: challengeId(3,2,1), lesson_id: LESSON_IDS.u3l2, type: "SELECT", question: "Reksadana pasar uang menempatkan dananya di?", options: JSON.stringify(["Saham", "Deposito, SBN, dan instrumen pasar uang jangka pendek", "Properti", "Kripto"]), correct_answer: "Deposito, SBN, dan instrumen pasar uang jangka pendek", order_index: 1, is_deleted: false },
    { id: challengeId(3,2,2), lesson_id: LESSON_IDS.u3l2, type: "SELECT", question: "Berapa minimal pembelian reksadana pasar uang di platform digital?", options: JSON.stringify(["Rp1.000.000", "Rp10.000", "Rp100.000", "Rp10.000.000"]), correct_answer: "Rp10.000", order_index: 2, is_deleted: false },
  );

  // Unit 3, Lesson 3
  challengesData.push(
    { id: challengeId(3,3,1), lesson_id: LESSON_IDS.u3l3, type: "SELECT", question: "Apa itu bunga majemuk?", options: JSON.stringify(["Bunga yang dihitung dari pinjaman", "Bunga yang dihitung atas bunga sebelumnya (bunga berbunga)", "Bunga yang selalu tetap", "Bunga yang tidak pernah naik"]), correct_answer: "Bunga yang dihitung atas bunga sebelumnya (bunga berbunga)", order_index: 1, is_deleted: false },
    { id: challengeId(3,3,2), lesson_id: LESSON_IDS.u3l3, type: "SELECT", question: "Siapa yang dikatakan 'sahabat' investasi?", options: JSON.stringify(["Uang", "Waktu", "Keberuntungan", "Temuan"]), correct_answer: "Waktu", order_index: 2, is_deleted: false },
  );

  // Unit 3, Lesson 4
  challengesData.push(
    { id: challengeId(3,4,1), lesson_id: LESSON_IDS.u3l4, type: "SELECT", question: "Jika investasi berisiko tinggi, yang mungkin terjadi?", options: JSON.stringify(["Pasti untung besar", "Bisa untung besar tapi juga bisa rugi besar", "Tidak akan pernah rugi", "Aman pasti"]), correct_answer: "Bisa untung besar tapi juga bisa rugi besar", order_index: 1, is_deleted: false },
    { id: challengeId(3,4,2), lesson_id: LESSON_IDS.u3l4, type: "SELECT", question: "Reksadana pasar uang tergolong risiko?", options: JSON.stringify(["Sangat tinggi", "Rendah", "Sedang", "Tidak ada risiko"]), correct_answer: "Rendah", order_index: 2, is_deleted: false },
  );

  // Unit 3, Lesson 5
  challengesData.push(
    { id: challengeId(3,5,1), lesson_id: LESSON_IDS.u3l5, type: "SELECT", question: "Langkah pertama sebelum mulai investasi?", options: JSON.stringify(["Pinjam uang dulu", "Siapkan dana darurat dan pahami profil risiko", "Langsung beli saham", "Ikuti kata teman"]), correct_answer: "Siapkan dana darurat dan pahami profil risiko", order_index: 1, is_deleted: false },
    { id: challengeId(3,5,2), lesson_id: LESSON_IDS.u3l5, type: "SELECT", question: "Investasi yang paling cocok untuk pemula mahasiswa?", options: JSON.stringify(["Saham individual", "Kripto", "Reksadana pasar uang", "Forex"]), correct_answer: "Reksadana pasar uang", order_index: 2, is_deleted: false },
  );

  const { error: challengesError } = await supabase
    .from("challenges")
    .upsert(challengesData, { onConflict: "id" });

  if (challengesError) {
    console.error("Error seeding challenges:", challengesError);
    process.exit(1);
  }
  console.log(`  ✅ ${challengesData.length} challenges upserted`);

  // ─── Quests ───
  console.log("🏆 Seeding quests...");
  const { data: quests, error: questsError } = await supabase
    .from("quests")
    .upsert(
      [
        { id: QUEST_IDS.login, title: "Login Harian", description: "Buka Fintar hari ini untuk jaga streak", type: "LOGIN", target_value: 1, reward_xp: 10, reward_coins: 5, is_daily: true },
        { id: QUEST_IDS.xp50, title: "Raih 50 XP", description: "Dapatkan 50 XP hari ini", type: "XP", target_value: 50, reward_xp: 20, reward_coins: 10, is_daily: true },
        { id: QUEST_IDS.lesson2, title: "Selesaikan 2 Pelajaran", description: "Selesaikan 2 pelajaran hari ini", type: "LESSON", target_value: 2, reward_xp: 30, reward_coins: 15, is_daily: true },
      ],
      { onConflict: "id" }
    )
    .select();

  if (questsError) {
    console.error("Error seeding quests:", questsError);
    process.exit(1);
  }
  console.log(`  ✅ ${quests!.length} quests upserted`);

  // ─── Shop Items ───
  console.log("🛒 Seeding shop items...");
  const { data: shopItems, error: shopError } = await supabase
    .from("shop_items")
    .upsert(
      [
        { id: SHOP_IDS.heartRefill, name: "Heart Refill", description: "Isi ulang semua hearts ke kapasitas maksimal", type: "HEART_REFILL", price_coins: 50, icon: "❤️‍🩹", is_active: true },
        { id: SHOP_IDS.streakFreeze, name: "Streak Freeze", description: "Lindungi streakmu selama 1 hari jika tidak belajar", type: "STREAK_FREEZE", price_coins: 200, icon: "🧊", is_active: true },
      ],
      { onConflict: "id" }
    )
    .select();

  if (shopError) {
    console.error("Error seeding shop items:", shopError);
    process.exit(1);
  }
  console.log(`  ✅ ${shopItems!.length} shop items upserted`);

  // ─── Articles ───
  console.log("📰 Seeding articles...");
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .upsert(
      [
        {
          id: ARTICLE_IDS.danaDarurat,
          slug: "panduan-dana-darurat-mahasiswa",
          title: "Panduan Lengkap Dana Darurat untuk Mahasiswa",
          summary: "Dana darurat bukan cuma buat orang yang sudah kerja. Sebagai mahasiswa, kamu juga perlu punya cadangan keuangan untuk situasi tak terduga.",
          content: `# Dana Darurat untuk Mahasiswa\n\nBanyak yang pikir dana darurat itu cuma buat orang yang sudah kerja dan punya gaji tetap. Padahal, sebagai mahasiswa, kamu justru **lebih rentan** menghadapi pengeluaran mendadak.\n\n## Kenapa Mahasiswa Perlu Dana Darurat?\n\n- Kos tiba-tiba naik di tengah semester\n- Laptop rusak saat mendekati deadline tugas\n- Biaya kesehatan kalau tiba-tiba sakit\n- Kebutuhan mendadak untuk perjalanan pulang\n\n## Berapa Besarnya?\n\nUntuk mahasiswa, target realistisnya adalah **1-3 bulan pengeluaran pokok**. Misalnya:\n- Kos: Rp500.000/bulan\n- Makan: Rp600.000/bulan\n- Transport: Rp200.000/bulan\n- **Total pengeluaran pokok: ~Rp1.300.000/bulan**\n\nJadi target dana daruratmu: **Rp1.300.000 - Rp3.900.000**.\n\n## Cara Mulai Menabung Dana Darurat\n\n1. **Mulai dari yang kecil** — Target pertama: Rp500.000 saja\n2. **Pisahkan rekening** — Bukan rekening yang kamu pakai harian\n3. **Sisihkan 10% dari uang saku** — Kalau uang saku Rp1.500.000, sisihkan Rp150.000/bulan\n4. **Jangan sentuh kecuali darurat** — Beli boba BUKAN darurat 😅\n\n## Di Mana Simpan?\n\n- Rekening tabungan terpisah\n- Rekening digital (Jago, Seabank, dll) — mudah diakses tapi tetap terpisah\n- JANGAN simpan di investasi berisiko\n\n## Kesimpulan\n\nDana darurat itu seperti payung — kamu berharap nggak perlu pakai, tapi senang punya kalau hujan turun. Mulai dari Rp100.000 saja sudah langkah pertama yang hebat!`,
          cover_image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
          category: "Tabungan",
          tags: ["basics", "emergency-fund", "saving"],
          read_time_minutes: 5,
          author: "Tim Fintar",
          is_featured: true,
          is_published: true,
          is_deleted: false,
          view_count: 0,
        },
        {
          id: ARTICLE_IDS.budgeting503020,
          slug: "metode-budgeting-50-30-20-versi-uang-saku",
          title: "Metode Budgeting 50/30/20: Versi Uang Saku",
          summary: "Aturan 50/30/20 itu terkenal, tapi gimana terapinnya kalau yang kamu kelola uang saku, bukan gaji? Simak versi mahasiswa-friendly-nya!",
          content: `# Budgeting 50/30/20 untuk Uang Saku\n\nAturan 50/30/20 adalah salah satu metode budgeting paling populer. Tapi kebanyakan contohnya pakai konteks gaji karyawan. Bagaimana kalau pemasukanmu adalah uang saku dari orang tua?\n\n## Konsep Dasar\n\n- **50% untuk Kebutuhan** — Pengeluaran yang wajib dipenuhi\n- **30% untuk Keinginan** — Pengeluaran yang menyenangkan tapi bukan wajib\n- **20% untuk Tabungan** — Dana darurat, tabungan, atau investasi\n\n## Versi Uang Saku: Rp1.500.000/bulan\n\n| Kategori | Persentase | Jumlah |\n|----------|-----------|--------|\n| Kebutuhan | 50% | Rp750.000 |\n| Keinginan | 30% | Rp450.000 |\n| Tabungan | 20% | Rp300.000 |\n\n### Yang Termasuk Kebutuhan\n- Bayar kos dan utilitas\n- Makan sehari-hari\n- Transportasi ke kampus\n- Fotokopi dan alat tulis\n\n### Yang Termasuk Keinginan\n- Makan di café atau restoran\n- Langganan streaming\n- Jajan boba/kopi artisan\n- Beli baju baru\n\n## Tips Kalau Uang Saku Terbatas\n\nKalau 50% saja sudah habis untuk kebutuhan pokok (misal kos saja Rp600.000), sesuaikan rasionya:\n\n- **60% Kebutuhan** — Rp900.000\n- **25% Keinginan** — Rp375.000\n- **15% Tabungan** — Rp225.000\n\nYang penting: **tetap sisihkan untuk tabungan**, meski persentasenya lebih kecil.\n\n## Praktik Terbaik\n\n1. **Bayar diri dulu** — Saat uang saku masuk, langsung pindahkan bagian tabungan\n2. **Pakai aplikasi pencatatan** — BukuKasin, Monefy, atau spreadsheet\n3. **Review mingguan** — Cek apakah pengeluaran sesuai budget\n4. **Adjust tiap bulan** — Kalau bulan lalu kelebihan di keinginan, kurangi bulan ini\n\n## Kesimpulan\n\nBudgeting bukan soal membatasi diri secara ekstrem, tapi soal **mengalokasikan uang dengan sadar**. Dengan metode 50/30/20 versi mahasiswa, kamu tetap bisa menikmati hidup sambil membangun kebiasaan keuangan yang sehat.`,
          cover_image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
          category: "Budgeting",
          tags: ["budgeting", "planning", "beginner"],
          read_time_minutes: 5,
          author: "Tim Fintar",
          is_featured: false,
          is_published: true,
          is_deleted: false,
          view_count: 0,
        },
        {
          id: ARTICLE_IDS.reksadana,
          slug: "mulai-reksadana-dari-rp10000",
          title: "Mulai Reksadana dari Rp10.000: Panduan untuk Pemula",
          summary: "Investasi itu bukan cuma buat orang kaya. Dengan reksadana pasar uang, kamu bisa mulai dari Rp10.000 saja. Simak caranya!",
          content: `# Mulai Reksadana dari Rp10.000\n\nMitos: "Investasi itu butuh modal besar."\n\nFakta: **Kamu bisa mulai investasi reksadana dari Rp10.000** — lebih murah dari harga secangkir kopi di café!\n\n## Apa Itu Reksadana?\n\nReksadana adalah wadah untuk menghimpun dana dari banyak investor, lalu dikelola oleh Manajer Investasi profesional. Kamu nggak perlu pilih saham sendiri — titipkan ahlinya.\n\n## Jenis Reksadana\n\n| Jenis | Risiko | Potensi Return | Cocok Untuk |\n|-------|--------|---------------|-------------|\n| Pasar Uang | Sangat rendah | 3-5%/tahun | Pemula, dana darurat |\n| Pendapatan Tetap | Rendah | 5-7%/tahun | Konservatif |\n| Campuran | Sedang | 7-12%/tahun | Moderat |\n| Saham | Tinggi | 10-15%/tahun | Jangka panjang |\n\n## Kenapa Reksadana Pasar Uang Cocok untuk Mahasiswa?\n\n1. **Modal kecil** — Mulai dari Rp10.000\n2. **Risiko rendah** — Dananya ditempatkan di deposito dan SBN\n3. **Liquid** — Bisa dicairkan kapan saja\n4. **Nisbah tinggi vs tabungan** — Bunga tabungan cuma 0.5-1%, reksadana pasar uang bisa 3-5%\n\n## Cara Mulai\n\n1. **Siapkan KTP dan rekening bank**\n2. **Download aplikasi reksadana** — Bareksa, Bibit, atau Tokopedia Investasi\n3. **Lakukan risk assessment** — Tentukan profil risikomu\n4. **Mulai dari nominal kecil** — Rp10.000-Rp50.000 dulu\n5. **Lakukan rutin** — Biasakan investasi bulanan, meski kecil\n\n## Penting: Sebelum Mulai Investasi\n\n- ✅ Punya dana darurat minimal 1 bulan pengeluaran\n- ✅ Pahami profil risiko sendiri\n- ✅ Gunakan uang yang nggak akan kamu butuhkan dalam waktu dekat\n- ❌ Jangan pakai uang kos atau uang makan\n- ❌ Jangan pinjam uang untuk investasi\n\n## Kesimpulan\n\nReksadana pasar uang adalah pintu masuk paling aman ke dunia investasi. Dengan Rp10.000, kamu sudah bisa mulai belajar dan membiasakan diri. Yang penting bukan berapa banyak, tapi **konsistensi dan kebiasaan** yang kamu bangun.`,
          cover_image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format&fit=crop&q=80",
          category: "Investasi",
          tags: ["investing", "reksa-dana", "beginner"],
          read_time_minutes: 6,
          author: "Tim Fintar",
          is_featured: false,
          is_published: true,
          is_deleted: false,
          view_count: 0,
        },
      ],
      { onConflict: "id" }
    )
    .select();

  if (articlesError) {
    console.error("Error seeding articles:", articlesError);
    process.exit(1);
  }
  console.log(`  ✅ ${articles!.length} articles upserted`);

  console.log("\n✅ Seed data complete! (Idempotent — safe to re-run)");
}

seed().catch(console.error);
