export const fase_kualifikasi = {
    slug: 'fase-kualifikasi',
    title: 'Qualification Phase in Archery Competitions',
    excerpt: 'Understand the purpose, format and mechanics of the qualifying phase — the foundation of any modern archery competition.',
    icon: 'ph:chart-line-up-bold',
    category: 'archery',
    readTime: '5 min',
    toc: [
        { id: 'apa-itu-kualifikasi', level: 2, text: 'What is the Qualification Phase?' },
        { id: 'format-round', level: 2, text: 'Round Format Used' },
        { id: 'sistem-penilaian', level: 2, text: 'Scoring & Tie-Break System' },
        { id: 'hasil-kualifikasi', level: 2, text: 'What Do Qualification Results Determine?' },
        { id: 'mengapa-kualifikasi-penting', level: 2, text: 'Why is this phase so important?' },
        { id: 'kualifikasi-di-Archeris', level: 2, text: 'Qualification on the archeris.net Platform' },
    ],
    content: `
        <h2 id="what-is-qualification">What is the Qualification Phase?</h2>
        <p>In archery competitions, the <strong>qualification phase</strong> (also called the <em>ranking round</em>) is the first round in which all competitors shoot a certain number of arrows at the same target under equal conditions. Each arrow is given a point value based on the target zone it hits, then the total points are collected to determine the <em>ranking</em> of each athlete.</p>
        <p>Qualification is usually carried out in one or two sessions, depending on the event format and number of participants.</p>

        <h2 id="format-round">Round Format Used</h2>
        <p>Various round formats are used in qualifying, adapted to the level and event regulations:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Format</th>
                        <th class="px-4 py-3">Distance</th>
                        <th class="px-4 py-3">Number of Arrows</th>
                        <th class="px-4 py-3 rounded-tr-xl">Used By</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">720 Round</td><td class="px-4 py-3">50–70 m</td><td class="px-4 py-3">72 arrows (6 arrows × 12 ends)</td><td class="px-4 py-3">Recurve, Standard Bow (outdoor)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">1440 Round</td><td class="px-4 py-3">90/70/50/30 m</td><td class="px-4 py-3">144 arrow</td><td class="px-4 py-3">Recurve (full competition)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">25 m Indoor</td><td class="px-4 py-3">18 m / 25 m</td><td class="px-4 py-3">60 arrows (3 arrows × 20 ends)</td><td class="px-4 py-3">All divisions (indoor)</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Field Round</td><td class="px-4 py-3">Varies</td><td class="px-4 py-3">24 or 48 targets</td><td class="px-4 py-3">Field archery</td></tr>
                </tbody>
            </table>
        </div>
        <p>Each <em>end</em> consists of several arrows (generally 3 or 6) shot over a period of time, then the value is recorded before the next end begins.</p>

        <h2 id="scoring-system">Scoring & Tie-Break System</h2>
        <p>The value per arrow is determined by the target zone in question:</p>
        <ul>
            <li><strong>10 (Gold in)</strong> — The inner circle (X), worth 10 points, is counted separately as a tie-breaker.</li>
            <li><strong>9, 8, 7 …</strong> — Next zone in sequence out from the center.</li>
            <li><strong>M (Miss)</strong> — The arrow did not hit the target or fell, value 0.</li>
        </ul>
        <p>If two or more athletes have the same total points, the <em>tie-break</em> is determined sequentially by:</p>
        <ol>
            <li>Number of arrows <strong>X</strong> (10 in)</li>
            <li>Number of arrows <strong>10+X</strong></li>
            <li>Number of arrows <strong>9+10+X</strong>, etc.</li>
        </ol>

        <h2 id="qualification-results">What Do Qualification Results Determine?</h2>
        <p>Qualification results produce a <strong>ranking list</strong> (seeding list) per category/division. This ranking determines:</p>
        <ul>
            <li><strong>Who advances to the elimination round</strong> — Only the top number of participants (usually the top 8, 16, or 32) move on to the head-to-head elimination phase.</li>
            <li><strong>Elimination bracket position</strong> — The #1 ranked qualifier will compete against the last ranked qualifier; this format is called <em>bracket seeding</em>.</li>
            <li><strong>Qualifying awards</strong> — Some events award a separate title or medal to the winner of the qualifying round.</li>
        </ul>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🏹</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Qualification ≠ "Preliminary Round" only</div>
                <div class="text-gray-600 text-sm">A good qualifying ranking gives you a big advantage in eliminations: you get (theoretically) weaker opponents in the early rounds and get an easier "side" of the bracket. Athletes ranked #1 almost always avoid meeting fellow seeds until the finals.</div>
            </div>
        </div>

        <h2 id="why-qualification-important">Why Is This Phase So Important For Every Athlete?</h2>
        <p>Many novice athletes consider qualifying as a mere formality — when in fact qualifying is the stage that most determines their <em>travel path</em> in competition. Here's why:</p>
        <ul>
            <li><strong>Consistency tested</strong> — Qualification shoots multiple arrows over a long duration, demanding steady concentration and stamina from start to finish.</li>
            <li><strong>There is no "second chance"</strong> — Unlike eliminations where fate can be reversed in one end, one missed arrow in qualifying cannot be repeated and immediately affects the total score.</li>
            <li><strong>Mental pressure is different</strong> — Qualifying is "accumulative" pressure (must be consistent tens of arrows), while elimination is "per moment" pressure. The mental preparation for both is different.</li>
            <li><strong>Seeding determines the course of the tournament</strong> — Athletes who are serious about qualifying statistically have a higher chance of going far in elimination due to favorable seeding.</li>
        </ul>

        <h2 id="qualification-on-Archeris">Qualification on the archeris.net Platform</h2>
        <p>At archeris.net, the qualification phase is facilitated through the <strong>Qualification</strong> module owned by the subscription event committee. Available features:</p>
        <ul>
            <li>Creation of a qualifying session with free configuration (number of ends, arrows per end, distance).</li>
            <li>Auto-assign participants to pads randomly or manually.</li>
            <li>Input scores via mobile app <em>or</em> web dashboard by scorekeeper / athlete himself.</li>
            <li>Real-time leaderboard per category with automatic tie-break.</li>
            <li>Print the scoresheet per session in PDF format.</li>
            <li>Generate ranking automatically to be used as seeding in the elimination round.</li>
        </ul>
`
}


