export const ukuran_bracket = {
    slug: 'ukuran-bracket',
    title: 'Ukuran Bracket Eliminasi',
    excerpt: 'Panduan memilih ukuran bracket yang tepat — cara kalkulasi otomatis, konsep bye, dan opsi yang tersedia berdasarkan jumlah peserta atau tim.',
    icon: 'ph:tree-structure-bold',
    category: 'archery',
    readTime: '4 menit',
    toc: [
        { id: 'apa-itu-ukuran-bracket', level: 2, text: 'Apa Itu Ukuran Bracket?' },
        { id: 'aturan-pangkat-dua', level: 2, text: 'Aturan Pangkat Dua' },
        { id: 'konsep-bye', level: 2, text: 'Konsep Bye (Laga Kosong)' },
        { id: 'kalkulasi-otomatis', level: 2, text: 'Kalkulasi Otomatis Archeryhub.id' },
        { id: 'memilih-ukuran', level: 2, text: 'Panduan Memilih Ukuran' },
        { id: 'bracket-tim', level: 2, text: 'Bracket untuk Kategori Tim' },
    ],
    content: `
        <h2 id="apa-itu-ukuran-bracket">Apa Itu Ukuran Bracket?</h2>
        <p><strong>Ukuran bracket</strong> menentukan berapa slot peserta yang tersedia dalam fase eliminasi. Ukuran ini sekaligus menentukan jumlah babak yang harus dilalui hingga final, serta apakah ada peserta yang mendapat <em>bye</em> (laga gratis) di babak pertama.</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Ukuran</th>
                        <th class="px-4 py-3">Jumlah Babak</th>
                        <th class="px-4 py-3 rounded-tr-xl">Contoh Format</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">4 Slot</td><td class="px-4 py-3">2 babak</td><td class="px-4 py-3">Semifinal → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">8 Slot</td><td class="px-4 py-3">3 babak</td><td class="px-4 py-3">8-Besar → Semifinal → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">16 Slot</td><td class="px-4 py-3">4 babak</td><td class="px-4 py-3">16-Besar → … → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">32 Slot</td><td class="px-4 py-3">5 babak</td><td class="px-4 py-3">32-Besar → … → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">64 Slot</td><td class="px-4 py-3">6 babak</td><td class="px-4 py-3">64-Besar → … → Final</td></tr>
                </tbody>
            </table>
        </div>

        <h2 id="aturan-pangkat-dua">Aturan Pangkat Dua</h2>
        <p>Ukuran bracket <strong>selalu harus berupa pangkat dua</strong> (4, 8, 16, 32, 64, …). Aturan ini memastikan setiap babak dapat menghasilkan tepat setengah dari jumlah peserta sebelumnya, sehingga seseorang selalu keluar sebagai pemenang tanpa kasus bracket ganjil.</p>
        <p>Ini adalah standar internasional yang digunakan oleh World Archery, WA Indoor, dan seluruh kompetisi resmi yang terdaftar di bawah Pengurus Besar Perpani.</p>

        <h2 id="konsep-bye">Konsep Bye (Laga Kosong)</h2>
        <p>Ketika jumlah peserta tidak pas mengisi semua slot bracket, beberapa slot diisi dengan <strong>bye</strong> — laga kosong di mana peserta secara otomatis menang tanpa bertanding. Bye selalu diberikan kepada peserta dengan ranking kualifikasi terendah (seeding terakhir) agar peserta terbaik tidak terpengaruh.</p>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🎯</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Contoh Skenario Bye</div>
                <div class="text-gray-600 text-sm">Jika ada 11 peserta dan bracket 16 dipilih, terdapat 5 bye. Peserta seeded #12 s.d. #16 (slot yang tidak terisi) mendapat bye di babak 16-besar dan langsung masuk ke babak 8-besar.</div>
            </div>
        </div>
        <p>Semakin kecil ukuran bracket yang dipilih dibandingkan jumlah peserta, sistem akan menggunakan format <strong>"Top-N"</strong> — hanya peserta dengan ranking kualifikasi tertinggi yang diikutsertakan. Misalnya, jika ada 30 peserta tetapi bracket 16 dipilih, hanya 16 peserta dengan skor tertinggi yang masuk bracket.</p>

        <h2 id="kalkulasi-otomatis">Kalkulasi Otomatis Archeryhub.id</h2>
        <p>Saat panitia membuka halaman pembuatan bracket, sistem secara otomatis:</p>
        <ol>
            <li><strong>Menghitung jumlah peserta (atau tim)</strong> yang memenuhi syarat di kategori tersebut.</li>
            <li><strong>Menentukan ukuran bracket maksimum</strong> — yaitu pangkat dua terkecil yang bisa menampung seluruh peserta.</li>
            <li><strong>Menampilkan opsi ukuran</strong> dari 4 hingga maksimum, dalam kelipatan pangkat dua, untuk dipilih panitia.</li>
        </ol>
        <p>Sistem juga menampilkan hint dinamis di bawah dropdown pilihan:</p>
        <ul>
            <li>Jika ukuran ≥ jumlah peserta: <em>"30 peserta · 2 bye"</em> — semua peserta masuk, dengan beberapa bye.</li>
            <li>Jika ukuran &lt; jumlah peserta: <em>"Top 16 dari 30 peserta berdasarkan ranking"</em> — hanya ranking teratas yang masuk.</li>
        </ul>

        <h2 id="memilih-ukuran">Panduan Memilih Ukuran</h2>
        <p>Pertimbangkan faktor-faktor berikut saat memilih ukuran bracket:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Pertimbangan</th>
                        <th class="px-4 py-3 rounded-tr-xl">Rekomendasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Waktu tersedia</td>
                        <td class="px-4 py-3">Bracket lebih kecil = lebih sedikit babak = lebih cepat selesai</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Inklusivitas</td>
                        <td class="px-4 py-3">Bracket maksimum memastikan semua peserta ikut eliminasi minimal 1 babak</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Regulasi event</td>
                        <td class="px-4 py-3">Beberapa penyelenggara (Perpani, KONI) mewajibkan format tertentu per level kejuaraan</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Jumlah peserta kecil</td>
                        <td class="px-4 py-3">Jika peserta ≤ 4, gunakan bracket 4; memaksa bracket 16 dengan 4 peserta menghasilkan terlalu banyak bye</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Ukuran Terkunci Setelah Bracket Dibuat</div>
                <div class="text-gray-600 text-sm">Setelah bracket berhasil dibuat, ukurannya tidak dapat diubah. Jika ingin mengubah ukuran, bracket harus dihapus dan dibuat ulang. Pastikan komposisi peserta sudah final sebelum membuat bracket.</div>
            </div>
        </div>

        <h2 id="bracket-tim">Bracket untuk Kategori Tim</h2>
        <p>Untuk kategori beregu, konsep ukuran bracket bekerja dengan cara yang sama, namun hitungan peserta digantikan oleh jumlah tim:</p>
        <ul>
            <li>Jika sudah ada tim tersinkron, jumlah tim tersebut digunakan sebagai dasar kalkulasi.</li>
            <li>Jika sinkronisasi belum dijalankan, sistem menggunakan <strong>estimasi tim</strong> dari data kualifikasi yang ada.</li>
            <li>Panitia disarankan menjalankan <a href="/docs/sinkronisasi-tim">Sinkronisasi Tim</a> terlebih dahulu sebelum membuat bracket tim agar angka yang ditampilkan akurat.</li>
        </ul>
    `,
}
