export const keranjang_belanja = {
    slug: 'keranjang-belanja', title: 'Manajemen Keranjang Belanja', excerpt: 'Panduan cara menggunakan keranjang belanja untuk mengelola item perlengkapan panahan sebelum melakukan checkout.', icon: 'ph:shopping-cart-bold', category: 'archer', readTime: '3 menit',
    toc: [
        { id: 'tambah-produk', level: 2, text: 'Menambah Produk ke Keranjang' },
        { id: 'kelola-item', level: 2, text: 'Mengelola Item di Keranjang' },
        { id: 'multi-seller', level: 2, text: 'Checkout dari Berbagai Penjual' },
        { id: 'riwayat-order', level: 2, text: 'Memantau Pesanan Barang' },
    ],
    content: `
                    <h2 id="tambah-produk">Menambah Produk ke Keranjang</h2>
                    <p>Saat menjelajahi Marketplace di archeris.net, Anda dapat memasukkan berbagai perlengkapan ke dalam keranjang. Klik ikon keranjang pada produk yang Anda inginkan. Anda dapat terus berbelanja dan mengumpulkan item sebelum memutuskan untuk melakukan pembayaran.</p>
                    
                    <h2 id="kelola-item">Mengelola Item di Keranjang</h2>
                    <p>Anda dapat mengakses keranjang belanja melalui ikon keranjang di navigasi atas atau melalui <strong>Dashboard > Cart</strong>. Di sini Anda bisa:</p>
                    <ul>
                        <li>Mengubah jumlah (quantity) produk.</li>
                        <li>Menghapus produk yang tidak jadi dibeli.</li>
                        <li>Melihat rincian subtotal per item.</li>
                    </ul>

                    <h2 id="multi-seller">Checkout dari Berbagai Penjual</h2>
                    <p>archeris.net mendukung pembelian dari beberapa penjual sekaligus dalam satu sesi belanja. Keranjang akan secara otomatis mengelompokkan produk berdasarkan toko pengirim. Biaya pengiriman akan dihitung terpisah per toko saat Anda melakukan checkout.</p>

                    <h2 id="riwayat-order">Memantau Pesanan Barang</h2>
                    <p>Setelah checkout dan pembayaran diverifikasi, Anda dapat memantau status pengiriman barang Anda melalui tab <strong>Orders</strong> di dashboard. Di sana tertera nomor resi dan status perjalanan paket dari toko ke alamat Anda.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">ðŸ›’</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Keamanan Transaksi</div>
                            <div class="text-gray-600 text-sm">Dana Anda akan ditahan oleh sistem archeris.net dan baru akan diteruskan ke penjual setelah Anda mengonfirmasi bahwa barang telah diterima dengan baik.</div>
                        </div>
                    </div>
                `
}

