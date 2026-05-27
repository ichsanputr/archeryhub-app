export const archer_profile = {
  slug: "archer-profile",
  title: "Kustomisasi Profil Atlet",
  excerpt: "Panduan mengatur informasi identitas atlet, klub asal, dan jenis busur untuk profil publik yang profesional.",
  icon: "ph:user-circle-gear-bold",
  category: "archer",
  readTime: "4 menit",
  toc: [
    { id: "identitas-atlet", level: 2, text: "Informasi Identitas" },
    { id: "klub-komunitas", level: 2, text: "Afiliasi Klub" },
    { id: "statistik-busur", level: 2, text: "Pengaturan Jenis Busur" },
    { id: "halaman-publik", level: 2, text: "Tampilan Profil Publik" }
  ],
  content: `
                    <h2 id="identitas-atlet">Informasi Identitas</h2>
                    <p>Melalui menu <strong>Settings > Profile</strong>, Anda dapat melengkapi bio atlet Anda. Gunakan bagian ini untuk menceritakan pengalaman panahan Anda atau target yang ingin Anda capai. Jangan lupa untuk menetapkan domisili (Kota/Provinsi) agar memudahkan panitia dalam pemetaan peserta.</p>
                    <img src="/docs/archer-kustomisasi-profile.png" alt="Kustomisasi Profil Pemanah" />
                    
                    <h2 id="klub-komunitas">Afiliasi Klub</h2>
                    <p>Hubungkan profil Anda dengan klub asal Anda. Informasi ini sangat krusial karena seringkali pendaftaran event menarik data klub secara otomatis. Jika klub Anda belum terdaftar di platform, Anda dapat menginput nama klub secara manual di bagian deskripsi profil pendaftaran.</p>

                    <h2 id="statistik-busur">Pengaturan Jenis Busur</h2>
                    <p>Anda dapat menetapkan jenis busur utama yang Anda gunakan (Recurve, Compound, Barebow, dll). Informasi ini akan mempermudah sistem dalam memberikan rekomendasi kategori lomba yang relevan saat Anda mencari event.</p>

                    <h2 id="halaman-publik">Tampilan Profil Publik</h2>
                    <p>Halaman profil publik Anda adalah "kartu nama" digital Anda. Di sini pengunjung dapat melihat:</p>
                    <ul>
                        <li>Foto profil dan identitas singkat.</li>
                        <li>Riwayat medali dan prestasi di turnamen yang menggunakan archeris.net.</li>
                        <li>Grafik perkembangan skor kualifikasi dari waktu ke waktu.</li>
                    </ul>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📸</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Tips Foto Profil</div>
                            <div class="text-gray-600 text-sm">Gunakan foto saat menggunakan peralatan panahan lengkap untuk memberikan kesan atlet yang profesional dan kredibel pada profil publik Anda.</div>
                        </div>
                    </div>
                `
}
