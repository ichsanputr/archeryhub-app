export const scorekeeper = {
    slug: 'scorekeeper', title: 'Manajemen Scorekeeper', excerpt: 'Panduan mengelola akun scorekeeper: pembuatan akun, assignment, dan kontrol akses.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '5 menit',
    toc: [
        { id: 'buat-scorekeeper', level: 2, text: 'Membuat Akun Scorekeeper' },
        { id: 'assignment-scorekeeper', level: 2, text: 'Assignment ke Lapangan/Sesi' },
        { id: 'kontrol-akses', level: 2, text: 'Kontrol Akses dan Keamanan' },
    ],
    content: `
                    <h2 id="buat-scorekeeper">Membuat Akun Scorekeeper</h2>
                    <p>Panitia membuat akun scorekeeper dari dashboard organisasi. Gunakan identitas yang jelas agar setiap input skor mudah ditelusuri.</p>
                    <img src="/docs/organization-manajemen-scorekeeper.png" alt="Manajemen Scorekeeper" />

                    <h2 id="assignment-scorekeeper">Assignment ke Lapangan/Sesi</h2>
                    <p>Setelah akun aktif, tetapkan scorekeeper ke sesi/target tertentu. Assignment yang rapi membantu mengurangi tumpang tindih tanggung jawab di lapangan.</p>
                    <img src="/docs/event-assign-target.png" alt="Assignment Target" />
                    <h2 id="kontrol-akses">Kontrol Akses dan Keamanan</h2>
                    <ul>
                        <li>Batasi akun scorekeeper hanya untuk input skor.</li>
                        <li>Ganti kredensial jika terjadi rotasi petugas.</li>
                        <li>Audit aktivitas secara berkala untuk menjaga integritas hasil pertandingan.</li>
                    </ul>
                `
}
