export const peran_pengguna = {
    slug: 'peran-pengguna', title: 'Jenis Akun di Platform', excerpt: 'Panduan lengkap jenis akun, hak akses, dan alur kerja tiap tipe pengguna di Archeryhub.id.', icon: 'ph:users-three-bold', category: 'platform', readTime: '8 menit',
    toc: [
        { id: 'tipe-akun', level: 2, text: 'Tipe Akun di Archeryhub.id' },
        { id: 'pemanah', level: 2, text: 'Akun Pemanah' },
        { id: 'organisasi', level: 2, text: 'Akun Organisasi' },
        { id: 'penjual', level: 2, text: 'Akun Penjual' },
        { id: 'perbandingan', level: 2, text: 'Perbandingan Hak Akses' },
        { id: 'pilih-peran', level: 2, text: 'Bagaimana Memilih Akun yang Tepat?' },
    ],
    content: `
                    <h2 id="tipe-akun">Tipe Akun di Archeryhub.id</h2>
                    <p>Archeryhub.id dirancang untuk melayani satu ekosistem panahan yang lengkap. Karena kebutuhan pengguna berbeda-beda, sistem menyediakan tiga tipe akun utama: <strong>Pemanah</strong>, <strong>Organisasi</strong> (Penyelenggara), dan <strong>Penjual</strong>. Masing-masing tipe memiliki dashboard, menu, serta kewenangan yang disesuaikan dengan fungsinya.</p>
                    <p>Memilih tipe akun yang tepat sejak awal akan membuat alur kerja Anda lebih efisien, mulai dari pendaftaran event, penyelenggaraan turnamen, hingga penjualan produk panahan.</p>

                    <h2 id="pemanah">Akun Pemanah</h2>
                    <p>Akun <strong>Pemanah</strong> ditujukan untuk atlet individu, baik pemula maupun kompetitor aktif. Fokus utama akun ini adalah perkembangan profil atlet dan partisipasi event.</p>
                    <p><strong>Fitur utama untuk Pemanah:</strong></p>
                    <ul>
                        <li>Membuat profil atlet publik (nama, domisili, jenis busur, bio singkat).</li>
                        <li>Mendaftar event/turnamen dan memantau status pendaftaran secara real-time.</li>
                        <li>Melihat hasil kualifikasi, ranking, dan bracket eliminasi dari setiap kejuaraan yang diikuti.</li>
                        <li>Mengelola portofolio prestasi digital yang dapat dibagikan kepada komunitas atau sponsor.</li>
                        <li>Pembelian peralatan panahan melalui marketplace terintegrasi.</li>
                    </ul>
                    <p><strong>Cocok untuk:</strong> atlet individu, pelajar, penghobi panahan, dan peserta event terbuka.</p>

                    <h2 id="organisasi">Akun Organisasi</h2>
                    <p>Akun <strong>Organisasi</strong> ditujukan untuk penyelenggara event, asosiasi, atau panitia turnamen. Ini adalah tipe akun dengan fokus tertinggi pada operasional kompetisi dan manajemen pertandingan.</p>
                    <p><strong>Fitur utama untuk Organisasi:</strong></p>
                    <ul>
                        <li>Membuat dan mempublikasikan event lengkap dengan kategori usia, jenis busur, dan jadwal.</li>
                        <li>Mengelola peserta, verifikasi pendaftaran otomatis, dan kontrol status pembayaran (invoice).</li>
                        <li>Membentuk sesi kualifikasi, pembagian bantalan (assignment), serta alur pertandingan.</li>
                        <li>Mengelola akun scorekeeper untuk input skor lapangan melalui aplikasi mobile.</li>
                        <li>Menampilkan leaderboard dan bracket eliminasi yang ter-update secara otomatis sesuai skor masuk.</li>
                    </ul>
                    <p><strong>Catatan:</strong> beberapa fitur lanjutan organisasi membutuhkan paket berlangganan (Starter/Pro) untuk kapasitas peserta yang lebih besar.</p>
                    <p><strong>Cocok untuk:</strong> panitia kejuaraan, pengurus daerah/cabang (PERPANI), EO olahraga, dan lembaga pembina kompetisi.</p>

                    <h2 id="penjual">Akun Penjual</h2>
                    <p>Akun <strong>Penjual</strong> ditujukan untuk toko atau individu yang menjual perlengkapan panahan. Tipe ini dipisahkan agar manajemen produk dan transaksi dapat berjalan fokus tanpa bercampur dengan fitur kompetisi.</p>
                    <p><strong>Fitur utama untuk Penjual:</strong></p>
                    <ul>
                        <li>Membuat etalase produk panahan (busur, anak panah, aksesori, apparel).</li>
                        <li>Mengelola stok, harga, variasi produk, and media foto produk.</li>
                        <li>Memproses pesanan masuk dan memantau status pengiriman dari dashboard penjual.</li>
                        <li>Membangun reputasi toko melalui interaksi dengan komunitas pembeli di platform.</li>
                    </ul>
                    <p><strong>Cocok untuk:</strong> pemilik toko panahan, reseller perlengkapan, distributor lokal, and merchant komunitas.</p>

                    <h2 id="perbandingan">Perbandingan Hak Akses</h2>
                    <div class="not-prose overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-left">
                                    <th class="text-primary font-bold px-4 py-3 rounded-tl-xl">Fitur</th>
                                    <th class="text-white font-bold px-4 py-3">Pemanah</th>
                                    <th class="text-white font-bold px-4 py-3">Organisasi</th>
                                    <th class="text-white font-bold px-4 py-3 rounded-tr-xl">Penjual</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Profil Publik</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Daftar Event</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Buat Event</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Kelola Scoring</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Jual Produk</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="pilih-peran">Bagaimana Memilih Akun yang Tepat?</h2>
                    <p>Gunakan panduan cepat berikut:</p>
                    <ul>
                        <li>Jika Anda ingin <strong>ikut lomba sebagai atlet</strong>, pilih <strong>Pemanah</strong>.</li>
                        <li>Jika Anda menjadi <strong>panitia/penyelenggara turnamen</strong>, pilih <strong>Organisasi</strong>.</li>
                        <li>Jika fokus Anda adalah <strong>menjual peralatan panahan</strong>, pilih <strong>Penjual</strong>.</li>
                    </ul>
                    <p>Setiap tipe akun memiliki workflow yang berbeda. Pastikan Anda memilih sesuai kebutuhan utama Anda saat ini.</p>
                `
}
