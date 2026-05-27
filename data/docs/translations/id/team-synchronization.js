export const team_synchronization = {
  slug: "team-synchronization",
  title: "Sinkronisasi Tim Otomatis",
  excerpt: "Cara kerja fitur Sync Tim di archeris.net — bagaimana sistem mengelompokkan pemanah menjadi tim berdasarkan klub dan skor kualifikasi secara otomatis.",
  icon: "ph:arrows-clockwise-bold",
  category: "archery",
  readTime: "5 menit",
  toc: [
    { id: "apa-itu-sync-tim", level: 2, text: "Apa Itu Sinkronisasi Tim?" },
    { id: "syarat-tim-terbentuk", level: 2, text: "Syarat Tim Terbentuk" },
    { id: "tipe-tim", level: 2, text: "Tipe Tim: Standar vs Mixed" },
    { id: "cara-kerja-pengelompokan", level: 2, text: "Cara Kerja Pengelompokan" },
    { id: "kategori-individu-vs-tim", level: 2, text: "Kategori Individu & Kategori Tim" },
    { id: "estimasi-vs-hasil-sync", level: 2, text: "Estimasi Tim vs Hasil Sync" },
    { id: "sync-manual", level: 2, text: "Kapan Perlu Sync Manual?" },
    { id: "troubleshooting", level: 2, text: "Troubleshooting (Error Messages)" }
  ],
  content: `
        <h2 id="apa-itu-sync-tim">Apa Itu Sinkronisasi Tim?</h2>
        <p><strong>Sinkronisasi Tim</strong> adalah fitur di dashboard panitia yang secara otomatis membentuk tim-tim resmi untuk babak eliminasi beregu berdasarkan:</p>
        <ul>
            <li>Keanggotaan klub masing-masing pemanah</li>
            <li>Skor kualifikasi individu yang telah dicatat</li>
            <li>Tipe kategori (tim 3 orang atau mixed 2 orang)</li>
        </ul>
        <p>Proses ini menggantikan pembentukan tim manual yang rawan kesalahan dan memakan waktu, terutama pada event dengan puluhan kategori.</p>

        <h2 id="syarat-tim-terbentuk">Syarat Tim Terbentuk</h2>
        <p>Agar sistem dapat membentuk tim, beberapa syarat harus terpenuhi:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Syarat</th>
                        <th class="px-4 py-3 rounded-tr-xl">Keterangan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Status Pembayaran</td>
                        <td class="px-4 py-3">Peserta harus berstatus <em>lunas</em> atau <em>menunggu acc</em></td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Skor Kualifikasi</td>
                        <td class="px-4 py-3">Pemanah harus memiliki skor kualifikasi yang telah diinput</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Keanggotaan Klub</td>
                        <td class="px-4 py-3">Pemanah harus terdaftar di sebuah klub (bukan independen)</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Kuota Per Klub</td>
                        <td class="px-4 py-3">Satu klub membutuhkan minimal 3 pemanah (standar) atau 1 putra + 1 putri (mixed) agar bisa membentuk satu tim</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Jika salah satu syarat tidak terpenuhi, klub tersebut tidak akan menghasilkan tim — namun klub lain yang memenuhi syarat tetap akan diproses.</p>

        <h2 id="tipe-tim">Tipe Tim: Standar vs Mixed</h2>
        <p>archeris.net mendukung dua tipe kategori beregu:</p>
        <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Tipe</th>
                        <th class="px-4 py-3">Anggota</th>
                        <th class="px-4 py-3 rounded-tr-xl">Cara Pembentukan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Tim Standar</td>
                        <td class="px-4 py-3">3 pemanah dari klub yang sama (gender sama)</td>
                        <td class="px-4 py-3">Diambil 3 pemanah dengan skor tertinggi per kelompok (grup 3 teratas, grup 4–6, dst.)</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Mixed Team</td>
                        <td class="px-4 py-3">1 putra + 1 putri dari klub yang sama</td>
                        <td class="px-4 py-3">Dipasangkan pemanah putra dan putri terbaik per peringkat dari setiap klub</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">💡</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Satu Klub, Banyak Tim</div>
                <div class="text-gray-600 text-sm">Jika sebuah klub memiliki 6 pemanah berskor di satu kategori, sistem akan otomatis membentuk 2 tim dari klub tersebut — Tim A (peringkat 1–3 klub) dan Tim B (peringkat 4–6 klub).</div>
            </div>
        </div>

        <h2 id="cara-kerja-pengelompokan">Cara Kerja Pengelompokan</h2>
        <p>Algoritma sync tim bekerja sebagai berikut:</p>
        <ol>
            <li><strong>Ambil semua peserta</strong> dari kategori individu yang sesuai (divisi, kelompok usia, dan gender yang sama dengan kategori tim).</li>
            <li><strong>Hitung skor kualifikasi</strong> setiap peserta dari tabel <code>qualification_end_scores</code>.</li>
            <li><strong>Kelompokkan berdasarkan klub</strong> dan urutkan dari skor tertinggi ke terendah.</li>
            <li><strong>Bagi ke dalam kelompok berisi <em>n</em> pemanah</strong> (n = ukuran tim). Kelompok pertama adalah tim terbaik, kelompok kedua tim kedua, dst.</li>
            <li><strong>Kelompok yang tidak memenuhi kuota</strong> (kurang dari n pemanah berskor) diabaikan.</li>
            <li><strong>Buat entri tim</strong> di database, lengkap dengan nama tim, peringkat, skor total, dan daftar anggota.</li>
        </ol>

        <h2 id="kategori-individu-vs-tim">Kategori Individu &amp; Kategori Tim</h2>
        <p>Di sebuah event panahan, satu divisi biasanya memiliki <strong>dua kategori terpisah</strong>: kategori individu dan kategori tim.</p>
        <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Pemanah Mendaftar di Kategori Individu</div>
                <div class="text-gray-600 text-sm">Peserta <strong>selalu mendaftar ke kategori individu</strong> — bukan ke kategori tim. Saat Sync Tim dijalankan, sistem secara otomatis mencari peserta dari kategori individu yang memiliki divisi, kelompok usia, dan gender yang sama dengan kategori tim yang dipilih. Ini berarti sinkronisasi akan berhasil meski dari tampilan kategori tim tidak terlihat peserta terdaftar.</div>
            </div>
        </div>
        <p>Contoh: Kategori <em>Compound U-13 Putra Tim</em> akan mencari pesertanya dari kategori <em>Compound U-13 Putra Individual</em> di event yang sama.</p>

        <h2 id="estimasi-vs-hasil-sync">Estimasi Tim vs Hasil Sync</h2>
        <p>Sebelum menjalankan sync, halaman <strong>Pembuatan Bracket</strong> menampilkan dua angka:</p>
        <ul>
            <li><strong>Estimasi Tim</strong> <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Estimasi</span> — perkiraan jumlah tim yang akan terbentuk, dihitung langsung dari data kualifikasi saat ini tanpa benar-benar membuat tim. Berguna untuk memutuskan ukuran bracket sebelum sync dijalankan.</li>
            <li><strong>Tim Tersinkron</strong> <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Auto</span> — jumlah tim yang sudah benar-benar dibuat dan tersimpan di database setelah sync dijalankan.</li>
        </ul>
        <p>Jika sudah ada tim tersinkron, angka tersebut yang digunakan sebagai dasar rekomendasi ukuran bracket. Jika belum ada, sistem menggunakan estimasi sebagai acuan.</p>

        <h2 id="sync-manual">Kapan Perlu Sync Manual?</h2>
        <p>Meskipun Sync Otomatis menangani sebagian besar kebutuhan, ada situasi di mana panitia perlu mengedit atau membuat tim secara manual:</p>
        <ul>
            <li>Pemanah dari luar klub yang ingin bergabung sebagai tim (pemanah independen)</li>
            <li>Perubahan komposisi akibat pemanah yang cedera atau mengundurkan diri</li>
            <li>Format khusus event yang tidak mengikuti aturan standar pengelompokan</li>
        </ul>
        <p>Gunakan tombol <strong>Tambah Tim Manual</strong> atau <strong>Edit Detil Tim</strong> di halaman Manajemen Tim untuk kasus-kasus tersebut.</p>
        <div class="not-prose bg-red-50 border border-red-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-red-500 text-2xl shrink-0">🔄</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Sync Otomatis Menghapus Data Tim Lama</div>
                <div class="text-gray-600 text-sm">Setiap kali Sync Otomatis dijalankan, semua tim yang ada di kategori tersebut akan dihapus dan dibuat ulang dari awal. Pastikan skor kualifikasi sudah final sebelum menjalankan sync.</div>
            </div>
        </div>

        <h2 id="troubleshooting">Troubleshooting (Pesan Error)</h2>
        <p>Berikut adalah beberapa pesan error yang mungkin muncul saat proses sinkronisasi dan penjelasan mengenai penyebabnya:</p>

        <div class="space-y-4 my-6">
            <!-- 1. Kategori Putri/Putra Tidak Ditemukan -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Kategori pasangan putra/putri (Individual) tidak ditemukan..."</h4>
                </div>
                <p class="text-[13px] text-gray-500 italic mb-3">Kasus: Sinkronisasi Mixed Team.</p>
                <div class="space-y-2">
                    <p class="text-[13px] text-gray-700"><strong>Penyebab:</strong> Sistem tidak dapat menemukan kategori <em>Individual</em> dengan divisi dan kelompok umur yang sama untuk menarik skor kualifikasi.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solusi:</strong> Pastikan Anda telah membuat kategori <em>Individual Putra</em> DAN <em>Individual Putri</em> untuk divisi tersebut. Sistem membutuhkan skor dari kedua kategori ini untuk membentuk tim campuran (mixed).</p>
                </div>
            </div>

            <!-- 2. Sinkronisasi Tidak Menghasilkan Tim -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-amber-100 text-amber-600 font-bold text-[10px] rounded ">Info</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Sinkronisasi tidak menghasilkan tim"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Penyebab:</strong> Peserta ada, kategori ada, namun kuota per klub tidak mencukupi untuk membentuk satu pun tim.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solusi:</strong> 
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Check skor kualifikasi peserta: Peserta tanpa skor tidak akan dihitung oleh sistem sync.</li>
                            <li>Check jumlah peserta per klub: Tim standar butuh minimal 3 orang, Mixed butuh minimal 1 putra & 1 putri dari klub yang sama.</li>
                        </ul>
                    </p>
                </div>
            </div>

            <!-- 3. Event Tidak Ditemukan -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Event tidak ditemukan"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Penyebab:</strong> Masalah pada sinkronisasi URL atau data cache di browser.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solusi:</strong> Refresh halaman dashboard Anda dan coba jalankan kembali proses sinkronisasi.</p>
                </div>
            </div>

            <!-- 4. Gagal Menghitung Peringkat -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Gagal menghitung peringkat tim" / "Gagal menghitung peringkat mixed team"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Penyebab:</strong> Terjadi ketidakkonsistenan data skor di database pada salah satu peserta.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solusi:</strong> Periksa kembali leaderboard kualifikasi. Jika ada skor yang terlihat tidak wajar atau error, lakukan reset dan input ulang skor pada peserta tersebut.</p>
                </div>
            </div>

            <!-- 5. Database Transaction Error -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Gagal menyimpan hasil sinkronisasi" / "Gagal memulai transaksi"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Penyebab:</strong> Gangguan koneksi ke server database atau timeout saat memproses data dalam jumlah besar.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solusi:</strong> Tunggu beberapa saat dan ulangi proses. Jika masalah berlanjut, hubungi tim support Archeris untuk pengecekan status server.</p>
                </div>
            </div>
        </div>
    `
}
