export const fase_eliminasi = {
    slug: 'fase-eliminasi',
    title: 'Fase Eliminasi dalam Pertandingan Panahan',
    excerpt: 'Memahami format bracket, sistem set, mekanisme tie-break, dan relasi antara kualifikasi dengan eliminasi dalam kompetisi panahan.',
    icon: 'ph:git-branch-bold',
    category: 'archery',
    readTime: '6 menit',
    toc: [
        { id: 'apa-itu-eliminasi', level: 2, text: 'Apa Itu Fase Eliminasi?' },
        { id: 'format-bracket', level: 2, text: 'Format Bracket' },
        { id: 'sistem-set', level: 2, text: 'Sistem Set (Set System)' },
        { id: 'sistem-poin-kumulatif', level: 2, text: 'Sistem Poin Kumulatif (Compound)' },
        { id: 'tie-break-shootoff', level: 2, text: 'Tie-Break & Shoot-Off' },
        { id: 'hubungan-kualifikasi', level: 2, text: 'Hubungan Eliminasi dengan Kualifikasi' },
        { id: 'eliminasi-di-Archeris', level: 2, text: 'Eliminasi di archeris.net' },
    ],
    content: `
        <h2 id="apa-itu-eliminasi">Apa Itu Fase Eliminasi?</h2>
        <p><strong>Fase eliminasi</strong> adalah babak kedua kompetisi panahan di mana peserta bertanding secara <em>head-to-head</em> (satu lawan satu) berdasarkan bracket yang disusun dari hasil kualifikasi. Setiap pertandingan menghasilkan satu pemenang yang melanjutkan ke babak berikutnya, dan satu peserta yang gugur. Babak ini terus berlanjut hingga menyisakan satu pemenang sebagai juara.</p>
        <p>Format ini dipopulerkan oleh World Archery sejak Olimpiade 1988 dan kini menjadi standar dalam hampir semua kompetisi panahan besar di dunia, termasuk kejuaraan yang difasilitasi oleh archeris.net.</p>

        <h2 id="format-bracket">Format Bracket</h2>
        <p>Bracket eliminasi tersedia dalam berbagai ukuran, disesuaikan dengan jumlah peserta yang lolos kualifikasi:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Ukuran Bracket</th>
                        <th class="px-4 py-3">Jumlah Peserta</th>
                        <th class="px-4 py-3 rounded-tr-xl">Babak</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">32 Besar</td><td class="px-4 py-3">32 peserta</td><td class="px-4 py-3">Babak 32, 16, 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">16 Besar</td><td class="px-4 py-3">16 peserta</td><td class="px-4 py-3">Babak 16, 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">8 Besar</td><td class="px-4 py-3">8 peserta</td><td class="px-4 py-3">Babak 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">4 Besar</td><td class="px-4 py-3">4 peserta</td><td class="px-4 py-3">Semi Final, Final</td></tr>
                </tbody>
            </table>
        </div>
        <p><strong>Cara seeding bracket:</strong> Peserta #1 (ranking terbaik kualifikasi) ditempatkan di sisi berlawanan dengan peserta #2 agar potensi pertemuan keduanya baru terjadi di babak final. Peringkat #1 bertemu peringkat terakhir yang lolos; peringkat #2 bertemu peringkat kedua dari bawah; dan seterusnya.</p>

        <h2 id="sistem-set">Sistem Set (Set System)</h2>
        <p>Digunakan untuk divisi <strong>Recurve</strong>, Standard Bow, dan Barebow. Dalam satu pertandingan, kedua atlet menembak beberapa <em>set</em>, masing-masing set terdiri dari 3 panah (outdoor) atau 3 panah (indoor). Pemenang setiap set ditentukan oleh siapa yang meraih total poin tertinggi dalam set tersebut:</p>
        <ul>
            <li>Menang set → mendapat <strong>2 poin set</strong></li>
            <li>Seri dalam satu set → masing-masing mendapat <strong>1 poin set</strong></li>
            <li>Kalah set → mendapat <strong>0 poin set</strong></li>
        </ul>
        <p>Atlet pertama yang mencapai <strong>6 poin set</strong> memenangkan pertandingan. Jika kedua atlet mencapai 5–5, pertandingan masuk ke <strong>shoot-off</strong> (lihat seksi Tie-Break di bawah).</p>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 mb-2 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🎯</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Kenapa Sistem Set Dibuat?</div>
                <div class="text-gray-600 text-sm">Sistem set sengaja dirancang supaya setiap end terasa seperti "pertandingan kecil". Satu kesalahan tidak langsung mematikan peluang—tapi konsistensi per set adalah kunci. Ini membuat eliminasi lebih dramatis dan menarik bagi penonton.</div>
            </div>
        </div>

        <h2 id="sistem-poin-kumulatif">Sistem Poin Kumulatif (Compound)</h2>
        <p>Divisi <strong>Compound</strong> menggunakan format berbeda: semua panah dalam seluruh end dijumlahkan langsung. Atlet dengan total poin kumulatif tertinggi setelah semua end selesai memenangkan pertandingan. Tidak ada poin set — setiap panah berpengaruh langsung pada total akhir.</p>
        <p>Hal ini mencerminkan karakteristik compound: dengan akurasi tinggi, selisih skor biasanya sangat tipis dan setiap panah benar-benar menentukan.</p>

        <h2 id="tie-break-shootoff">Tie-Break & Shoot-Off</h2>
        <p>Jika pertandingan berakhir seri setelah semua end/set reguler selesai, dilakukan <strong>shoot-off</strong>:</p>
        <ol>
            <li>Masing-masing atlet menembakkan <strong>1 panah</strong> ke target.</li>
            <li>Atlet dengan nilai panah tertinggi menang.</li>
            <li>Jika masih seri, pemenang ditentukan oleh panah yang <strong>lebih dekat ke pusat</strong> (diukur).</li>
        </ol>
        <p>Shoot-off adalah momen paling menegangkan dalam eliminasi — satu panah tunggal menentukan siapa yang melanjutkan dan siapa yang pulang.</p>

        <h2 id="hubungan-kualifikasi">Hubungan Eliminasi dengan Kualifikasi — Mengapa Atlet Butuh Keduanya</h2>
        <p>Kualifikasi dan eliminasi <strong>bukan dua lomba yang terpisah</strong> — keduanya adalah satu sistem terpadu yang saling bergantung. Berikut alasan mengapa setiap atlet harus memahami dan mempersiapkan kedua fase ini secara berbeda:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Aspek</th>
                        <th class="px-4 py-3">Kualifikasi</th>
                        <th class="px-4 py-3 rounded-tr-xl">Eliminasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Tujuan</td>
                        <td class="px-4 py-3">Menentukan ranking & siapa yang lolos</td>
                        <td class="px-4 py-3">Menentukan juara melalui head-to-head</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Lawan</td>
                        <td class="px-4 py-3">Tidak ada — melawan target sendiri</td>
                        <td class="px-4 py-3">Satu atlet spesifik per babak</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Tekanan mental</td>
                        <td class="px-4 py-3">Akumulatif — harus stabil puluhan panah</td>
                        <td class="px-4 py-3">Situasional — setiap set bisa berbalik</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Strategi</td>
                        <td class="px-4 py-3">Konsistensi, ritme, manajemen energi</td>
                        <td class="px-4 py-3">Adaptasi, momentum, membaca lawan</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Kesalahan</td>
                        <td class="px-4 py-3">Langsung mempengaruhi total skor</td>
                        <td class="px-4 py-3">Bisa dikejar di set berikutnya</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Hasil</td>
                        <td class="px-4 py-3">Ranking → posisi di bracket</td>
                        <td class="px-4 py-3">Posisi akhir: juara, runner-up, dll.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Singkatnya: <strong>kualifikasi yang baik membuka jalan yang lebih mudah di eliminasi</strong> — Anda mendapat lawan yang secara seeding lebih lemah di babak awal, dan Anda berada di sisi bracket yang menguntungkan. Namun kualifikasi yang sempurna pun tidak menjamin kemenangan eliminasi, karena sifat head-to-head membuat siapapun bisa kalah pada hari yang berbeda.</p>
        <p>Itulah mengapa program latihan atlet yang baik harus mencakup <em>kedua</em> jenis mental training: latihan skor konsisten jangka panjang (untuk kualifikasi), dan latihan pressure shot situasional (untuk eliminasi).</p>

        <h2 id="eliminasi-di-Archeris">Eliminasi di archeris.net</h2>
        <p>Panitia event di archeris.net dapat mengelola fase eliminasi melalui modul <strong>Elimination</strong> yang terintegrasi dengan hasil kualifikasi. Fitur utama:</p>
        <ul>
            <li><strong>Generate bracket otomatis</strong> dari ranking kualifikasi dengan satu klik.</li>
            <li>Dukungan bracket 4/8/16/32 besar per kategori.</li>
            <li>Input skor set atau poin kumulatif langsung dari mobile app atau dashboard.</li>
            <li>Visualisasi bracket real-time — dapat ditampilkan di layar TV/display venue.</li>
            <li>Tambah <strong>Additional End</strong> (end tambahan) jika terjadi seri di akhir pertandingan, tanpa harus mereset seluruh data.</li>
            <li>Cetak bracket dalam format PDF untuk arsip atau tempel di venue.</li>
        </ul>
    `
}


