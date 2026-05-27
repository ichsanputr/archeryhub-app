export const membuat_event = {
    slug: 'membuat-event', title: 'Membuat dan Mempublish Event', excerpt: 'Panduan lengkap merancang event dari draft, konfigurasi kategori, hingga rilis publik.', icon: 'ph:plus-square-bold', category: 'event', readTime: '9 menit',
    toc: [
        { id: 'persyaratan', level: 2, text: 'Persyaratan' },
        { id: 'siapkan-data', level: 2, text: 'Data yang Perlu Disiapkan' },
        { id: 'langkah-membuat', level: 2, text: 'Langkah Membuat Event' },
        { id: 'publish', level: 2, text: 'Mempublish Event' },
        { id: 'checklist-pra-rilis', level: 2, text: 'Checklist Pra-Rilis' },
    ],
    content: `
                    <h2 id="persyaratan">Persyaratan</h2>
                    <p>Untuk membuat event, akun Anda harus bertipe <strong>Organisasi</strong> dan memiliki paket berlangganan aktif sesuai kebutuhan modul event yang akan digunakan.</p>
                    <h2 id="siapkan-data">Data yang Perlu Disiapkan</h2>
                    <ul>
                        <li>Nama event dan identitas penyelenggara.</li>
                        <li>Tanggal pelaksanaan, lokasi, dan PIC.</li>
                        <li>Kategori/divisi lomba yang dibuka.</li>
                        <li>Kuota peserta per kategori.</li>
                        <li>Skema pembayaran (gratis/berbayar) dan tenggat pendaftaran.</li>
                    </ul>
                    <h2 id="langkah-membuat">Langkah Membuat Event</h2>
                    <ol>
                        <li>Masuk ke <strong>Dashboard Organisasi -> Event -> Buat Event</strong>.</li>
                        <li>Isi informasi dasar event dan unggah banner.</li>
                        <li>Tambahkan kategori lomba, kuota, and parameter teknis.</li>
                        <li>Konfigurasikan pendaftaran, biaya, serta jadwal penting.</li>
                        <li>Simpan sebagai draft, lalu review data bersama tim panitia.</li>
                    </ol>
                    <img src="/docs/menambahkan-kategori-lomba.png" alt="Menambahkan Kategori Lomba" />
                    <h2 id="publish">Mempublish Event</h2>
                    <p>Setelah validasi selesai, klik <strong>Publish</strong> agar event tampil di halaman publik. Selama periode pendaftaran masih berjalan, Anda tetap bisa melakukan koreksi konten non-kritis.</p>
                    <img src="/docs/printout.png" alt="Output Event & Printout" />
                    <h2 id="checklist-pra-rilis">Checklist Pra-Rilis</h2>
                    <ul>
                        <li>Pastikan semua kategori memiliki kuota dan jadwal.</li>
                        <li>Periksa harga pendaftaran dan status pembayaran.</li>
                        <li>Cek ulang deskripsi event agar tidak menimbulkan interpretasi ganda.</li>
                        <li>Pastikan tim operasional sudah siap memantau pendaftaran masuk.</li>
                    </ul>
                `
}
