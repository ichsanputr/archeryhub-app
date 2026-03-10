export const mendaftar_event = {
    slug: 'mendaftar-event', title: 'Cara Mendaftar ke Event', excerpt: 'Panduan lengkap langkah demi langkah untuk mendaftar ke turnamen atau event panahan di Archeryhub.id.', icon: 'ph:clipboard-text-bold', category: 'archer', readTime: '5 menit',
    toc: [
        { id: 'cari-event', level: 2, text: 'Mencari Event' },
        { id: 'pilihan-kategori', level: 2, text: 'Memilih Kategori Lomba' },
        { id: 'isi-data', level: 2, text: 'Melengkapi Data Kepesertaan' },
        { id: 'proses-bayar', level: 2, text: 'Pembayaran Pendaftaran' },
        { id: 'konfirmasi', level: 2, text: 'Konfirmasi Pendaftaran' },
    ],
    content: `
                    <h2 id="cari-event">Mencari Event</h2>
                    <p>Anda dapat menemukan berbagai turnamen panahan melalui menu <strong>Events</strong> di halaman utama. Gunakan fitur filter untuk mencari event berdasarkan lokasi, status pendaftaran (Open/Closed), atau jenis turnamen yang Anda minati.</p>
                    <img src="/docs/archer-dashboard-event.png" alt="Dashboard Event Pemanah" />
                    
                    <h2 id="pilihan-kategori">Memilih Kategori Lomba</h2>
                    <p>Setelah memilih event, Anda akan melihat daftar kategori yang tersedia (misalnya: Recurve 70m, Barebow 20m, dsb). Pastikan Anda memilih kategori yang sesuai dengan kelompok umur dan jenis busur Anda. Klik tombol <strong>Daftar</strong> pada kategori yang diinginkan.</p>

                    <h2 id="isi-data">Melengkapi Data Kepesertaan</h2>
                    <p>Sistem akan secara otomatis mengambil data dari profil Anda. Namun, pastikan kembali poin-poin berikut:</p>
                    <ul>
                        <li><strong>Klub Asal:</strong> Pastikan klub yang tertera sesuai dengan klub yang Anda wakili untuk event tersebut.</li>
                        <li><strong>Data Tambahan:</strong> Beberapa event mungkin meminta data tambahan seperti ukuran jersey atau nomor anggota organisasi tertentu.</li>
                    </ul>

                    <h2 id="proses-bayar">Pembayaran Pendaftaran</h2>
                    <p>Setiap pendaftaran akan menghasilkan invoice unik. Anda dapat memilih berbagai metode pembayaran:</p>
                    <ul>
                        <li><strong>Virtual Account:</strong> Pembayaran otomatis terverifikasi (BNI, Mandiri, Permata, dll).</li>
                        <li><strong>E-Wallet:</strong> Dukungan QRIS, GoPay, dan ShopeePay untuk kemudahan transaksi mobile.</li>
                    </ul>
                    <p>Setelah pembayaran sukses, status pendaftaran Anda akan otomatis berubah menjadi <strong>Paid</strong>.</p>

                    <h2 id="konfirmasi">Konfirmasi Pendaftaran</h2>
                    <p>Setelah melakukan pembayaran, Anda tidak perlu mengirimkan bukti transfer secara manual jika menggunakan metode Virtual Account atau E-Wallet. Tiket elektronik dan nomor peserta akan tersedia di dashboard Anda segera setelah sistem memverifikasi transaksi.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">⚠️</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Penting</div>
                            <div class="text-gray-600 text-sm">Pastikan Anda menyelesaikan pembayaran sebelum batas waktu invoice (biasanya 24 jam) agar pendaftaran Anda tidak hangus secara otomatis oleh sistem.</div>
                        </div>
                    </div>
                `
}
