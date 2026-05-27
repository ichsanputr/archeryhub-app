export const qualification_scoring = {
  slug: "qualification-scoring",
  title: "Sistem Scoring Kualifikasi",
  excerpt: "Panduan operasional scoring kualifikasi dari setup sesi hingga validasi leaderboard.",
  icon: "ph:chart-bar-bold",
  category: "scoring",
  readTime: "7 menit",
  toc: [
    { id: "sesi-kualifikasi", level: 2, text: "Sesi Kualifikasi" },
    { id: "penempatan-bantalan", level: 2, text: "Penempatan Bantalan" },
    { id: "input-skor", level: 2, text: "Input Skor" },
    { id: "validasi-skor", level: 2, text: "Validasi Skor" },
    { id: "leaderboard", level: 2, text: "Leaderboard" }
  ],
  content: `
                    <h2 id="sesi-kualifikasi">Sesi Kualifikasi</h2>
                    <p>Panitia dapat membuat satu atau lebih sesi kualifikasi dalam satu event. Tiap sesi dapat memiliki konfigurasi jumlah end dan jumlah anak panah per end yang berbeda.</p>
                    <img src="/docs/membuat-sesi-kualifikasi-baru.png" alt="Sesi Kualifikasi Baru" />
                    <h2 id="penempatan-bantalan">Penempatan Bantalan</h2>
                    <p>Penempatan peserta ke bantalan dapat dilakukan manual atau memakai <strong>Auto-Assign</strong> untuk distribusi yang lebih merata.</p>
                    <h2 id="input-skor">Input Skor</h2>
                    <p>Skor diinput melalui mobile scoring atau dashboard web. Nilai per panah (termasuk X/M jika digunakan) dihitung otomatis menjadi total, hit, dan indikator tie-break.</p>
                    <h2 id="validasi-skor">Validasi Skor</h2>
                    <ul>
                        <li>Pastikan jumlah panah terisi sesuai konfigurasi end.</li>
                        <li>Verifikasi tidak ada nilai ganda/terlewat sebelum submit.</li>
                        <li>Lakukan koreksi hanya oleh petugas berwenang agar jejak audit tetap konsisten.</li>
                    </ul>
                    <h2 id="leaderboard">Leaderboard</h2>
                    <p>Leaderboard diperbarui otomatis secara real-time. Urutan ranking mengikuti aturan skor total, lalu indikator tie-break sesuai format kompetisi.</p>
                `
}
