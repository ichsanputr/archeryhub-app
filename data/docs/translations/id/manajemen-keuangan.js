export const manajemen_keuangan = {
    slug: 'manajemen-keuangan', title: 'Manajemen Keuangan & Saldo', excerpt: 'Panduan lengkap pengelolaan penghasilan, saldo, dan pengaturan rekening bank pada dashboard Organisasi.', icon: 'ph:wallet-bold', category: 'platform', readTime: '6 menit',
    toc: [
        { id: 'penghasilan-saya', level: 2, text: 'Menu Penghasilan Saya' },
        { id: 'saldo-organisasi', level: 2, text: 'Saldo & Riwayat Transaksi' },
        { id: 'rekening-bank', level: 2, text: 'Pengaturan Rekening Bank' },
        { id: 'withdraw-hasi', level: 2, text: 'Penarikan Dana (Withdrawal)' },
    ],
    content: `
                    <h2 id="penghasilan-saya">Menu Penghasilan Saya</h2>
                    <p>Melalui menu <strong>Keuangan > Penghasilan Saya</strong>, Anda dapat melihat rangkuman performa finansial organisasi Anda. Halaman ini menyajikan data statistik pendapatan dari seluruh event yang Anda selenggarakan, dipisahkan berdasarkan status pembayaran peserta.</p>
                    <img src="/docs/organization-menu-penghasilan-saya.png" alt="Menu Penghasilan Saya" />
                    
                    <h2 id="saldo-organisasi">Saldo & Riwayat Transaksi</h2>
                    <p>Seluruh dana hasil pendaftaran yang telah diverifikasi (status Paid) akan masuk ke dalam <strong>Saldo Organisasi</strong> Anda. Sistem archeris.net mencatat setiap mutasi saldo secara detail:</p>
                    <ul>
                        <li><strong>Dana Masuk:</strong> Pendapatan bersih dari pendaftaran peserta setelah dikurangi biaya layanan platform.</li>
                        <li><strong>Dana Keluar:</strong> Riwayat penarikan dana (withdrawal) yang telah Anda lakukan ke rekening bank terdaftar.</li>
                    </ul>
                    <img src="/docs/organization-menu-keuangan-saldo.png" alt="Saldo & Riwayat Transaksi" />

                    <h2 id="rekening-bank">Pengaturan Rekening Bank</h2>
                    <p>Untuk dapat menarik dana, Anda wajib mendaftarkan nomor rekening bank di menu <strong>Settings > Bank Account</strong>. Beberapa hal yang perlu diperhatikan:</p>
                    <ul>
                        <li>Pastikan nama pemilik rekening sesuai dengan nama organisasi atau penanggung jawab yang sah.</li>
                        <li>Data rekening ini akan melalui proses verifikasi keamanan sebelum dapat digunakan untuk penarikan.</li>
                        <li>Anda dapat mengubah data rekening kapan saja, namun proses verifikasi mungkin akan dilakukan kembali untuk keamanan dana Anda.</li>
                    </ul>
                    <img src="/docs/organization-rekening-bank.png" alt="Pengaturan Rekening Bank" />

                    <h2 id="withdraw-hasi">Penarikan Dana (Withdrawal)</h2>
                    <p>Penarikan dana dapat dilakukan secara fleksibel dari saldo yang tersedia. Anda cukup memasukkan nominal penarikan, dan sistem akan memproses transfer ke rekening bank Anda dalam kurun waktu 1-3 hari kerja (tergantung kebijakan bank masing-masing).</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">�️</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Keamanan Finansial</div>
                            <div class="text-gray-600 text-sm">archeris.net menggunakan sistem keamanan berlapis untuk setiap transaksi keuangan. Pastikan Anda tidak membagikan kredensial login atau kode verifikasi kepada pihak manapun demi keamanan saldo organisasi Anda.</div>
                        </div>
                    </div>
                `
}

