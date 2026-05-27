export const participant_management = {
  slug: "participant-management",
  title: "Manajemen Peserta dan Bantalan",
  excerpt: "Panduan operasional menata peserta, memantau status, dan mengatur bantalan kualifikasi.",
  icon: "ph:table-bold",
  category: "event",
  readTime: "7 menit",
  toc: [
    { id: "lihat-peserta", level: 2, text: "Melihat Daftar Peserta" },
    { id: "atur-bantalan", level: 2, text: "Atur Penempatan Bantalan" },
    { id: "strategi-penempatan", level: 2, text: "Strategi Penempatan" }
  ],
  content: `
                    <h2 id="lihat-peserta">Melihat Daftar Peserta</h2>
                    <p>Dashboard event menampilkan daftar peserta per kategori beserta status registrasi/pembayaran. Gunakan filter untuk memudahkan monitoring.</p>
                    <img src="/docs/organization-menambahkan-peserta.png" alt="Manajemen Peserta" />
                    <h2 id="atur-bantalan">Atur Penempatan Bantalan</h2>
                    <p>Panitia dapat mengatur target assignment secara manual atau otomatis. Setelah final, lakukan lock internal agar tidak terjadi perubahan mendadak saat sesi berjalan.</p>
                    <h2 id="strategi-penempatan">Strategi Penempatan</h2>
                    <ul>
                        <li>Pastikan distribusi peserta merata sesuai dengan kategori dan jarak tembak.</li>
                        <li>Hindari penempatan peserta dari asal daerah atau komunitas yang sama pada satu bantalan jika regulasi mengharuskan pemerataan.</li>
                        <li>Pastikan jadwal sesi sesuai kapasitas lapangan dan jumlah petugas lapangan.</li>
                        <li>Lakukan re-check sebelum scoring kualifikasi dimulai.</li>
                    </ul>
                `
}
