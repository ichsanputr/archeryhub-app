export const scorekeeper = {
    slug: 'scorekeeper', title: 'Manajemen Scorekeeper', excerpt: 'Panduan lengkap peran scorekeeper: pembuatan akun, assignment target, alur input skor, koreksi, dan kontrol akses.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '8 menit',
    toc: [
        { id: 'apa-itu-scorekeeper', level: 2, text: 'Apa Itu Scorekeeper?' },
        { id: 'buat-scorekeeper', level: 2, text: 'Membuat Akun Scorekeeper' },
        { id: 'assignment-scorekeeper', level: 2, text: 'Assignment ke Target / Sesi' },
        { id: 'alur-input-skor', level: 2, text: 'Alur Input Skor di Lapangan' },
        { id: 'koreksi-skor', level: 2, text: 'Koreksi & Pembatalan Skor' },
        { id: 'sesi-dan-rotasi', level: 2, text: 'Pergantian Sesi dan Rotasi Petugas' },
        { id: 'kontrol-akses', level: 2, text: 'Kontrol Akses dan Keamanan' },
    ],
    content: `
                    <h2 id="apa-itu-scorekeeper">Apa Itu Scorekeeper?</h2>
                    <p>Scorekeeper adalah petugas yang bertanggung jawab memasukkan skor panahan secara digital selama event berlangsung. Setiap skor yang diinput langsung tersinkronisasi ke leaderboard publik secara real-time, menggantikan pencatatan manual di kertas yang rawan kesalahan.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">🎯</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Peran Kunci dalam Integritas Skor</div>
                            <div class="text-gray-600 text-sm">Scorekeeper tidak punya akses ke pengaturan event maupun data peserta secara keseluruhan. Mereka hanya dapat mengakses target yang ditugaskan, menjaga keamanan dan isolasi data.</div>
                        </div>
                    </div>

                    <h2 id="buat-scorekeeper">Membuat Akun Scorekeeper</h2>
                    <p>Hanya admin organisasi yang dapat membuat akun scorekeeper. Proses pembuatan akun dilakukan dari dasbor manajemen event:</p>
                    <ol>
                        <li>Buka <strong>Dasbor Organisasi → Event → [Nama Event] → Scorekeeper</strong>.</li>
                        <li>Klik tombol <strong>Tambah Scorekeeper</strong>.</li>
                        <li>Isi nama petugas, nomor HP atau email, dan assign ke target/sesi yang dikehendaki.</li>
                        <li>Sistem akan mengenerate kredensial login sementara (PIN atau kata sandi) yang dapat dibagikan ke petugas.</li>
                        <li>Petugas login melalui aplikasi mobile atau browser menggunakan kredensial tersebut.</li>
                    </ol>
                    <img src="/docs/organization-manajemen-scorekeeper.png" alt="Manajemen Scorekeeper" />

                    <div class="not-prose overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-white">
                                    <th class="px-4 py-3 text-left font-bold rounded-tl-xl">Informasi</th>
                                    <th class="px-4 py-3 text-left font-bold rounded-tr-xl">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Jumlah maksimum</td>
                                    <td class="px-4 py-3 text-gray-600">Tidak dibatasi per event</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Metode login</td>
                                    <td class="px-4 py-3 text-gray-600">PIN 6 digit atau email + kata sandi</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Perangkat</td>
                                    <td class="px-4 py-3 text-gray-600">Smartphone, tablet, atau laptop</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Akses offline</td>
                                    <td class="px-4 py-3 text-gray-600">Tersinkronisasi otomatis saat koneksi pulih</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="assignment-scorekeeper">Assignment ke Target / Sesi</h2>
                    <p>Setiap scorekeeper harus di-assign ke target tertentu agar tidak terjadi tumpang tindih input. Satu scorekeeper bisa menangani beberapa target secara bersamaan jika kapasitas tim terbatas.</p>
                    <ul>
                        <li>Assignment dapat dilakukan <strong>sebelum atau saat event berlangsung</strong>.</li>
                        <li>Satu target bisa diassign ke lebih dari satu scorekeeper (sebagai backup).</li>
                        <li>Perubahan assignment akan langsung terlihat di aplikasi scorekeeper.</li>
                    </ul>
                    <img src="/docs/event-assign-target.png" alt="Assignment Target" />

                    <h2 id="alur-input-skor">Alur Input Skor di Lapangan</h2>
                    <p>Setelah login, scorekeeper hanya melihat daftar target yang ditugaskan. Berikut alur input skor per end:</p>
                    <ol>
                        <li><strong>Pilih Target</strong> — Pilih nomor target dari daftar yang tersedia.</li>
                        <li><strong>Pilih End</strong> — Pilih nomor end yang akan diinput (End 1, 2, 3, dst).</li>
                        <li><strong>Input Skor Tiap Panah</strong> — Masukkan nilai panah satu per satu (0–10, atau X untuk 10 ring dalam). Urutan input dari nilai terbesar ke terkecil sesuai ketentuan World Archery.</li>
                        <li><strong>Konfirmasi Total</strong> — Sistem otomatis menjumlah skor per end. Konfirmasi jika total sudah benar.</li>
                        <li><strong>Kirim</strong> — Skor tersimpan dan langsung muncul di leaderboard publik.</li>
                    </ol>

                    <div class="not-prose bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-green-600 text-2xl shrink-0">✅</div>
                        <div>
                            <div class="font-bold text-green-800 text-sm mb-1">Verifikasi Ganda</div>
                            <div class="text-green-700 text-sm">Sebelum skor dikirim, sistem menampilkan ringkasan semua panah dalam satu end. Scorekeeper wajib mengkonfirmasi sebelum data tersimpan permanen.</div>
                        </div>
                    </div>

                    <h2 id="koreksi-skor">Koreksi & Pembatalan Skor</h2>
                    <p>Kesalahan input dapat terjadi di lapangan. Archeryhub.id menyediakan mekanisme koreksi yang terkontrol:</p>
                    <ul>
                        <li><strong>Koreksi segera (dalam 5 menit):</strong> Scorekeeper dapat langsung mengedit skor end yang baru diinput selama jendela waktu koreksi masih terbuka.</li>
                        <li><strong>Koreksi oleh admin:</strong> Jika jendela waktu telah habis, hanya admin event yang dapat membuka kunci end dan mengizinkan koreksi ulang.</li>
                        <li><strong>Riwayat koreksi:</strong> Setiap perubahan skor dicatat beserta waktu, nama scorekeeper, dan alasan koreksi untuk keperluan audit.</li>
                    </ul>

                    <h2 id="sesi-dan-rotasi">Pergantian Sesi dan Rotasi Petugas</h2>
                    <p>Pada event multi-sesi, scorekeeper dapat dirotasi antar sesi tanpa mengganggu data yang sudah tersimpan. Admin cukup mengubah assignment target di dasbor sebelum sesi berikutnya dimulai. Scorekeeper baru akan langsung melihat target barunya setelah login ulang.</p>

                    <h2 id="kontrol-akses">Kontrol Akses dan Keamanan</h2>
                    <ul>
                        <li><strong>Isolasi data:</strong> Scorekeeper hanya dapat melihat dan menginput skor untuk target yang ditugaskan — tidak ada akses ke data peserta lain.</li>
                        <li><strong>Non-aktifkan akun:</strong> Admin dapat menonaktifkan akun scorekeeper kapan saja dari dasbor manajemen event.</li>
                        <li><strong>Rotasi PIN:</strong> Ganti PIN setiap event untuk mencegah penyalahgunaan kredensial lama.</li>
                        <li><strong>Log aktivitas:</strong> Semua aksi scorekeeper (login, input, koreksi) tercatat dalam log yang dapat diakses admin untuk keperluan audit.</li>
                    </ul>
                `
}
