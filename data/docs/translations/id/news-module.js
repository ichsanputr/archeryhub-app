export const news_module = {
  slug: "news-module",
  title: "Modul Berita & Publikasi",
  excerpt: "Panduan lengkap cara mengelola konten berita, pengumuman, dan artikel edukasi untuk membangun engagement komunitas di archeris.net.",
  icon: "ph:newspaper-clipping-bold",
  category: "platform",
  readTime: "5 menit",
  toc: [
    { id: "pengenalan-news", level: 2, text: "Pengenalan Modul Berita" },
    { id: "membuat-berita", level: 2, text: "Membuat Konten Baru" },
    { id: "kategori-status", level: 2, text: "Kategori & Tingkat Publikasi" },
    { id: "media-seo", level: 2, text: "Optimalisasi Media & SEO" },
    { id: "tampilan-publik", level: 2, text: "Interaksi & Tampilan Publik" }
  ],
  content: `
                    <h2 id="pengenalan-news">Pengenalan Modul Berita</h2>
                    <p>Modul Berita (News) adalah alat komunikasi strategis bagi Organisasi untuk menyampaikan informasi penting kepada seluruh pemanah dan pengunjung platform. Tidak hanya untuk pengumuman resmi, modul ini juga ideal untuk membagikan laporan hasil pertandingan, dokumentasi event, hingga tips edukasi seputar dunia panahan.</p>
                    
                    <h2 id="membuat-berita">Membuat Konten Baru</h2>
                    <p>Melalui dashboard Organisasi, Anda dapat membuat artikel dengan editor teks yang kaya (Rich Text Editor). Beberapa poin utama dalam pembuatan berita meliputi:</p>
                    <img src="/docs/membuat-berita-baru.png" alt="Membuat Berita Baru" />
                    <ul>
                        <li><strong>Judul Berita:</strong> Gunakan judul yang singkat namun informatif dan menarik minat pembaca.</li>
                        <li><strong>Isi Berita:</strong> Anda dapat menambahkan format teks (bold, italic), daftar (bullets/numbers), hingga link tautan internal atau eksternal.</li>
                        <li><strong>Kutipan (Excerpt):</strong> Tuliskan ringkasan 1-2 kalimat yang akan muncul pada halaman daftar berita sebagai gambaran singkat isi artikel.</li>
                    </ul>

                    <h2 id="kategori-status">Kategori & Tingkat Publikasi</h2>
                    <p>Untuk memudahkan navigasi pembaca, setiap berita dikelompokkan ke dalam kategori tertentu:</p>
                    <ul>
                        <li><strong>Event:</strong> Berita terkait pembukaan pendaftaran, perubahan jadwal, atau info teknis lomba.</li>
                        <li><strong>Pengumuman:</strong> Informasi umum terkait organisasi atau kebijakan platform.</li>
                        <li><strong>Prestasi:</strong> Sorotan terhadap pemenang turnamen atau pencapaian atlet binaan.</li>
                        <li><strong>Lainnya:</strong> Artikel edukatif atau tips teknis panahan.</li>
                    </ul>
                    <p>Setiap artikel juga memiliki status <strong>Draft</strong> untuk penyimpanan sementara atau <strong>Published</strong> untuk langsung ditampilkan ke publik.</p>

                    <h2 id="media-seo">Optimalisasi Media & SEO</h2>
                    <p>Membangun konten yang menarik tidak hanya melalui teks, tetapi juga visual dan keterbacaan di mesin pencari:</p>
                    <ul>
                        <li><strong>Gambar Utama:</strong> Anda dapat mengunggah atau memilih foto dari Media Library untuk dijadikan sampul (thumbnail) berita.</li>
                        <li><strong>Sistem Tagging:</strong> Tambahkan tag yang relevan (seperti #turnamen, #barebow) untuk memudahkan pencarian berita serupa.</li>
                        <li><strong>SEO Meta Data:</strong> Anda dapat mengatur judul dan deskripsi meta secara manual untuk memastikan berita Anda tampil rapi saat dibagikan ke media sosial atau muncul di mesin pencari.</li>
                    </ul>

                    <h2 id="tampilan-publik">Interaksi & Tampilan Publik</h2>
                    <p>Di sisi pengunjung (halaman publik), setiap berita dilengkapi dengan fitur interaktif untuk meningkatkan jangkauan konten:</p>
                    <ul>
                        <li><strong>Informasi Penulis & Tanggal:</strong> Menampilkan kredibilitas organisasi sebagai sumber informasi.</li>
                        <li><strong>Estimasi Durasi Baca:</strong> Memberi gambaran kepada pembaca tentang panjang artikel.</li>
                        <li><strong>Fitur Share:</strong> Tombol berbagi langsung ke WhatsApp, Facebook, atau copy tautan untuk memudahkan penyebaran informasi.</li>
                        <li><strong>Artikel Terkait:</strong> Menampilkan rekomendasi berita lain yang relevan di bagian samping agar pembaca tetap terhubung dengan konten Anda.</li>
                        <li><strong>Newsletter Subscription:</strong> Pengunjung dapat mendaftarkan email mereka untuk berlangganan update berita terbaru dari organisasi Anda.</li>
                    </ul>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📈</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Strategi Konten</div>
                            <div class="text-gray-600 text-sm">Berita yang disertai gambar berkualitas tinggi dan tag yang tepat cenderung mendapatkan 2x lipat lebih banyak pembaca di platform archeris.net.</div>
                        </div>
                    </div>
                `
}
