export const how_to_sell_items = {
  slug: "how-to-sell-items",
  title: "Cara Menjual Barang di Marketplace",
  excerpt: "Panduan lengkap bagi penjual untuk mendaftarkan toko, mengunggah produk, dan mengelola pesanan di Marketplace archeris.net.",
  icon: "ph:storefront-bold",
  category: "marketplace",
  readTime: "5 menit",
  toc: [
    { id: "syarat-penjual", level: 2, text: "Syarat Menjadi Penjual" },
    { id: "daftar-toko", level: 2, text: "Mendaftarkan Toko" },
    { id: "tambah-produk", level: 2, text: "Mengunggah Produk" },
    { id: "kelola-stok", level: 2, text: "Mengelola Stok & Harga" },
    { id: "proses-pesanan", level: 2, text: "Memproses Pesanan Masuk" },
    { id: "tips-deskripsi", level: 2, text: "Tips Menulis Deskripsi Produk" }
  ],
  content: `
        <h2 id="syarat-penjual">Syarat Menjadi Penjual</h2>
        <p>Siapa pun dapat berjualan di Marketplace archeris.net selama memenuhi syarat berikut:</p>
        <ul>
            <li>Memiliki akun archeris.net yang sudah terverifikasi.</li>
            <li>Menyetujui Syarat & Ketentuan Penjual dan Kebijakan Marketplace.</li>
            <li>Memiliki nomor rekening bank atau dompet digital yang valid untuk pencairan dana.</li>
            <li>Menjual produk yang relevan dengan olahraga panahan (perlengkapan, aksesoris, pakaian, jasa pelatihan, dll.).</li>
        </ul>
        <div class="not-prose bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-blue-500 text-2xl shrink-0">ℹ️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Verifikasi Toko</div>
                <div class="text-gray-600 text-sm">Toko baru akan masuk ke tahap review oleh tim archeris.net dalam 1×24 jam. Produk baru dapat langsung diunggah namun akan ditampilkan ke publik setelah toko disetujui.</div>
            </div>
        </div>

        <h2 id="daftar-toko">Mendaftarkan Toko</h2>
        <p>Langkah-langkah mendaftarkan toko:</p>
        <ol>
            <li>Masuk ke <strong>Dashboard > Toko Saya > Buat Toko Baru</strong>.</li>
            <li>Isi nama toko, deskripsi singkat, dan logo toko.</li>
            <li>Masukkan informasi rekening bank atau dompet digital untuk pencairan.</li>
            <li>Centang persetujuan syarat & ketentuan penjual, lalu klik <strong>Daftarkan Toko</strong>.</li>
            <li>Tunggu konfirmasi email dari tim archeris.net.</li>
        </ol>

        <h2 id="tambah-produk">Mengunggah Produk</h2>
        <p>Setelah toko aktif, Anda dapat menambahkan produk melalui <strong>Dashboard Toko > Kelola Produk > Tambah Produk Baru</strong>. Isi form berikut:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Field</th>
                        <th class="px-4 py-3 rounded-tr-xl">Keterangan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">Nama Produk</td><td class="px-4 py-3">Nama jelas dan spesifik. Hindari nama yang terlalu generik.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Kategori</td><td class="px-4 py-3">Pilih kategori yang paling sesuai (Peralatan, Pakaian, Aksesoris, Latihan, dll.).</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Harga</td><td class="px-4 py-3">Harga dalam Rupiah sebelum biaya pengiriman.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Stok</td><td class="px-4 py-3">Jumlah unit yang tersedia. Sistem akan otomatis menutup listing jika stok habis.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Foto Produk</td><td class="px-4 py-3">Minimal 1 foto, disarankan 3–5 foto dari berbagai sudut.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Deskripsi</td><td class="px-4 py-3">Jelaskan spesifikasi, kondisi (baru/bekas), dan keunggulan produk.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Berat & Dimensi</td><td class="px-4 py-3">Digunakan untuk kalkulasi biaya pengiriman otomatis.</td></tr>
                </tbody>
            </table>
        </div>

        <h2 id="kelola-stok">Mengelola Stok & Harga</h2>
        <p>Stok dan harga dapat diperbarui kapan saja dari menu <strong>Kelola Produk</strong>. Pertimbangkan hal berikut:</p>
        <ul>
            <li>Atur stok secara akurat agar tidak terjadi pesanan yang tidak bisa dipenuhi (<em>oversell</em>).</li>
            <li>Gunakan fitur <strong>Flash Sale</strong> (jika tersedia) untuk memberikan harga promosi dalam rentang waktu tertentu.</li>
            <li>Produk dengan stok 0 otomatis ditandai "Habis" dan tidak muncul di hasil pencarian.</li>
        </ul>

        <h2 id="proses-pesanan">Memproses Pesanan Masuk</h2>
        <p>Setiap pesanan masuk akan tampil di <strong>Dashboard Toko > Pesanan</strong>. Alur prosesnya:</p>
        <ol>
            <li><strong>Menunggu Konfirmasi</strong> — Pesanan baru dari pembeli, dana sudah ditahan sistem.</li>
            <li><strong>Diproses</strong> — Anda mengonfirmasi ketersediaan dan mulai menyiapkan paket.</li>
            <li><strong>Dikirim</strong> — Masukkan nomor resi pengiriman. Pembeli akan menerima notifikasi.</li>
            <li><strong>Selesai</strong> — Barang diterima pembeli, dana dicairkan ke saldo toko Anda.</li>
        </ol>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Batas Waktu Konfirmasi</div>
                <div class="text-gray-600 text-sm">Pesanan harus dikonfirmasi dalam 2×24 jam kerja. Jika tidak dikonfirmasi, sistem akan secara otomatis membatalkan pesanan dan mengembalikan dana ke pembeli.</div>
            </div>
        </div>

        <h2 id="tips-deskripsi">Tips Menulis Deskripsi Produk</h2>
        <p>Deskripsi yang baik meningkatkan kepercayaan pembeli dan mengurangi pertanyaan berulang. Sertakan:</p>
        <ul>
            <li>Merek, tipe, dan ukuran produk secara spesifik.</li>
            <li>Material utama dan kondisi produk (baru / second / refurbished).</li>
            <li>Kompatibilitas: cocok untuk jenis busur / draw weight / level atlet apa.</li>
            <li>Isi paket: apa saja yang ikut dalam box/paket pengiriman.</li>
            <li>Catatan khusus: misalnya "tidak termasuk nocking point" atau "perlu tuning setelah dipasang".</li>
        </ul>
    `
}
