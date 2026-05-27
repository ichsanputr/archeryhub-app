export const profile_management = {
  slug: "profile-management",
  title: "Manajemen Profil & Pengaturan",
  excerpt: "Panduan lengkap cara mengelola informasi profil, foto, keamanan akun, dan pengaturan tampilan dashboard Anda.",
  icon: "ph:gear-six-bold",
  category: "platform",
  readTime: "6 menit",
  toc: [
    { id: "gambaran-umum", level: 2, text: "Gambaran Umum" },
    { id: "mengelola-data", level: 2, text: "Mengelola Data Diri" },
    { id: "foto-profil", level: 2, text: "Foto Profil & Banner" },
    { id: "keamanan-akun", level: 2, text: "Keamanan & Kata Sandi" },
    { id: "ubah-email", level: 2, text: "Mengubah Alamat Email" },
    { id: "pengaturan-tema", level: 2, text: "Tema & Tampilan" },
    { id: "visibilitas-publik", level: 2, text: "Kontrol Halaman Publik" }
  ],
  content: `
                    <h2 id="gambaran-umum">Gambaran Umum</h2>
                    <p>Halaman pengaturan di archeris.net adalah pusat kontrol untuk identitas digital Anda. Di sini Anda dapat memastikan informasi yang tampil kepada publik tetap akurat, menjaga keamanan akses akun, serta menyesuaikan kenyamanan tampilan dashboard sesuai preferensi Anda.</p>
                    
                    <h2 id="mengelola-data">Mengelola Data Diri</h2>
                    <p>Setiap tipe akun memiliki fokus informasi yang berbeda saat proses pembaruan profil:</p>
                    <ul>
                        <li><strong>Pemanah:</strong> Lengkapi data atlet seperti nama lengkap, jenis busur utama, klub asal, dan bio singkat untuk membangun portofolio prestasi Anda.</li>
                        <li><strong>Organisasi:</strong> Perbarui identitas resmi organisasi, visi-misi, sejarah singkat, serta informasi FAQ agar calon peserta event mendapatkan informasi yang jelas.</li>
                        <li><strong>Penjual:</strong> Kelola profil toko Anda untuk meningkatkan kepercayaan calon pembeli di marketplace.</li>
                    </ul>
                    <img src="/docs/organization-kustomisasi-profil.png" alt="Kustomisasi Profil Organisasi" />

                    <h2 id="foto-profil">Foto Profil & Banner</h2>
                    <p>Visual yang profesional membantu reputasi Anda di ekosistem panahan. Anda dapat mengunggah:</p>
                    <ul>
                        <li><strong>Avatar/Foto Profil:</strong> Digunakan sebagai identitas utama Anda di leaderboard dan interaksi platform.</li>
                        <li><strong>Banner:</strong> Gambar latar untuk mempercantik halaman publik profil Anda (terutama untuk Organisasi dan Toko).</li>
                    </ul>
                    <p>Tips: Gunakan gambar dengan resolusi yang baik namun ukuran file yang ringan agar profil Anda dapat dimuat dengan cepat oleh pengunjung lain.</p>

                    <h2 id="keamanan-akun">Keamanan & Kata Sandi</h2>
                    <p>Lindungi akun Anda dengan rutin memantau status keamanan di tab Pengaturan:</p>
                    <ul>
                        <li><strong>Ubah Kata Sandi:</strong> Perbarui kata sandi Anda secara berkala dengan perpaduan karakter yang kuat.</li>
                        <li><strong>Metode Login:</strong> Jika Anda mendaftar melalui akun Google, Anda dapat melihat status keterhubungannya di sini.</li>
                    </ul>

                    <h2 id="ubah-email">Mengubah Alamat Email</h2>
                    <p>Demi keamanan, perubahan alamat email memerlukan langkah verifikasi tambahan:</p>
                    <ol>
                        <li>Masukkan alamat email baru Anda pada form yang tersedia.</li>
                        <li>Sistem akan mengirimkan kode verifikasi (OTP) ke email baru tersebut.</li>
                        <li>Masukkan kode yang Anda terima untuk mengonfirmasi bahwa email tersebut adalah milik Anda.</li>
                    </ol>
                    <p>Setelah terverifikasi, alamat email login Anda akan otomatis berubah ke alamat yang baru.</p>

                    <h2 id="pengaturan-tema">Tema & Tampilan</h2>
                    <p>Setiap pengguna memiliki selera tampilan yang berbeda. Di bagian pengaturan user, Anda dapat memilih antara <strong>Light Mode</strong> (Terang) atau <strong>Dark Mode</strong> (Gelap) untuk dashboard Anda. Pilih yang paling nyaman bagi mata Anda saat mengelola data panahan dalam waktu lama.</p>
                    <img src="/docs/pengaturan-tema.png" alt="Pengaturan Tema Dashboard" />

                    <h2 id="visibilitas-publik">Kontrol Halaman Publik</h2>
                    <p>Khusus untuk akun Organisasi, Anda memiliki kendali penuh atas bagian mana saja yang ingin ditampilkan kepada publik. Anda dapat mengatur apakah Visi-Misi, Sejarah, atau FAQ organisasi tampil di halaman depan profil publik Anda melalui menu Page Settings.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📌</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Tips Manajemen Profil</div>
                            <div class="text-gray-600 text-sm">Pastikan "Slug" atau username Anda tetap unik dan mudah diingat, karena ini akan menjadi bagian dari alamat URL profil publik Anda di archeris.net.</div>
                        </div>
                    </div>
                `
}
