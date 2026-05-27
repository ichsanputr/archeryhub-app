export const bow_types = {
  slug: "bow-types",
  title: "Jenis-Jenis Busur Panahan",
  excerpt: "Mengenal Standard Bow, Recurve, Compound, Barebow, Tradisional, dan Longbow.",
  icon: "ph:crosshair-bold",
  category: "archery",
  readTime: "6 menit",
  toc: [
    { id: "standard-bow", level: 2, text: "Standard Bow (Nasional)" },
    { id: "recurve", level: 2, text: "Recurve" },
    { id: "compound", level: 2, text: "Compound" },
    { id: "barebow", level: 2, text: "Barebow" },
    { id: "tradisional", level: 2, text: "Tradisional & Longbow" },
    { id: "perbandingan-busur", level: 2, text: "Perbandingan Busur" }
  ],
  content: `
                    <h2 id="standard-bow">Standard Bow (Nasional)</h2>
                    <p><strong>Standard Bow</strong> atau sering disebut sebagai busur Nasional di Indonesia, adalah jenis busur recurve yang terbuat dari kayu (riser kayu) dan limb fiber. Busur ini sering digunakan sebagai jenjang awal bagi pemula dan memiliki divisi khusus dalam perlombaan nasional PERPANI.</p>
                    <ul>
                        <li>Riser biasanya terbuat dari kayu solid atau laminasi.</li>
                        <li>Aksesori terbatas (sight sederhana, tanpa sistem stabilizer yang kompleks).</li>
                        <li>Sangat populer di sekolah-sekolah dan klub panahan untuk pembinaan usia dini.</li>
                    </ul>

                    <h2 id="recurve">Recurve</h2>
                    <p>Busur <strong>Recurve</strong> adalah jenis busur yang paling umum digunakan dalam kompetisi internasional dan dipertandingkan di Olimpiade. Ujung limb busur ini melengkung menjauhi pemanah, sehingga menghasilkan lebih banyak tenaga.</p>
                    <ul>
                        <li>Diakui oleh World Archery untuk kompetisi internasional.</li>
                        <li>Dapat dilengkapi telescopic sight, stabilizer, v-bar, dan clicker.</li>
                        <li>Riser umumnya terbuat dari aluminium atau karbon tingkat lanjut.</li>
                    </ul>

                    <h2 id="compound">Compound</h2>
                    <p>Busur <strong>Compound</strong> menggunakan sistem katrol (pulley/cam) yang memberikan efek "let-off", yaitu pengurangan berat tarikan saat pemanah mencapai posisi full draw. Ini memungkinkan akurasi yang luar biasa pada jarak jauh.</p>
                    <ul>
                        <li>Sangat stabil dan memiliki kecepatan anak panah yang tinggi.</li>
                        <li>Menggunakan alat bantu bidik berupa scope dengan lensa pembesar dan peep sight.</li>
                        <li>Menggunakan release aid untuk melepaskan tali busur secara mekanis.</li>
                    </ul>

                    <h2 id="barebow">Barebow</h2>
                    <p>Busur <strong>Barebow</strong> pada dasarnya adalah busur recurve modern namun tanpa alat bantu bidik (sight), stabilizer panjang, atau clicker. Pemanah mengandalkan teknik "string walking" atau "face walking" untuk membidik.</p>
                    <ul>
                        <li>Menuntut insting dan teknik dasar yang sangat kuat.</li>
                        <li>Hanya diperbolehkan menggunakan pemberat kecil pada riser yang masuk dalam cincin inspeksi tertentu.</li>
                    </ul>

                    <h2 id="tradisional">Tradisional & Longbow</h2>
                    <p>Busur <strong>Tradisional</strong> mencakup berbagai desain tanpa aksesori modern, seringkali terkait dengan budaya tertentu (seperti Horsebow). <strong>Longbow</strong> adalah busur lurus yang elegan, populer dalam gaya panahan klasik Eropa.</p>

                    <h2 id="perbandingan-busur">Perbandingan Busur</h2>
                    <div class="not-prose overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-left text-white">
                                    <th class="px-4 py-3 rounded-tl-xl">Jenis</th>
                                    <th class="px-4 py-3">Tingkat Kesulitan</th>
                                    <th class="px-4 py-3">Status Olimpiade</th>
                                    <th class="px-4 py-3 rounded-tr-xl">Material Umum</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr><td class="px-4 py-3 font-bold text-navy">Standard Bow</td><td class="px-4 py-3">Rendah-Sedang</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3">Kayu & Fiber</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Recurve</td><td class="px-4 py-3">Sedang</td><td class="px-4 py-3 text-green-600 font-bold">✓ Ya</td><td class="px-4 py-3">Aluminium & Karbon</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Compound</td><td class="px-4 py-3">Sedang-Tinggi</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3">Paduan Logam & Karbon</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Barebow</td><td class="px-4 py-3">Tinggi</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3">Aluminium & Karbon</td></tr>
                            </tbody>
                        </table>
                    </div>
                `
}
