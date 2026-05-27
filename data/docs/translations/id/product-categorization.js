export const product_categorization = {
  slug: "product-categorization",
  title: "Kategorisasi Produk Marketplace",
  excerpt: "Penjelasan lengkap tentang kategori produk yang tersedia di Marketplace archeris.net dan pedoman penempatan produk yang tepat.",
  icon: "ph:tag-bold",
  category: "marketplace",
  readTime: "3 menit",
  toc: [
    { id: "mengapa-kategori", level: 2, text: "Mengapa Kategori Itu Penting" },
    { id: "daftar-kategori", level: 2, text: "Daftar Kategori Produk" },
    { id: "sub-kategori", level: 2, text: "Sub-Kategori & Filter Lanjutan" },
    { id: "kategori-salah", level: 2, text: "Produk di Kategori yang Salah" }
  ],
  content: `
        <h2 id="mengapa-kategori">Mengapa Kategori Itu Penting</h2>
        <p>Kategori yang tepat membantu pembeli menemukan produk Anda lebih cepat. Algoritma pencarian Marketplace archeris.net menggunakan kategori sebagai salah satu sinyal relevansi. Produk yang dikategorikan dengan benar cenderung mendapat lebih banyak tayangan organik dibandingkan produk dengan kategori yang tidak sesuai.</p>

        <h2 id="daftar-kategori">Daftar Kategori Produk</h2>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Kategori</th>
                        <th class="px-4 py-3">Contoh Produk</th>
                        <th class="px-4 py-3 rounded-tr-xl">Cocok Untuk</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Peralatan <span class="text-xs font-normal text-gray-400">(equipment)</span></td>
                        <td class="px-4 py-3">Busur, limb, riser, tali busur, arrow rest, sight, stabilizer, clicker, release aid</td>
                        <td class="px-4 py-3">Komponen utama busur dan sistem tembakan</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Anak Panah & Aksesoris <span class="text-xs font-normal text-gray-400">(accessories)</span></td>
                        <td class="px-4 py-3">Arrow carbon/aluminium, nock, point, fletching, pin nock, nocking plier, arrow tube</td>
                        <td class="px-4 py-3">Anak panah dan komponen kecil pendukung tembakan</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Pakaian & Proteksi <span class="text-xs font-normal text-gray-400">(apparel)</span></td>
                        <td class="px-4 py-3">Finger tab, arm guard, chest guard, quiver, uniform, cap, sepatu panahan</td>
                        <td class="px-4 py-3">Pakaian, pelindung tubuh, dan perlengkapan badan atlet</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Latihan & Edukasi <span class="text-xs font-normal text-gray-400">(training)</span></td>
                        <td class="px-4 py-3">Bantalan target, face target, alat stretch, bow stand, training aid, buku/video kursus</td>
                        <td class="px-4 py-3">Perlengkapan dan konten untuk latihan mandiri</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Lainnya <span class="text-xs font-normal text-gray-400">(other)</span></td>
                        <td class="px-4 py-3">Plakat, piala, souvenir, merchandise klub, alat tulis kompetisi</td>
                        <td class="px-4 py-3">Produk yang tidak masuk kategori di atas</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 id="sub-kategori">Sub-Kategori & Filter Lanjutan</h2>
        <p>Selain memilih kategori utama, penjual disarankan melengkapi atribut lanjutan agar produk bisa muncul di filter spesifik pembeli:</p>
        <ul>
            <li><strong>Jenis busur yang kompatibel</strong> — Recurve, Compound, Barebow, Standard Bow, dll.</li>
            <li><strong>Level atlet</strong> — Pemula, Menengah, Profesional / Kompetisi.</li>
            <li><strong>Kondisi barang</strong> — Baru / Bekas (Second).</li>
            <li><strong>Merek</strong> — Samick, Hoyt, Win&Win, Easton, Carbon Express, lokal, atau no-brand.</li>
        </ul>
        <p>Atribut ini tidak bersifat wajib, namun sangat berpengaruh pada visibilitas produk di hasil filter pencarian pembeli.</p>

        <h2 id="kategori-salah">Produk di Kategori yang Salah</h2>
        <p>Tim archeris.net melakukan kurasi periodik terhadap listing. Produk yang terbukti berada di kategori yang tidak relevan akan dipindahkan atau dihapus sementara sambil menunggu koreksi dari penjual. Penjual akan menerima notifikasi dan penjelasan alasan tindakan tersebut.</p>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Produk yang Dilarang</div>
                <div class="text-gray-600 text-sm">archeris.net tidak menerima listing untuk senjata api, produk berbahaya yang tidak berhubungan dengan olahraga panahan, atau produk palsu/KW yang melanggar hak merek. Pelanggaran dapat berujung pada penangguhan toko.</div>
            </div>
        </div>
    `
}
