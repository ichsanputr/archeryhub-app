export const participant_registration = {
  slug: "participant-registration",
  title: "Pendaftaran Peserta ke Event",
  excerpt: "Panduan pendaftaran individu, validasi data, and status pembayaran peserta.",
  icon: "ph:clipboard-text-bold",
  category: "event",
  readTime: "5 menit",
  toc: [
    { id: "daftar-individu", level: 2, text: "Daftar Individu" },
    { id: "validasi-pendaftaran", level: 2, text: "Validasi Data Pendaftaran" },
    { id: "status-pembayaran", level: 2, text: "Status Pembayaran" }
  ],
  content: `
                    <h2 id="daftar-individu">Daftar Individu</h2>
                    <p>Pemanah dapat mendaftar ke event dengan memilih kategori yang sesuai, lalu mengisi formulir pendaftaran yang telah disediakan oleh panitia penyelenggara.</p>
                    <h2 id="validasi-pendaftaran">Validasi Data Pendaftaran</h2>
                    <ul>
                        <li>Pastikan kategori sesuai dengan usia dan jenis busur peserta.</li>
                        <li>Cek kembali data identitas dan kontak peserta sebelum mengirimkan pendaftaran.</li>
                        <li>Pastikan dokumen pendukung (jika diminta) telah diunggah dengan benar.</li>
                    </ul>
                    <h2 id="status-pembayaran">Status Pembayaran</h2>
                    <p>Untuk event yang berbayar, pendaftaran akan dianggap sah setelah pembayaran berhasil diverifikasi oleh sistem atau panitia. Simpan invoice Anda sebagai bukti transaksi.</p>
                `
}
