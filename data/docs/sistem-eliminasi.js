export const sistem_eliminasi = {
  slug: 'sistem-eliminasi', title: 'Sistem Pertandingan Eliminasi', excerpt: 'Bracket eliminasi, mekanisme tie, dan additional end pada mode scoring pertandingan.', icon: 'ph:git-branch-bold', category: 'scoring', readTime: '8 menit',
  toc: [{ id: 'bracket', level: 2, text: 'Membuat Bracket' }, { id: 'generate-otomatis', level: 2, text: 'Generate Otomatis' }, { id: 'skor-set', level: 2, text: 'Sistem Skor Set' }, { id: 'tie-mechanism', level: 2, text: 'Mekanisme Tie (Seri)' }, { id: 'additional-end', level: 2, text: 'Additional End di Dashboard' }],
  content: `
          <h2 id="bracket">Membuat Bracket</h2>
          <p>Setelah kualifikasi selesai, panitia membuat bracket eliminasi per kategori/divisi. Penempatan peserta dapat dilakukan manual atau otomatis berdasarkan ranking.</p>
          <h2 id="generate-otomatis">Generate Otomatis</h2>
          <p>Mode generate otomatis menyusun seeding dari hasil kualifikasi. Sistem umumnya mendukung format 32/16/8/4 besar sesuai jumlah peserta lolos.</p>
          <h2 id="skor-set">Sistem Skor Set</h2>
          <p>Untuk recurve eliminasi, set system digunakan: pemenang set mendapat 2 poin, seri 1-1, kalah 0. Pemenang match ditentukan saat mencapai ambang poin set (umumnya 6).</p>
          <h2 id="tie-mechanism">Mekanisme Tie (Seri)</h2>
          <p>Jika skor match berakhir seri pada ambang akhir, pertandingan masuk ke mekanisme tie-break. Pada praktik lapangan, tie-break bisa berupa shoot-off / additional end sesuai konfigurasi dan regulasi event.</p>
          <p>Prinsip pentingnya: sistem harus mencatat hasil tie-break secara eksplisit agar winner bracket tidak ambigu dan histori scoring tetap audit-friendly.</p>
          <h2 id="additional-end">Penambahan End (Additional End)</h2>
          <p>Dalam situasi di mana hasil pertandingan tetap seri setelah seluruh end reguler selesai, operator dashboard dapat menambahkan <strong>Additional End</strong> (End Tambahan) sebagai penentu kemenangan.</p>
          <p>Fitur ini dapat diakses langsung melalui tombol kontrol pada layar Scoring Match di Dashboard Organisasi. Setelah nilai end tambahan diinput, sistem akan secara otomatis menentukan pemenang dan memperbarui bagan bracket ke babak selanjutnya tanpa perlu intervensi manual tambahan.</p>
        `
}
