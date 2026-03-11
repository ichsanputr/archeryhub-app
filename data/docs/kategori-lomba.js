export const kategori_lomba = {
    slug: 'kategori-lomba', title: 'Kategori dan Divisi Lomba', excerpt: 'Panduan lengkap pembagian divisi berdasarkan jenis busur, kelompok usia, dan format pertandingan.', icon: 'ph:list-numbers-bold', category: 'archery', readTime: '7 menit',
    toc: [
        { id: 'divisi-busur', level: 2, text: 'Divisi Berdasarkan Jenis Busur' },
        { id: 'divisi-usia', level: 2, text: 'Pengelompokan Usia (Age Groups)' },
        { id: 'kategori-gender', level: 2, text: 'Kategori Gender & Regu' },
        { id: 'format-lomba', level: 2, text: 'Format Pertandingan' },
    ],
    content: `
                    <h2 id="divisi-busur">Divisi Berdasarkan Jenis Busur</h2>
                    <p>Dalam setiap kompetisi panahan, peserta dipisahkan berdasarkan jenis busur yang digunakan untuk memastikan persaingan yang adil. Divisi utama yang diakui secara luas meliputi:</p>
                    <ul>
                        <li><strong>Recurve:</strong> Divisi standar Olimpiade dengan aksesori bidik lengkap.</li>
                        <li><strong>Compound:</strong> Divisi busur katrol dengan presisi sangat tinggi.</li>
                        <li><strong>Standard Bow (Nasional):</strong> Divisi khusus pemula atau jenjang pembinaan nasional (ciri khas riser kayu).</li>
                        <li><strong>Barebow:</strong> Divisi busur recurve tanpa alat bantu bidik.</li>
                        <li><strong>Tradisional / Horsebow:</strong> Divisi busur tanpa arrow rest, seringkali menggunakan teknik thumb draw.</li>
                    </ul>

                    <h2 id="divisi-usia">Pengelompokan Usia (Age Groups)</h2>
                    <p>Untuk mendukung pembinaan atlet sejak dini, perlombaan biasanya dibagi ke dalam kelompok usia tertentu sesuai standar PERPANI dan World Archery:</p>
                    <ul>
                        <li><strong>U-9 & U-12 (Pra-Pemula):</strong> Fokus pada pengenalan teknik dan jarak dekat.</li>
                        <li><strong>U-15 (Pemula):</strong> Jenjang persiapan menuju atlet kompetisi.</li>
                        <li><strong>U-18 (Cadet) & U-21 (Junior):</strong> Kategori prestasi untuk atlet muda potensial.</li>
                        <li><strong>Public/Umum (Open):</strong> Kategori terbuka untuk semua umur, biasanya diikuti oleh atlet elit.</li>
                        <li><strong>Master:</strong> Kategori khusus untuk peserta senior (biasanya usia 40 atau 50 tahun ke atas).</li>
                    </ul>

                    <h2 id="kategori-gender">Kategori Gender & Regu</h2>
                    <p>Selain divisi busur dan usia, pertandingan juga dibagi berdasarkan jenis kelamin dan komposisi tim:</p>
                    <ul>
                        <li><strong>Individu (Putra/Putri):</strong> Pertandingan perorangan.</li>
                        <li><strong>Beregu (Team):</strong> Terdiri dari 3 pemanah dengan gender dan divisi busur yang sama.</li>
                        <li><strong>Mixed Team (Beregu Campuran):</strong> Terdiri dari 1 putra dan 1 putri dalam divisi busur yang sama.</li>
                    </ul>

                    <h2 id="format-lomba">Format Pertandingan</h2>
                    <p>Di Archeryhub.id, sistem kami mendukung dua format utama pertandingan:</p>
                    <ol>
                        <li><strong>Kualifikasi:</strong> Babak penentuan skor total untuk mencari peringkat awal. Biasanya terdiri dari 2 sesi (masing-masing 36 anak panah).</li>
                        <li><strong>Eliminasi (Aduan):</strong> Sistem gugur (bracket) di mana pemanah bertanding satu lawan satu hingga babak final.</li>
                    </ol>

                    <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-2xl">📝</span>
                            <div class="font-bold text-amber-800">Catatan Penting</div>
                        </div>
                        <p class="text-sm text-amber-700">Beberapa event mungkin memiliki penamaan kategori yang unik (misalnya: "SD Kelas 1-3" atau "Internal Club"). Selalu periksa detail Technical Handbook event yang Anda ikuti melalui Archeryhub.id sebelum mendaftar.</p>
                    </div>
                `
}
