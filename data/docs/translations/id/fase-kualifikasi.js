export const fase_kualifikasi = {
    slug: 'fase-kualifikasi',
    title: 'Fase Kualifikasi dalam Pertandingan Panahan',
    excerpt: 'Memahami tujuan, format, dan mekanisme fase kualifikasi — fondasi utama setiap kompetisi panahan modern.',
    icon: 'ph:chart-line-up-bold',
    category: 'archery',
    readTime: '5 menit',
    toc: [
        { id: 'apa-itu-kualifikasi', level: 2, text: 'Apa Itu Fase Kualifikasi?' },
        { id: 'format-round', level: 2, text: 'Format Round yang Digunakan' },
        { id: 'sistem-penilaian', level: 2, text: 'Sistem Penilaian & Tie-Break' },
        { id: 'hasil-kualifikasi', level: 2, text: 'Apa yang Ditentukan oleh Hasil Kualifikasi?' },
        { id: 'mengapa-kualifikasi-penting', level: 2, text: 'Mengapa Fase Ini Sangat Penting?' },
        { id: 'kualifikasi-di-Archeris', level: 2, text: 'Kualifikasi di Platform archeris.net' },
    ],
    content: `
        <h2 id="apa-itu-kualifikasi">Apa Itu Fase Kualifikasi?</h2>
        <p>Dalam kompetisi panahan, <strong>fase kualifikasi</strong> (disebut juga <em>ranking round</em>) adalah babak pertama di mana semua peserta menembakkan sejumlah panah ke target yang sama dalam kondisi yang setara. Setiap panah diberi nilai poin berdasarkan zona target yang mengenai, kemudian total poin dikumpulkan untuk menentukan <em>ranking</em> setiap atlet.</p>
        <p>Kualifikasi biasanya dilakukan dalam satu atau dua sesi, tergantung format event dan jumlah peserta.</p>

        <h2 id="format-round">Format Round yang Digunakan</h2>
        <p>Berbagai format round digunakan dalam kualifikasi, disesuaikan dengan level dan regulasi event:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Format</th>
                        <th class="px-4 py-3">Jarak</th>
                        <th class="px-4 py-3">Jumlah Panah</th>
                        <th class="px-4 py-3 rounded-tr-xl">Digunakan Oleh</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">720 Round</td><td class="px-4 py-3">50–70 m</td><td class="px-4 py-3">72 panah (6 panah × 12 end)</td><td class="px-4 py-3">Recurve, Standard Bow (outdoor)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">1440 Round</td><td class="px-4 py-3">90/70/50/30 m</td><td class="px-4 py-3">144 panah</td><td class="px-4 py-3">Recurve (kompetisi penuh)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">25 m Indoor</td><td class="px-4 py-3">18 m / 25 m</td><td class="px-4 py-3">60 panah (3 panah × 20 end)</td><td class="px-4 py-3">Semua divisi (indoor)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Field Round</td><td class="px-4 py-3">Bervariasi</td><td class="px-4 py-3">24 atau 48 target</td><td class="px-4 py-3">Field archery</td></tr>
                </tbody>
            </table>
        </div>
        <p>Setiap <em>end</em> terdiri dari beberapa panah (umumnya 3 atau 6) yang ditembakkan dalam satu periode waktu, lalu nilai dicatat sebelum end berikutnya dimulai.</p>

        <h2 id="sistem-penilaian">Sistem Penilaian & Tie-Break</h2>
        <p>Nilai per panah ditentukan oleh zona target yang terttenai:</p>
        <ul>
            <li><strong>10 (Emas dalam)</strong> — Lingkaran terdalam (X), bernilai 10 poin, dihitung terpisah sebagai tie-break.</li>
            <li><strong>9, 8, 7 …</strong> — Zona berikutnya berurutan keluar dari pusat.</li>
            <li><strong>M (Miss)</strong> — Panah tidak mengenai target atau jatuh, bernilai 0.</li>
        </ul>
        <p>Jika dua atau lebih atlet memiliki total poin yang sama, <em>tie-break</em> ditentukan secara berurutan oleh:</p>
        <ol>
            <li>Jumlah panah <strong>X</strong> (10 dalam)</li>
            <li>Jumlah panah <strong>10+X</strong></li>
            <li>Jumlah panah <strong>9+10+X</strong>, dst.</li>
        </ol>

        <h2 id="hasil-kualifikasi">Apa yang Ditentukan oleh Hasil Kualifikasi?</h2>
        <p>Hasil kualifikasi menghasilkan sebuah <strong>daftar ranking</strong> (seeding list) per kategori/divisi. Ranking ini menentukan:</p>
        <ul>
            <li><strong>Siapa yang lolos ke babak eliminasi</strong> — Hanya sejumlah peserta teratas (biasanya 8, 16, atau 32 besar) yang melanjutkan ke fase eliminasi head-to-head.</li>
            <li><strong>Posisi bracket eliminasi</strong> — Peringkat #1 dari kualifikasi akan bertanding melawan peringkat terakhir yang lolos; format ini disebut <em>bracket seeding</em>.</li>
            <li><strong>Penghargaan kualifikasi</strong> — Beberapa event memberikan gelar atau medali tersendiri untuk juara babak kualifikasi.</li>
        </ul>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🏹</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Kualifikasi ≠ Hanya "Babak Penyisihan"</div>
                <div class="text-gray-600 text-sm">Peringkat kualifikasi yang baik memberikan keuntungan besar di eliminasi: Anda mendapat lawan yang (secara teoritis) lebih lemah di babak awal dan mendapat "sisi" bracket yang lebih mudah. Atlet berperingkat #1 hampir selalu menghindari bertemu sesama unggulan sampai final.</div>
            </div>
        </div>

        <h2 id="mengapa-kualifikasi-penting">Mengapa Fase Ini Sangat Penting Bagi Setiap Atlet?</h2>
        <p>Banyak atlet pemula menganggap kualifikasi sebagai formalitas belaka — padahal sebenarnya kualifikasi adalah tahap yang paling menentukan <em>jalur perjalanan</em> mereka dalam kompetisi. Berikut alasannya:</p>
        <ul>
            <li><strong>Konsistensi diuji</strong> — Kualifikasi menembak banyak panah dalam durasi panjang, menuntut konsentrasi dan stamina yang stabil dari awal hingga akhir.</li>
            <li><strong>Tidak ada "second chance"</strong> — Berbeda dengan eliminasi yang bisa berputar nasib dalam satu end, satu panah meleset di kualifikasi tidak bisa diulangi dan langsung mempengaruhi total skor.</li>
            <li><strong>Mental pressure berbeda</strong> — Kualifikasi adalah tekanan "akumulatif" (harus konsisten puluhan panah), sedangkan eliminasi adalah tekanan "per momen". Persiapan mental untuk keduanya berbeda.</li>
            <li><strong>Seeding menentukan jalannya turnamen</strong> — Atlet yang serius di kualifikasi secara statistik memiliki peluang lebih tinggi untuk melaju jauh di eliminasi karena mendapat seeding yang menguntungkan.</li>
        </ul>

        <h2 id="kualifikasi-di-Archeris">Kualifikasi di Platform archeris.net</h2>
        <p>Di archeris.net, fase kualifikasi difasilitasi melalui modul <strong>Qualification</strong> yang dimiliki oleh panitia event berlangganan. Fitur yang tersedia:</p>
        <ul>
            <li>Pembuatan sesi kualifikasi dengan konfigurasi bebas (jumlah end, panah per end, jarak).</li>
            <li>Auto-assign peserta ke bantalan secara acak atau manual.</li>
            <li>Input skor melalui mobile app <em>atau</em> dashboard web oleh scorekeeper / atlet sendiri.</li>
            <li>Leaderboard real-time per kategori dengan tie-break otomatis.</li>
            <li>Cetak scoresheet (lembar skor) per sesi dalam format PDF.</li>
            <li>Generate ranking otomatis untuk digunakan sebagai seeding di babak eliminasi.</li>
        </ul>
    `
}


