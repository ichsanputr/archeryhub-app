export const how_to_buy_items = {
  slug: "how-to-buy-items",
  title: "Cara Membeli Barang di Marketplace",
  excerpt: "Panduan lengkap untuk menemukan, membeli, dan menerima perlengkapan panahan dari Marketplace archeris.net.",
  icon: "ph:bag-bold",
  category: "marketplace",
  readTime: "4 menit",
  toc: [
    { id: "cari-produk", level: 2, text: "Menemukan Produk" },
    { id: "detail-produk", level: 2, text: "Membaca Detail Produk" },
    { id: "proses-checkout", level: 2, text: "Proses Checkout & Pembayaran" },
    { id: "lacak-pesanan", level: 2, text: "Melacak Pesanan" },
    { id: "konfirmasi-terima", level: 2, text: "Konfirmasi Penerimaan Barang" },
    { id: "retur", level: 2, text: "Retur & Komplain" }
  ],
  content: `
        <h2 id="cari-produk">Menemukan Produk</h2>
        <p>Anda dapat menemukan produk yang diinginkan melalui beberapa cara:</p>
        <ul>
            <li><strong>Pencarian</strong> — Ketik nama produk, merek, atau kata kunci di kolom pencarian Marketplace.</li>
            <li><strong>Filter Kategori</strong> — Gunakan filter di sidebar untuk mempersempit hasil berdasarkan kategori, harga, atau kondisi barang.</li>
            <li><strong>Rekomendasi</strong> — Halaman utama Marketplace menampilkan produk populer dan pilihan editor yang relevan dengan minat Anda.</li>
        </ul>

        <h2 id="detail-produk">Membaca Detail Produk</h2>
        <p>Sebelum membeli, periksa detail produk dengan cermat:</p>
        <ul>
            <li><strong>Foto produk</strong> — Lihat dari berbagai sudut. Foto yang buram atau sangat sedikit patut diwaspadai.</li>
            <li><strong>Deskripsi</strong> — Pastikan spesifikasi, ukuran, dan material sesuai kebutuhan Anda.</li>
            <li><strong>Info toko</strong> — Lihat rating toko dan ulasan dari pembeli sebelumnya.</li>
            <li><strong>Status stok</strong> — Pastikan produk masih tersedia sebelum dimasukkan ke keranjang.</li>
        </ul>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">💡</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Tanya Penjual</div>
                <div class="text-gray-600 text-sm">Ragu dengan spesifikasi produk? Gunakan fitur chat langsung di halaman produk untuk bertanya kepada penjual sebelum melakukan pembelian.</div>
            </div>
        </div>

        <h2 id="proses-checkout">Proses Checkout & Pembayaran</h2>
        <ol>
            <li>Klik <strong>Tambah ke Keranjang</strong> atau langsung <strong>Beli Sekarang</strong>.</li>
            <li>Di halaman keranjang, periksa kembali daftar item, jumlah, dan harga.</li>
            <li>Pilih <strong>metode pengiriman</strong> (kurir reguler, express, atau pick-up).</li>
            <li>Masukkan <strong>alamat pengiriman</strong> yang lengkap dan benar.</li>
            <li>Pilih <strong>metode pembayaran</strong>: transfer bank, virtual account, kartu kredit/debit, atau dompet digital.</li>
            <li>Klik <strong>Bayar Sekarang</strong> dan selesaikan pembayaran sebelum batas waktu.</li>
        </ol>
        <div class="not-prose bg-green-50 border border-green-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-green-600 text-2xl shrink-0">🔒</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Dana Aman dengan Sistem Escrow</div>
                <div class="text-gray-600 text-sm">Dana pembayaran Anda <strong>tidak langsung diteruskan ke penjual</strong>. Dana ditahan sistem archeris.net (escrow) dan baru dicairkan ke penjual setelah Anda mengonfirmasi barang diterima dengan baik.</div>
            </div>
        </div>

        <h2 id="lacak-pesanan">Melacak Pesanan</h2>
        <p>Setelah pembayaran berhasil, lacak status pesanan di <strong>Dashboard > Pesanan Saya</strong>. Status yang mungkin muncul:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Status</th>
                        <th class="px-4 py-3 rounded-tr-xl">Artinya</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-yellow-600">Menunggu Konfirmasi</td><td class="px-4 py-3">Penjual sedang memroses pesanan Anda.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-blue-600">Diproses</td><td class="px-4 py-3">Penjual menyiapkan paket kiriman.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-indigo-600">Dikirim</td><td class="px-4 py-3">Paket dalam perjalanan. Nomor resi tersedia.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-green-600">Selesai</td><td class="px-4 py-3">Barang diterima dan transaksi selesai.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-red-600">Dibatalkan</td><td class="px-4 py-3">Pesanan dibatalkan. Refund diproses.</td></tr>
                </tbody>
            </table>
        </div>

        <h2 id="konfirmasi-terima">Konfirmasi Penerimaan Barang</h2>
        <p>Setelah barang tiba, periksa kondisi paket dan isi kiriman. Jika sesuai, klik <strong>Konfirmasi Diterima</strong> di detail pesanan. Langkah ini penting karena:</p>
        <ul>
            <li>Dana pembayaran baru dicairkan ke penjual setelah Anda mengonfirmasi.</li>
            <li>Transaksi masuk ke riwayat pembelian dan dapat dinilai/diulas.</li>
        </ul>
        <p>Jika tidak dikonfirmasi dalam 7 hari setelah status "Dikirim", sistem secara otomatis menganggap barang diterima.</p>

        <h2 id="retur">Retur & Komplain</h2>
        <p>Jika barang tidak sesuai deskripsi, rusak, atau salah kirim, ajukan komplain <strong>sebelum mengonfirmasi penerimaan</strong> melalui tombol <strong>Ajukan Masalah</strong> di halaman detail pesanan. Tim archeris.net akan memediasi dan keputusan akhir mengikuti kebijakan perlindungan pembeli yang berlaku.</p>
    `
}
