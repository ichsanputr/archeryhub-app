export const penempatan_bantalan = {
    slug: 'penempatan-bantalan',
    title: 'Tipe Draw & Penempatan Otomatis Bantalan',
    excerpt: 'Panduan memilih tipe draw (acak, manual, atau berdasarkan ranking) dan cara kerja fitur penempatan otomatis peserta ke bantalan di sesi kualifikasi.',
    icon: 'ph:shuffle-bold',
    category: 'archery',
    readTime: '5 menit',
    toc: [
        { id: 'apa-itu-draw', level: 2, text: 'Apa Itu Draw?' },
        { id: 'tipe-draw', level: 2, text: 'Tipe-Tipe Draw yang Tersedia' },
        { id: 'penempatan-otomatis', level: 2, text: 'Penempatan Otomatis (Auto-Assign)' },
        { id: 'penempatan-manual', level: 2, text: 'Penempatan Manual' },
        { id: 'aturan-penempatan', level: 2, text: 'Aturan & Pertimbangan Penempatan' },
        { id: 'cetak-target-list', level: 2, text: 'Mencetak Daftar Bantalan (Target List)' },
    ],
    content: `
        <h2 id="apa-itu-draw">Apa Itu Draw?</h2>
        <p><strong>Draw</strong> dalam konteks kompetisi panahan adalah proses pengundian atau penentuan posisi â€” yaitu bantalan target mana yang akan digunakan oleh setiap peserta dalam sesi tembak. Posisi bantalan (target face position) sering disebut juga <em>target number</em> atau <em>nomor bantalan</em>.</p>
        <p>Draw yang adil dan transparan penting untuk menjaga integritas kompetisi. Contohnya, dalam kondisi angin outdoor, posisi bantalan di sisi kiri vs kanan lapangan bisa memberikan keuntungan berbeda bagi atlet â€” sehingga draw yang benar-benar acak lebih diutamakan.</p>

        <h2 id="tipe-draw">Tipe-Tipe Draw yang Tersedia</h2>
        <p>Di archeris.net, panitia dapat memilih dari beberapa pendekatan draw saat mengatur sesi kualifikasi:</p>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">1. Draw Acak (Random Draw)</h3>
        <p>Sistem secara acak mengacak seluruh peserta yang terdaftar dalam sesi, lalu memetakan mereka ke bantalan yang tersedia. Ini adalah metode paling umum dan direkomendasikan untuk kompetisi terbuka.</p>
        <ul>
            <li><strong>Keunggulan:</strong> Tidak ada bias, transparan, cepat.</li>
            <li><strong>Kapan digunakan:</strong> Event terbuka, kualifikasi fase pertama, atau ketika tidak ada pertimbangan khusus penempatan.</li>
        </ul>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">2. Draw Berdasarkan Kategori (Grouped Draw)</h3>
        <p>Peserta dikelompokkan terlebih dahulu berdasarkan divisi atau kategori umur, kemudian draw acak dilakukan di dalam masing-masing kelompok. Hasilnya, satu area bantalan didominasi oleh satu kategori â€” mempermudah pengawasan juri lapang.</p>
        <ul>
            <li><strong>Keunggulan:</strong> Juri kategori tidak perlu berpindah terlalu jauh, pembacaan nilai per kelompok lebih efisien.</li>
            <li><strong>Kapan digunakan:</strong> Event besar dengan banyak kategori dan juri khusus per divisi.</li>
        </ul>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">3. Draw Manual (Manual Assignment)</h3>
        <p>Panitia menentukan posisi setiap peserta secara individual â€” menggeser, mengatur, atau menukar posisi lewat antarmuka drag-and-drop di dashboard.</p>
        <ul>
            <li><strong>Keunggulan:</strong> Kontrol penuh, cocok untuk situasi khusus (atlet berkebutuhan khusus, permintaan panitia, dll.).</li>
            <li><strong>Kapan digunakan:</strong> Event semi-privat, kelas latihan, atau ketika ada kondisi khusus yang perlu dipertimbangkan.</li>
        </ul>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">ðŸ’¡</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Kombinasi Draw yang Umum Digunakan</div>
                <div class="text-gray-600 text-sm">Banyak panitia memulai dengan <strong>Draw Berdasarkan Kategori</strong> untuk mengelompokkan peserta, kemudian melakukan <strong>fine-tuning manual</strong> jika ada peserta yang perlu dipindah karena alasan tertentu. Kedua pendekatan ini bisa dikombinasikan di archeris.net.</div>
            </div>
        </div>

        <h2 id="penempatan-otomatis">Penempatan Otomatis (Auto-Assign)</h2>
        <p>Fitur <strong>Auto-Assign</strong> di archeris.net memungkinkan panitia menempatkan seluruh peserta ke bantalan yang tersedia hanya dengan satu klik. Berikut cara kerjanya:</p>
        <ol>
            <li>Panitia membuka sesi kualifikasi yang sudah dikonfigurasi (jumlah end, panah per end, dan daftar target tersedia).</li>
            <li>Pilih mode draw: <strong>Acak</strong> atau <strong>Berdasarkan Kategori</strong>.</li>
            <li>Klik tombol <strong>Auto-Assign</strong>.</li>
            <li>Sistem langsung memetakan semua peserta yang belum ditempatkan ke bantalan yang masih kosong secara otomatis.</li>
            <li>Hasilnya langsung bisa dipreview sebelum dikonfirmasi dan dipublikasikan.</li>
        </ol>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">âš ï¸</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Jumlah Target Harus Mencukupi</div>
                <div class="text-gray-600 text-sm">Auto-Assign hanya berhasil jika jumlah slot bantalan â‰¥ jumlah peserta. Pastikan Anda sudah menambahkan target yang cukup di konfigurasi sesi sebelum menjalankan auto-assign. Jika slot kurang, sistem akan meminta Anda menambah target terlebih dahulu.</div>
            </div>
        </div>

        <h2 id="penempatan-manual">Penempatan Manual</h2>
        <p>Setelah auto-assign selesai (atau kapan saja), panitia masih bisa melakukan perubahan manual di halaman Assignment:</p>
        <ul>
            <li><strong>Pindah peserta</strong> â€” Klik peserta lalu pilih target tujuan (drag-and-drop atau dropdown).</li>
            <li><strong>Tukar posisi</strong> â€” Tukar posisi dua peserta sekaligus tanpa harus melepas salah satunya terlebih dahulu.</li>
            <li><strong>Hapus penempatan</strong> â€” Kosongkan satu slot agar bisa diisi ulang secara manual atau via auto-assign parsial.</li>
        </ul>

        <h2 id="aturan-penempatan">Aturan & Pertimbangan Penempatan</h2>
        <p>Beberapa hal yang perlu dipertimbangkan saat melakukan draw:</p>
        <ul>
            <li><strong>Satu bantalan, satu atlet</strong> â€” Pada format olimpik standar setiap bantalan hanya untuk satu peserta. Untuk format 3D atau field, satu target bisa dikunjungi bergantian.</li>
            <li><strong>Kapasitas per target</strong> â€” Untuk sesi dengan banyak peserta dan target terbatas, sistem mendukung konfigurasi "A/B" (dua peserta per bantalan dalam satu sesi terbagi dua gelombang).</li>
            <li><strong>Atlet dengan kebutuhan khusus</strong> â€” Prioritaskan penempatan di bantalan beraksesibilitas (area datar, dekat pintu masuk juri, dll.) â€” lakukan ini via penempatan manual sebelum auto-assign.</li>
            <li><strong>Jangan menempatkan peserta dari tim/klub yang sama jika memungkinkan</strong> â€” Pada kompetisi beregu, ini mencegah anggota tim saling memberi tanda.</li>
        </ul>

        <h2 id="cetak-target-list">Mencetak Daftar Bantalan (Target List)</h2>
        <p>Setelah penempatan final dikonfirmasi, panitia dapat mencetak <strong>Target List</strong> â€” daftar lengkap yang menampilkan nama peserta beserta nomor bantalan mereka â€” dalam format PDF langsung dari dashboard. Dokumen ini biasanya ditempel di papan pengumuman venue sebelum sesi dimulai.</p>
        <p>Di archeris.net, Target List dapat dicetak dengan tampilan yang terfilter per sesi, per kategori, atau untuk semua peserta sekaligus, sesuai kebutuhan panitia.</p>
    `
}

