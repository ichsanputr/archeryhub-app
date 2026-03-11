export const apa_itu_end = {
    slug: 'apa-itu-end',
    title: 'Apa Itu END dalam Panahan?',
    excerpt: 'Memahami konsep "end" sebagai unit dasar tembakan dalam sesi kualifikasi, cara kerjanya, dan pengaruhnya terhadap skor total atlet.',
    icon: 'ph:arrows-in-bold',
    category: 'archery',
    readTime: '4 menit',
    toc: [
        { id: 'definisi-end', level: 2, text: 'Definisi End' },
        { id: 'berapa-panah-per-end', level: 2, text: 'Berapa Panah per End?' },
        { id: 'alur-satu-end', level: 2, text: 'Alur Satu End dari Awal hingga Akhir' },
        { id: 'end-dan-total-skor', level: 2, text: 'End dan Total Skor' },
        { id: 'end-di-eliminasi', level: 2, text: 'End dalam Konteks Eliminasi' },
        { id: 'end-di-archeryhub', level: 2, text: 'End di Platform Archeryhub.id' },
    ],
    content: `
        <h2 id="definisi-end">Definisi End</h2>
        <p>Dalam panahan kompetisi, <strong>end</strong> (bahasa Indonesia: <em>babak tembak</em> atau <em>ronde tembak</em>) adalah satu unit tembakan di mana seorang atlet menembakkan sejumlah panah yang telah ditentukan ke target dalam satu periode waktu, sebelum maju mengambil dan mencatat nilainya.</p>
        <p>Sederhananya: <strong>end = satu giliran menembak</strong>. Setelah semua atlet di satu kelompok selesai menembak panah-panah mereka untuk satu end, seluruh kelompok maju bersama ke garis target untuk mencatat nilai dan mencabut panah, lalu kembali ke garis tembak untuk memulai end berikutnya.</p>

        <h2 id="berapa-panah-per-end">Berapa Panah per End?</h2>
        <p>Jumlah panah per end bervariasi tergantung format kompetisi:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Format / Konteks</th>
                        <th class="px-4 py-3 text-center">Panah per End</th>
                        <th class="px-4 py-3 rounded-tr-xl">Keterangan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Kualifikasi Outdoor (720 Round)</td>
                        <td class="px-4 py-3 text-center font-bold">6</td>
                        <td class="px-4 py-3">12 end × 6 panah = 72 panah total</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Kualifikasi Indoor (18/25 m)</td>
                        <td class="px-4 py-3 text-center font-bold">3</td>
                        <td class="px-4 py-3">20 end × 3 panah = 60 panah total</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Eliminasi Recurve (Set System)</td>
                        <td class="px-4 py-3 text-center font-bold">3</td>
                        <td class="px-4 py-3">Tiap set = 1 end, pemenang set mendapat 2 poin set</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Eliminasi Compound</td>
                        <td class="px-4 py-3 text-center font-bold">3 atau 6</td>
                        <td class="px-4 py-3">Jumlah end × panah dikonfigurasi per event</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Event Kustom (Archeryhub.id)</td>
                        <td class="px-4 py-3 text-center font-bold">1 – 6</td>
                        <td class="px-4 py-3">Dapat dikonfigurasi bebas oleh panitia</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 id="alur-satu-end">Alur Satu End dari Awal hingga Akhir</h2>
        <p>Berikut urutan kejadian dalam satu end di lapangan:</p>
        <ol>
            <li><strong>Sinyal mulai</strong> — Panitia atau sistem memberi aba-aba (biasanya bunyi lonceng atau peluit).</li>
            <li><strong>Waktu berjalan</strong> — Atlet mengambil ancang dan menembakkan panah sebanyak yang ditentukan untuk end tersebut. Terdapat batas waktu (umumnya 2 menit untuk 3 panah, atau 4 menit untuk 6 panah).</li>
            <li><strong>Sinyal selesai</strong> — Semua atlet berhenti menembak.</li>
            <li><strong>Maju ke target</strong> — Semua atlet berjalan bersama ke garis target.</li>
            <li><strong>Catat nilai</strong> — Nilai setiap panah dibaca dan dicatat (oleh scorekeeper atau atlet sendiri). Urutan pencatatan: dari nilai tertinggi ke terendah (misalnya: X, 10, 9, 8, M).</li>
            <li><strong>Cabut panah</strong> — Setelah semua nilai dicatat dan dikonfirmasi, panah dicabut dari target.</li>
            <li><strong>Kembali ke garis tembak</strong> — End berikutnya dimulai.</li>
        </ol>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">⏱️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Batas Waktu per End</div>
                <div class="text-gray-600 text-sm">Menembak melewati batas waktu mengakibatkan panah terakhir yang ditembakkan dinyatakan <strong>M (miss/0 poin)</strong>, sesuai peraturan World Archery. Manajemen waktu per end adalah bagian penting dari kompetisi atlet.</div>
            </div>
        </div>

        <h2 id="end-dan-total-skor">End dan Total Skor</h2>
        <p>Nilai kualifikasi seorang atlet adalah <strong>jumlah total poin dari semua panah di semua end</strong>. Misalnya, dalam format 720 Round (12 end × 6 panah):</p>
        <ul>
            <li>Setiap end menghasilkan subtotal dari 6 panah (maksimal 60 poin per end jika semua 10).</li>
            <li>Total 12 end dijumlahkan → skor akhir (maksimal 720 poin, itulah asal nama "720 Round").</li>
        </ul>
        <p>Di sinilah pentingnya <em>konsistensi per end</em>: atlet yang rata-rata 55 poin per end akan mengalahkan atlet yang mendapat 60 di beberapa end tapi 40 di end lainnya.</p>

        <h2 id="end-di-eliminasi">End dalam Konteks Eliminasi</h2>
        <p>Pada eliminasi head-to-head, setiap end dalam format <strong>Set System</strong> (Recurve) disebut juga <em>set</em>. Pemenang tiap set (end) tidak langsung menang pertandingan, melainkan mendapat <strong>poin set</strong>. Pertandingan dimenangkan oleh atlet yang pertama mengumpulkan 6 poin set.</p>
        <p>Untuk format <strong>Compound</strong>, end tetap bersifat kumulatif — tidak ada poin set, semua panah dari semua end dijumlahkan untuk menentukan pemenang match.</p>

        <h2 id="end-di-archeryhub">End di Platform Archeryhub.id</h2>
        <p>Saat panitia membuat sesi kualifikasi di Archeryhub.id, mereka mengisi dua parameter utama:</p>
        <ul>
            <li><strong>Jumlah End</strong> — Berapa end yang akan ditembak dalam sesi tersebut.</li>
            <li><strong>Panah per End</strong> — Berapa panah yang ditembak per end.</li>
        </ul>
        <p>Kedua angka ini menghasilkan total panah per atlet (Jumlah End × Panah per End), yang tampil di scoresheet dan digunakan untuk validasi input skor. Sistem tidak akan mengizinkan skor disubmit jika jumlah panah yang diisi tidak sesuai konfigurasi end yang telah ditetapkan.</p>
    `
}
