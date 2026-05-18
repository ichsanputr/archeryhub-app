export const paket_berlangganan = {
    slug: 'paket-berlangganan', title: 'Sistem & Paket Berlangganan', excerpt: 'Informasi lengkap mengenai pilihan paket, fitur eksklusif, serta panduan tata cara berlangganan bagi Organisasi di archeris.net.', icon: 'ph:crown-bold', category: 'subscription', readTime: '8 menit',
    toc: [
        { id: 'tipe-paket', level: 2, text: 'Tipe Paket Organisasi' },
        { id: 'perbandingan-fitur', level: 2, text: 'Fitur Standar vs Elite' },
        { id: 'fitur-eksklusif', level: 2, text: 'Keunggulan Paket Elite' },
        { id: 'alur-langganan', level: 2, text: 'Tata Cara Berlangganan' },
        { id: 'metode-pembayaran', level: 2, text: 'Metode Pembayaran' },
        { id: 'kelola-berlangganan', level: 2, text: 'Manajemen Langganan' },
    ],
    content: `
                    <h2 id="tipe-paket">Tipe Paket Organisasi</h2>
                    <p>archeris.net menyediakan dua pilihan paket utama bagi Organisasi (Penyelenggara Event) untuk mengakomodasi berbagai skala kejuaraan panahan:</p>
                    <img src="/docs/organization-pilihan-paket.png" alt="Pilihan Paket Organisasi" />
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div class="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm border-t-4 border-t-navy">
                            <div class="font-bold text-navy h-8">💼 Paket Standar</div>
                            <div class="text-2xl font-black text-navy mb-2">Rp 29.999<span class="text-xs font-normal text-gray-400">/bln</span></div>
                            <p class="text-xs text-gray-500 mb-4">Cocok untuk klub lokal atau kejuaraan internal dengan peserta terbatas.</p>
                            <ul class="text-xs space-y-2 text-gray-600">
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Maks. 50 Peserta / Event</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Digital Scoring Standar</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Live Results Publik</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Media Storage 1 GB</li>
                            </ul>
                        </div>
                        <div class="border border-primary/30 rounded-2xl p-5 bg-primary/5 shadow-md border-t-4 border-t-primary relative overflow-hidden">
                            <div class="absolute top-2 right-2 bg-primary text-navy text-[10px] font-black px-2 py-0.5 rounded-full ">Paling Populer</div>
                            <div class="font-bold text-navy h-8">👑 Paket Elite</div>
                            <div class="text-2xl font-black text-navy mb-2">Rp 49.999<span class="text-xs font-normal text-gray-400">/bln</span></div>
                            <p class="text-xs text-navy/70 mb-4">Solusi profesional untuk turnamen besar, open tournament, dan skala nasional.</p>
                            <ul class="text-xs space-y-2 text-navy/80">
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Peserta Tak Terbatas</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Manajemen Match Finals</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Integrasi Pembayaran Otomatis</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Media Storage 5 GB</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h2 id="perbandingan-fitur">Fitur Standar vs Elite</h2>
                    <div class="not-prose overflow-x-auto my-6">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-left text-white font-bold">
                                    <th class="px-4 py-3 rounded-tl-xl border-b border-white/10">Fitur Utama</th>
                                    <th class="px-4 py-3 border-b border-white/10 text-center">Standar</th>
                                    <th class="px-4 py-3 rounded-tr-xl border-b border-white/10 text-center">Elite</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Kapasitas Peserta</td><td class="px-4 py-3 text-center">Maks. 50</td><td class="px-4 py-3 text-center font-bold text-primary">Unlimited</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Digital Scoring & Leaderboard</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Bracket Eliminasi (Aduan)</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Manajemen Match Finals</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Integrasi Pembayaran Otomatis</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Analitik & Laporan Lanjutan</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Penyimpanan Media</td><td class="px-4 py-3 text-center">1 GB</td><td class="px-4 py-3 text-center">5 GB</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="fitur-eksklusif">Keunggulan Paket Elite</h2>
                    <p>Dengan paket Elite, penyelenggara mendapatkan akses ke fitur-fitur kritikal yang memudahkan pengelolaan turnamen skala besar:</p>
                    <ul>
                        <li><strong>Otomasi Pembayaran:</strong> Anda tidak perlu melakukan verifikasi bukti transfer manual. Peserta membayar melalui Virtual Account/E-wallet, dan status pendaftaran akan berubah otomatis.</li>
                        <li><strong>Eksklusivitas Match Finals:</strong> Fitur khusus untuk mengelola babak perebutan medali dengan sistem scoring yang lebih detail untuk ditayangkan pada layar monitor di venue.</li>
                        <li><strong>Dashboard Keuangan:</strong> Pantau arus kas masuk dari pendaftaran event secara real-time melalui laporan terperinci.</li>
                    </ul>

                    <h2 id="alur-langganan">Tata Cara Berlangganan</h2>
                    <p>Ikuti langkah-langkah berikut untuk mengaktifkan paket organisasi Anda:</p>
                    <ol>
                        <li>Masuk ke <strong>Dashboard Organisasi</strong> Anda.</li>
                        <li>Pilih menu <strong>Subscription</strong> dari sidebar navigasi.</li>
                        <li>Tentukan paket yang sesuai (Standar atau Elite) dan pilih periode (Bulanan).</li>
                        <li>Klik <strong>Upgrade Now</strong> atau <strong>Bayar Sekarang</strong>.</li>
                        <li>Sistem akan menerbitkan <strong>Invoice Langganan</strong> yang dapat Anda bayar melalui metode digital yang tersedia.</li>
                    </ol>

                    <h2 id="metode-pembayaran">Metode Pembayaran</h2>
                    <p>Pembayaran paket berlangganan diproses melalui payment gateway archeris.net dengan pilihan metode:</p>
                    <ul>
                        <li><strong>Virtual Account (VA):</strong> Tersedia untuk Bank BNI, Mandiri, Permata, BRI, dan lainnya.</li>
                        <li><strong>QRIS & E-Wallet:</strong> Dukungan penuh untuk pembayaran instan via GoPay, ShopeePay, Dana, dll.</li>
                    </ul>

                    <h2 id="kelola-berlangganan">Manajemen Langganan</h2>
                    <p>Status langganan Anda dapat dipantau setiap saat. Halaman subscription akan menampilkan jumlah hari tersisa sebelum paket berakhir. Anda juga dapat mengaktifkan fitur <strong>Auto-Renewal</strong> (jika tersedia) atau mengunduh invoice lama di tab Riwayat Tagihan untuk keperluan laporan akuntansi organisasi.</p>
                    <img src="/docs/organization-riwayat-tagihan-paket.png" alt="Riwayat Tagihan Paket" />

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">💡</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Promo Pengguna Baru</div>
                            <div class="text-gray-600 text-sm">Organisasi yang baru mendaftar mendapatkan kesempatan mencoba Paket Standar secara GRATIS selama 3 bulan pertama sebagai bagian dari program digitalisasi panahan nasional.</div>
                        </div>
                    </div>
                `
}

