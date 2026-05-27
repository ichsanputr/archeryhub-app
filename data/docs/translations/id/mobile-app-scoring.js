export const mobile_app_scoring = {
  slug: "mobile-app-scoring",
  title: "Scoring via Aplikasi Mobile",
  excerpt: "Panduan lengkap wasit memakai mobile scoring dari login hingga sinkronisasi data.",
  icon: "ph:device-mobile-bold",
  category: "scoring",
  readTime: "6 menit",
  toc: [
    { id: "login-mobile", level: 2, text: "Login Scorekeeper" },
    { id: "scan-qr", level: 2, text: "Scan QR Assignment" },
    { id: "input-skor-mobile", level: 2, text: "Input Skor" },
    { id: "sinkronisasi", level: 2, text: "Sinkronisasi dan Troubleshooting" }
  ],
  content: `
                    <h2 id="login-mobile">Login Scorekeeper</h2>
                    <p>Akun scorekeeper dibuat oleh panitia dari dashboard. Gunakan kredensial resmi agar setiap input skor tercatat atas nama petugas yang tepat.</p>
                    <h2 id="scan-qr">Scan QR Assignment</h2>
                    <p>Setiap bantalan memiliki QR assignment. Scan QR untuk membuka match/target yang benar dan menghindari salah input ke peserta lain.</p>
                    <h2 id="input-skor-mobile">Input Skor</h2>
                    <p>Input nilai panah per end sesuai urutan tembakan. Setelah diverifikasi bersama petugas lapangan, simpan end agar data langsung ter-update di sistem pusat.</p>
                    <img src="/docs/input-nilai-per-end.png" alt="Input Nilai Mobile" />
                    <h2 id="sinkronisasi">Sinkronisasi dan Troubleshooting</h2>
                    <ul>
                        <li>Jika jaringan tidak stabil, pastikan data benar-benar tersimpan sebelum pindah end.</li>
                        <li>Lakukan refresh assignment bila QR tidak sesuai match aktif.</li>
                        <li>Laporkan mismatch data ke operator dashboard untuk koreksi terpusat.</li>
                    </ul>
                `
}
