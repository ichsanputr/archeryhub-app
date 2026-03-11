export const registrasi_ulang = {
    slug: 'registrasi-ulang', title: 'Registrasi Ulang Akun Pemanah', excerpt: 'Panduan memperbarui data registrasi akun pemanah: perubahan klub, kategori usia, dan verifikasi ulang identitas.', icon: 'ph:arrows-clockwise-bold', category: 'archer', readTime: '5 menit',
    toc: [
        { id: 'kapan-perlu', level: 2, text: 'Kapan Perlu Registrasi Ulang?' },
        { id: 'pindah-klub', level: 2, text: 'Pindah atau Ganti Klub' },
        { id: 'update-kategori', level: 2, text: 'Perbarui Kategori & Divisi' },
        { id: 'verifikasi-identitas', level: 2, text: 'Verifikasi Identitas Ulang' },
        { id: 'langkah-langkah', level: 2, text: 'Langkah-Langkah Registrasi Ulang' },
        { id: 'dampak', level: 2, text: 'Dampak pada Riwayat & Prestasi' },
    ],
    content: `
                    <h2 id="kapan-perlu">Kapan Perlu Registrasi Ulang?</h2>
                    <p>Registrasi ulang diperlukan ketika terjadi perubahan data penting pada profil pemanah yang berdampak pada keikutsertaan di event. Beberapa kondisi yang memerlukan registrasi ulang antara lain:</p>
                    <ul>
                        <li><strong>Pindah klub:</strong> Bergabung ke klub baru setelah keluar dari klub lama.</li>
                        <li><strong>Naik kelompok usia:</strong> Memasuki tahun ulang tahun yang mengubah kategori usia (misal: dari U-18 ke U-21).</li>
                        <li><strong>Perubahan divisi busur:</strong> Berganti dari satu divisi busur ke divisi lain secara resmi.</li>
                        <li><strong>Pembaruan dokumen identitas:</strong> KTP/KIA baru, atau masa berlaku dokumen sebelumnya telah habis.</li>
                        <li><strong>Reset akun:</strong> Akun lama tidak dapat diakses dan perlu dibuat ulang dengan data yang sama.</li>
                    </ul>

                    <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
                        <div>
                            <div class="font-bold text-amber-800 text-sm mb-1">Perhatikan Tenggat Waktu Event</div>
                            <div class="text-amber-700 text-sm">Pastikan registrasi ulang telah selesai <strong>sebelum mendaftar ke event baru</strong>. Panitia event umumnya menggunakan data profil terkini saat proses check-in dilakukan.</div>
                        </div>
                    </div>

                    <h2 id="pindah-klub">Pindah atau Ganti Klub</h2>
                    <p>Jika Anda baru saja pindah klub, segera perbarui informasi klub pada profil pemanah Anda. Klub yang tercantum di profil akan menjadi representasi Anda di setiap event yang diikuti.</p>
                    <ol>
                        <li>Masuk ke <strong>Dasbor Pemanah → Profil Saya</strong>.</li>
                        <li>Klik ikon edit pada bagian <strong>Informasi Klub</strong>.</li>
                        <li>Cari nama klub baru melalui kolom pencarian.</li>
                        <li>Konfirmasi perubahan — sistem akan mencatat tanggal perubahan afiliasi klub.</li>
                    </ol>
                    <p>Keanggotaan di klub baru sepenuhnya dikelola oleh pengurus klub. Pastikan Anda telah resmi diterima oleh klub sebelum mengubah afiliasi di platform.</p>

                    <h2 id="update-kategori">Perbarui Kategori & Divisi</h2>
                    <p>Archeryhub.id menghitung kelompok usia secara otomatis berdasarkan tanggal lahir yang terdaftar. Namun, divisi busur dapat diperbarui secara manual sesuai kebutuhan kompetisi:</p>
                    <div class="not-prose overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-white">
                                    <th class="px-4 py-3 text-left font-bold rounded-tl-xl">Data</th>
                                    <th class="px-4 py-3 text-left font-bold">Cara Ubah</th>
                                    <th class="px-4 py-3 text-left font-bold rounded-tr-xl">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Kelompok Usia</td>
                                    <td class="px-4 py-3 text-gray-600">Otomatis</td>
                                    <td class="px-4 py-3 text-gray-500">Dihitung dari tanggal lahir</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Divisi Busur</td>
                                    <td class="px-4 py-3 text-gray-600">Manual (edit profil)</td>
                                    <td class="px-4 py-3 text-gray-500">Bisa berbeda per event</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Nama Lengkap</td>
                                    <td class="px-4 py-3 text-gray-600">Manual (edit profil)</td>
                                    <td class="px-4 py-3 text-gray-500">Gunakan nama sesuai KTP</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Tanggal Lahir</td>
                                    <td class="px-4 py-3 text-gray-600">Hubungi dukungan</td>
                                    <td class="px-4 py-3 text-gray-500">Perlu verifikasi dokumen</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="verifikasi-identitas">Verifikasi Identitas Ulang</h2>
                    <p>Beberapa event dapat mensyaratkan verifikasi identitas yang diperbarui, terutama untuk event dengan kategori resmi atau berhadiah. Jika verifikasi Anda telah kedaluwarsa atau ditolak, ikuti langkah berikut:</p>
                    <ul>
                        <li>Siapkan foto KTP/KIA yang masih berlaku (format JPEG/PNG, maks. 5MB).</li>
                        <li>Buka <strong>Profil Saya → Verifikasi Identitas</strong>.</li>
                        <li>Unggah dokumen dan tunggu proses tinjauan oleh tim Archeryhub.id (1–2 hari kerja).</li>
                        <li>Status verifikasi akan diperbarui dan notifikasi dikirim ke email terdaftar.</li>
                    </ul>

                    <h2 id="langkah-langkah">Langkah-Langkah Registrasi Ulang</h2>
                    <p>Berikut ringkasan alur lengkap registrasi ulang akun pemanah:</p>
                    <ol>
                        <li><strong>Login</strong> ke akun Archeryhub.id Anda.</li>
                        <li>Buka <strong>Dasbor → Profil Saya → Edit Profil</strong>.</li>
                        <li>Perbarui data yang berubah: nama, tanggal lahir, klub, divisi busur, dan foto profil.</li>
                        <li>Simpan perubahan dengan klik <strong>Simpan Profil</strong>.</li>
                        <li>Jika ada dokumen identitas yang perlu diperbarui, unggah di bagian <strong>Verifikasi Identitas</strong>.</li>
                        <li>Tunggu konfirmasi dari sistem (untuk perubahan yang memerlukan verifikasi manual).</li>
                    </ol>

                    <h2 id="dampak">Dampak pada Riwayat & Prestasi</h2>
                    <p>Registrasi ulang <strong>tidak menghapus</strong> riwayat prestasi dan skor yang telah tercatat. Semua data pertandingan sebelumnya tetap tersimpan dan terhubung ke akun Anda, bahkan setelah perubahan keanggotaan klubatau divisi.</p>
                    <ul>
                        <li>Riwayat skor dan ranking tetap dipertahankan.</li>
                        <li>Sertifikat dan penghargaan digital tetap dapat diakses.</li>
                        <li>Bila berganti klub, prestasi lama tetap muncul dengan label klub asal saat event berlangsung.</li>
                    </ul>
                    <p>Jika menemui kendala saat registrasi ulang, hubungi dukungan melalui fitur chat di aplikasi atau kirim email ke support@archeryhub.id.</p>
                `
}
