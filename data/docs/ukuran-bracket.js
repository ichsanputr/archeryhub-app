export const ukuran_bracket = {
    slug: 'ukuran-bracket',
    title: 'Elimination Bracket Size',
    excerpt: 'A guide to choosing the right bracket size — how to automatically calculate it, the bye concept, and available options based on the number of participants or teams.',
    icon: 'ph:tree-structure-bold',
    category: 'archery',
    readTime: '4 min',
    toc: [
        { id: 'apa-itu-ukuran-bracket', level: 2, text: 'What is Bracket Size?' },
        { id: 'aturan-pangkat-dua', level: 2, text: 'Power of Two Rule' },
        { id: 'konsep-bye', level: 2, text: 'Bye Concept (Empty Match)' },
        { id: 'kalkulasi-otomatis', level: 2, text: 'archeris.net Automatic Calculations' },
        { id: 'memilih-ukuran', level: 2, text: 'Size Choosing Guide' },
        { id: 'bracket-tim', level: 2, text: 'Bracket for Team Category' },
    ],
    content: `
        <h2 id="what-is-bracket-size">What is Bracket Size?</h2>
        <p><strong>Bracket size</strong> determines how many participant slots are available in the elimination phase. This measure also determines the number of rounds that must be passed until the final, as well as whether any participant gets a bye (free match) in the first round.</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Size</th>
                        <th class="px-4 py-3">Number of Innings</th>
                        <th class="px-4 py-3 rounded-tr-xl">Format Example</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">4 Slots</td><td class="px-4 py-3">2 rounds</td><td class="px-4 py-3">Semifinals → Finals</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">8 Slots</td><td class="px-4 py-3">3 rounds</td><td class="px-4 py-3">Top 8 → Semifinal → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">16 Slots</td><td class="px-4 py-3">4 rounds</td><td class="px-4 py-3">16-Top → … → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">32 Slots</td><td class="px-4 py-3">5 rounds</td><td class="px-4 py-3">Top 32 → … → Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">64 Slots</td><td class="px-4 py-3">6 rounds</td><td class="px-4 py-3">64-Top → … → Final</td></tr>
                </tbody>
            </table>
        </div>

        <h2 id="rule-of-two">Rule of Powers of Two</h2>
        <p>The bracket size <strong>must always be a power of two</strong> (4, 8, 16, 32, 64, …). This rule ensures that each round can produce exactly half the number of previous participants, so that someone always comes out on top without any odd bracket cases.</p>
        <p>This is an international standard used by World Archery, WA Indoor, and all official competitions registered under the Perpani Executive Board.</p>

        <h2 id="bye-concept">Bye Concept (Empty Match)</h2>
        <p>When the number of participants does not fit to fill all bracket slots, some slots are filled with <strong>bye</strong>s — empty matches where participants automatically win without competing. Byes are always given to participants with the lowest qualifying ranking (last seeding) so that the best participants are not affected.</p>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🎯</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Example Bye Scenario</div>
                <div class="text-gray-600 text-sm">If there are 11 participants and bracket 16 is selected, there are 5 byes. Seed participants #12 to. #16 (unfilled slot) gets a bye in the top 16 round and goes straight to the top 8 round.</div>
            </div>
        </div>
        <p>The smaller the selected bracket size compared to the number of participants, the system will use the <strong>"Top-N"</strong> format — only participants with the highest qualifying rankings are included. For example, if there are 30 participants but bracket 16 is selected, only the 16 participants with the highest scores will enter the bracket.</p>

        <h2 id="auto-calculation">archeris.net Auto-Calculation</h2>
        <p>When the committee opens the bracket creation page, the system automatically:</p>
        <ol>
            <li><strong>Count the number of participants (or teams)</strong> who meet the requirements in that category.</li>
            <li><strong>Determine the maximum bracket size</strong> — namely the smallest power of two that can accommodate all participants.</li>
            <li><strong>Displays size options</strong> from 4 to a maximum, in multiples of powers of two, for the committee to select.</li>
        </ol>
        <p>The system also displays a dynamic hint under the selection dropdown:</p>
        <ul>
            <li>If size ≥ number of participants: <em>"30 participants · 2 byes"</em> — all participants enter, with some byes.</li>
            <li>If size &lt; number of participants: <em>"Top 16 of 30 participants based on ranking"</em> — only the top ranking entries.</li>
        </ul>

        <h2 id="choose-size">Guide to Choose Size</h2>
        <p>Consider the following factors when selecting bracket size:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Considerations</th>
                        <th class="px-4 py-3 rounded-tr-xl">Recommendations</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Available times</td>
                        <td class="px-4 py-3">Smaller bracket = fewer rounds = quicker finish</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Inclusivity</td>
                        <td class="px-4 py-3">Maximum bracket ensures all participants take part in at least 1 round of elimination</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Event regulation</td>
                        <td class="px-4 py-3">Some organizers (Perpani, KONI) require certain formats per championship level</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Small number of participants</td>
                        <td class="px-4 py-3">If participants ≤ 4, use bracket 4; forcing a 16 bracket with 4 participants results in too many byes</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Size Locked After Bracket Created</div>
                <div class="text-gray-600 text-sm">Once the bracket has been successfully created, its size cannot be changed. If you want to change the size, the bracket must be deleted and recreated. Make sure the participant composition is final before making a bracket.</div>
            </div>
        </div>

        <h2 id="team-bracket">Bracket for Team Category</h2>
        <p>For the team category, the concept of bracket size works in the same way, but the number of participants is replaced by the number of teams:</p>
        <ul>
            <li>If there are already synchronized teams, the number of teams is used as the basis for the calculation.</li>
            <li>If synchronization has not been performed, the system uses <strong>team estimates</strong> from existing qualification data.</li>
            <li>The committee is advised to run <a href="/docs/team-sync">Team Synchronization</a> first before creating team brackets so that the numbers displayed are accurate.</li>
        </ul>
`,
}

