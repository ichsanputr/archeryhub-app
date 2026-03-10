export const status_pendaftaran = {
    slug: 'status-pendaftaran', title: 'Melihat Status Pendaftaran', excerpt: 'Cara memantau status invoice, verifikasi peserta, dan mengunduh tiket elektronik di dashboard Pemanah.', icon: 'ph:magnifying-glass-bold', category: 'archer', readTime: '4 menit',
    toc: [
        { id: 'akses-dashboard', level: 2, text: 'Akses Riwayat Event' },
        { id: 'arti-status', level: 2, text: 'Memahami Status Pendaftaran' },
        { id: 'kelola-invoice', level: 2, text: 'Mengelola Invoice' },
        { id: 'unduh-tiket', level: 2, text: 'Mengunduh Tiket & QR Code' },
    ],
    content: `
                    <h2 id="akses-dashboard">Akses Riwayat Event</h2>
                    <p>Semua event yang pernah Anda daftar dapat dilihat melalui <strong>Dashboard > My Events</strong>. Halaman ini merangkum seluruh aktivitas kompetisi Anda, baik yang baru akan berlangsung maupun yang sudah selesai.</p>
                    
                    <h2 id="arti-status">Memahami Status Pendaftaran</h2>
                    <p>Ada beberapa tahapan status yang perlu Anda perhatikan:</p>
                    <ul>
                        <li><strong>Pending:</strong> Pendaftaran sudah tercatat, namun pembayaran belum dilakukan atau belum terkonfirmasi.</li>
                        <li><strong>Paid:</strong> Pembayaran telah diterima oleh sistem Archeryhub.id.</li>
                        <li><strong>Verified:</strong> Data kepesertaan Anda telah diperiksa dan disetujui oleh panitia penyelenggara.</li>
                        <li><strong>Rejected:</strong> Pendaftaran ditolak (biasanya karena ketidaksesuaian kategori atau data tidak valid).</li>
                    </ul>

                    <h2 id="kelola-invoice">Mengelola Invoice</h2>
                    <p>Jika Anda perlu melihat detail rincian biaya atau mengubah metode pembayaran (selama belum kadaluarsa), Anda dapat mengklik nomor invoice yang tertera pada daftar pendaftaran Anda.</p>
                    <img src="/docs/archer-dashboard-riwayat-pembayaran.png" alt="Riwayat Pembayaran Pemanah" />

                    <h2 id="unduh-tiket">Mengunduh Tiket & QR Code</h2>
                    <p>Setelah status Anda menjadi <strong>Verified</strong>, tombol untuk mengunduh E-Ticket akan aktif. Tiket ini berisi QR Code unik yang wajib Anda tunjukkan saat check-in di lokasi pertandingan untuk proses absensi dan verifikasi peralatan.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📱</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Tips Mobile</div>
                            <div class="text-gray-600 text-sm">Anda dapat menyimpan screenshot QR Code di ponsel Anda untuk mempercepat proses check-in di lapangan jika koneksi internet di lokasi pertandingan tidak stabil.</div>
                        </div>
                    </div>
                `
}
