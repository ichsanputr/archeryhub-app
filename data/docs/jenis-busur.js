export const jenis_busur = {
  slug: 'jenis-busur', title: 'Types of Archery Bows', excerpt: 'Get to know Standard Bow, Recurve, Compound, Barebow, Traditional, and Longbow.', icon: 'ph:crosshair-bold', category: 'archery', readTime: '6 min',
  toc: [
    { id: 'standard-bow', level: 2, text: 'Standard Bow (National)' },
    { id: 'recurve', level: 2, text: 'Recurve' },
    { id: 'compound', level: 2, text: 'Compound' },
    { id: 'barebow', level: 2, text: 'Barebow' },
    { id: 'tradisional', level: 2, text: 'Traditional & Longbow' },
    { id: 'perbandingan-busur', level: 2, text: 'Arc Comparison' },
  ],
  content: `
                    <h2 id="standard-bow">Standard Bow (National)</h2>
                    <p><strong>Standard Bow</strong> or often referred to as the National Bow in Indonesia, is a type of recurve bow made from wood (wooden riser) and limb fiber. This bow is often used as an initial level for beginners and has a special division in the PERPANI national competition.</p>
                    <ul>
                        <li>Riser is usually made of solid wood or laminate.</li>
                        <li>Limited accessories (simple sight, no complex stabilizer system).</li>
                        <li>Very popular in schools and archery clubs for early childhood development.</li>
                    </ul>

                    <h2 id="recurve">Recurve</h2>
                    <p>The <strong>Recurve</strong> bow is the most common type of bow used in international competitions and competed in the Olympics. The tip of the bow limb curves away from the archer, thus producing more power.</p>
                    <ul>
                        <li>Recognized by World Archery for international competitions.</li>
                        <li>Can be equipped with a telescopic sight, stabilizer, v-bar, and clicker.</li>
                        <li>Risers are generally made of advanced aluminum or carbon.</li>
                    </ul>

                    <h2 id="compound">Compound</h2>
                    <p>Compound bows use a pulley system (pulley/cam) which provides a "let-off" effect, namely a reduction in draw weight when the archer reaches the full draw position. This allows for exceptional accuracy at long distances.</p>
                    <ul>
                        <li>Very stable and has high arrow speed.</li>
                        <li>Use aiming aids in the form of a scope with a magnifying lens and peep sight.</li>
                        <li>Uses a release aid to release the bowstring mechanically.</li>
                    </ul>

                    <h2 id="barebow">Barebow</h2>
                    <p>Barebow bows are basically modern recurve bows but without sights, long stabilizers, or clickers. Archers rely on "string walking" or "face walking" techniques to aim.</p>
                    <ul>
                        <li>Demands very strong basic instincts and techniques.</li>
                        <li>It is only permitted to use small weights on risers that fall within a particular inspection ring.</li>
                    </ul>

                    <h2 id="traditional">Traditional & Longbow</h2>
                    <p>Traditional Bows include a variety of designs without modern accessories, often associated with a specific culture (such as the Horsebow). <strong>Longbow</strong> is an elegant straight bow, popular in classic European archery styles.</p>

                    <h2 id="arc-comparison">Arc-Comparison</h2>
                    <div class="not-process overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <head>
                                <tr class="bg-navy text-left text-white">
                                    <th class="px-4 py-3 rounded-tl-xl">Type</th>
                                    <th class="px-4 py-3">Difficulty Level</th>
                                    <th class="px-4 py-3">Olympic Status</th>
                                    <th class="px-4 py-3 rounded-tr-xl">General Materials</th>
                                </tr>
                            </head>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr><td class="px-4 py-3 font-bold text-navy">Standard Bow</td><td class="px-4 py-3">Low-Medium</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3">Wood & Fiber</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Recurve</td><td class="px-4 py-3">Medium</td><td class="px-4 py-3 text-green-600 font-bold">✓ Yes</td><td class="px-4 py-3">Aluminum & Carbon</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Compound</td><td class="px-4 py-3">Medium-High</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3">Metal & Carbon Alloys</td></tr>
                                <tr><td class="px-4 py-3 font-bold text-navy">Barebow</td><td class="px-4 py-3">Tall</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3">Aluminum & Carbon</td></tr>
                            </tbody>
                        </table>
                    </div>
`
}
