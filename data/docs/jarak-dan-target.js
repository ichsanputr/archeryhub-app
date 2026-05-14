export const jarak_dan_target = {
    slug: 'jarak-dan-target', title: 'Jarak Tembak dan Format Target', excerpt: 'Panduan standar jarak tembak dan ukuran target face untuk berbagai divisi panahan.', icon: 'ph:ruler-bold', category: 'archery', readTime: '6 menit',
    toc: [
        { id: 'standar-jarak', level: 2, text: 'Standar Jarak Tembak' },
        { id: 'target-face', level: 2, text: 'Ukuran Target Face' },
        { id: 'skoring-zona', level: 2, text: 'Zona Penilaian (Scoring Zones)' },
        { id: 'format-indoor', level: 2, text: 'Format Indoor vs Outdoor' },
    ],
    content: `
                    <h2 id="standar-jarak">Standar Jarak Tembak</h2>
                    <p>Jarak tembak dalam panahan sangat bergantung pada divisi busur dan kelompok usia peserta. Berikut adalah standar umum yang sering digunakan dalam kompetisi di Indonesia:</p>
                    <ul>
                        <li><strong>Recurve Open (Senior):</strong> 70 Meter</li>
                        <li><strong>Compound Open (Senior):</strong> 50 Meter</li>
                        <li><strong>Standard Bow (Nasional Umum):</strong> 40 atau 50 Meter</li>
                        <li><strong>Barebow:</strong> 20 atau 50 Meter (Tergantung regulasi event)</li>
                        <li><strong>Kelompok Usia Dini (U-9/U-12):</strong> Mulai dari 5, 10, 15, hingga 20 Meter</li>
                    </ul>

                    <h2 id="target-face">Ukuran Target Face</h2>
                    <p>Terdapat beberapa ukuran target face (permukaan target) yang digunakan berdasarkan jarak tembaknya:</p>
                    <ul>
                        <li><strong>Diameter 122 cm:</strong> Digunakan untuk jarak jauh (70m & 60m Recurve, serta Standard Bow Nasional).</li>
                        <li><strong>Diameter 80 cm:</strong> Digunakan untuk jarak 50m (Compound dan Barebow).</li>
                        <li><strong>Diameter 60/40 cm:</strong> Digunakan untuk jarak dekat atau pertandingan Indoor.</li>
                        <li><strong>6-Ring Target:</strong> Khusus babak eliminasi Compound, sering menggunakan target yang hanya menampilkan zona skor 10 hingga 5.</li>
                    </ul>

                    <h2 id="skoring-zona">Zona Penilaian (Scoring Zones)</h2>
                    <p>Target face standar terdiri dari 5 warna dengan masing-masing 2 ring penilaian:</p>
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
                        <div class="bg-yellow-400 p-3 rounded-lg text-center font-bold text-navy">Kuning (9-10)</div>
                        <div class="bg-red-500 p-3 rounded-lg text-center font-bold text-white">Merah (7-8)</div>
                        <div class="bg-blue-500 p-3 rounded-lg text-center font-bold text-white">Biru (5-6)</div>
                        <div class="bg-black p-3 rounded-lg text-center font-bold text-white">Hitam (3-4)</div>
                        <div class="bg-white border border-gray-200 p-3 rounded-lg text-center font-bold text-navy">Putih (1-2)</div>
                    </div>
                    <p>Nilai tertinggi adalah 10 (pusat). Jika anak panah mengenai garis (line cutter), maka diambil nilai tertinggi yang disentuhnya.</p>

                    <h2 id="format-indoor">Format Indoor vs Outdoor</h2>
                    <p><strong>Outdoor:</strong> Pertandingan dilakukan di lapangan terbuka. Tantangan utama bagi pemanah adalah faktor angin dan cahaya matahari. Jarak yang digunakan cenderung lebih jauh.</p>
                    <p><strong>Indoor:</strong> Pertandingan dilakukan di dalam ruangan dengan jarak standar 18 meter. Karena tidak ada gangguan angin, akurasi pemanah diuji pada konsistensi tembakan di target face yang lebih kecil (biasanya vertical 3-spot).</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">ðŸ“</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Cek Handbook Event</div>
                            <div class="text-gray-600 text-sm">Panitia memiliki wewenang untuk menyesuaikan kombinasi jarak dan ukuran target. Selalu baca pengumuman resmi event pada platform archeris.net sebelum mulai berlatih.</div>
                        </div>
                    </div>
                `
}

