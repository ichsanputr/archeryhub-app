export const fase_eliminasi = {
    slug: 'fase-eliminasi',
    title: 'Elimination Phase in an Archery Competition',
    excerpt: 'Understand the bracket format, set system, tie-break mechanism, and the relationship between qualification and elimination in archery competitions.',
    icon: 'ph:git-branch-bold',
    category: 'archery',
    readTime: '6 min',
    toc: [
        { id: 'apa-itu-eliminasi', level: 2, text: 'What is the Elimination Phase?' },
        { id: 'format-bracket', level: 2, text: 'Bracket Format' },
        { id: 'sistem-set', level: 2, text: 'Set System' },
        { id: 'sistem-poin-kumulatif', level: 2, text: 'Cumulative Point System (Compound)' },
        { id: 'tie-break-shootoff', level: 2, text: 'Tie-Break & Shoot-Off' },
        { id: 'hubungan-kualifikasi', level: 2, text: 'Relationship between Elimination and Qualification' },
        { id: 'eliminasi-di-Archeris', level: 2, text: 'Elimination at archeris.net' },
    ],
    content: `
        <h2 id="what-is-elimination">What is the Elimination Phase?</h2>
        <p><strong>The elimination phase</strong> is the second round of the archery competition where participants compete <em>head-to-head</em> (one on one) based on the bracket compiled from the qualifying results. Each match produces one winner who moves on to the next round, and one participant who falls. This round continues until one winner remains as champion.</p>
        <p>This format was popularized by World Archery since the 1988 Olympics and is now the standard in almost all major archery competitions in the world, including championships facilitated by archeris.net.</p>

        <h2 id="format-bracket">Format Bracket</h2>
        <p>Elimination brackets are available in various sizes, adjusted to the number of participants who qualify:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Bracket Size</th>
                        <th class="px-4 py-3">Number of Participants</th>
                        <th class="px-4 py-3 rounded-tr-xl">Half</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">Top 32</td><td class="px-4 py-3">32 participants</td><td class="px-4 py-3">Rounds 32, 16, 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Top 16</td><td class="px-4 py-3">16 participants</td><td class="px-4 py-3">Round 16, 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Top 8</td><td class="px-4 py-3">8 participants</td><td class="px-4 py-3">Round 8, 4, Final</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Top 4</td><td class="px-4 py-3">4 participants</td><td class="px-4 py-3">Semi Final, Final</td></tr>
                </tbody>
            </table>
        </div>
        <p><strong>Seeding bracket method:</strong> Participant #1 (best qualifying ranking) is placed on the opposite side to participant #2 so that the potential for a new meeting between the two will occur in the final round. Rank #1 meets the last place to qualify; #2 meets second from bottom; and so on.</p>

        <h2 id="set-system">Set System</h2>
        <p>Used for the <strong>Recurve</strong>, Standard Bow, and Barebow divisions. In one match, both athletes shoot several <em>sets</em>, each set consisting of 3 arrows (outdoor) or 3 arrows (indoor). The winner of each set is determined by who gets the highest total points in that set:</p>
        <ul>
            <li>Win the set → get <strong>2 set points</strong></li>
            <li>Draw in a set → each gets <strong>1 set point</strong></li>
            <li>Losing a set → getting <strong>0 set points</strong></li>
        </ul>
        <p>The first athlete to reach <strong>6 set points</strong> wins the match. If both athletes reach 5–5, the match goes to a <strong>shoot-off</strong> (see Tie-Break section below).</p>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 mb-2 flex gap-4">
            <div class="text-primary text-2xl shrink-0">🎯</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Why was the Set System created?</div>
                <div class="text-gray-600 text-sm">The set system is deliberately designed so that each end feels like a "small match". One mistake doesn't immediately kill a chance—but consistency per set is key. This makes the eliminations more dramatic and interesting for the audience.</div>
            </div>
        </div>

        <h2 id="cumulative-point-system">Cumulative Point System (Compound)</h2>
        <p>The <strong>Compound</strong> division uses a different format: all arrows in an entire end are added together directly. The athlete with the highest cumulative point total after all finishes wins the event. There are no set points — each arrow has a direct effect on the final total.</p>
        <p>This reflects the characteristics of compound: with high accuracy, the difference in scores is usually very small and each arrow is truly decisive.</p>

        <h2 id="tie-break-shootoff">Tie-Break & Shoot-Off</h2>
        <p>If the match ends in a draw after all regular ends/sets have been completed, a <strong>shoot-off</strong> takes place:</p>
        <ol>
            <li>Each athlete shoots <strong>1 arrow</strong> at the target.</li>
            <li>The athlete with the highest arrow value wins.</li>
            <li>If there is still a tie, the winner is determined by the arrow that is <strong>closer to the center</strong> (measured).</li>
        </ol>
        <p>The shoot-off is the most tense moment in elimination — one single arrow determines who goes on and who goes home.</p>

        <h2 id="qualification-relationship">Relationship of Eliminations to Qualifications — Why Athletes Need Both</h2>
        <p>Qualification and elimination are <strong>not two separate races</strong> — they are one integrated, interdependent system. Here are the reasons why each athlete must understand and prepare for these two phases differently:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Aspect</th>
                        <th class="px-4 py-3">Qualifications</th>
                        <th class="px-4 py-3 rounded-tr-xl">Elimination</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Destination</td>
                        <td class="px-4 py-3">Determine ranking & who passes</td>
                        <td class="px-4 py-3">Determine the champion through head-to-head</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Opponent</td>
                        <td class="px-4 py-3">None — against own target</td>
                        <td class="px-4 py-3">One ​​specific athlete per heat</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Mental stress</td>
                        <td class="px-4 py-3">Accumulative — must be stable tens of arrows</td>
                        <td class="px-4 py-3">Situational — every set can turn around</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Strategy</td>
                        <td class="px-4 py-3">Consistency, rhythm, energy management</td>
                        <td class="px-4 py-3">Adaptation, momentum, reading opponents</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Error</td>
                        <td class="px-4 py-3">Directly affects the total score</td>
                        <td class="px-4 py-3">Can be caught in the next set</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Result</td>
                        <td class="px-4 py-3">Ranking → position in bracket</td>
                        <td class="px-4 py-3">Final position: champion, runner-up, etc.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>In short: <strong>good qualifiers open up an easier path to elimination</strong> — you have a weaker seeding opponent in the early rounds, and you are on the advantageous side of the bracket. However, even perfect qualifications do not guarantee an elimination win, because the head-to-head nature means that anyone can lose on different days.</p>
        <p>That's why a good athlete's training program should include <em>both</em> types of mental training: long-term consistent scoring practice (for qualifying), and situational pressure shot practice (for eliminations).</p>

        <h2 id="elimination-on-Archeris">Elimination on archeris.net</h2>
        <p>Event organizers at archeris.net can manage the elimination phase through the <strong>Elimination</strong> module which is integrated with the qualification results. Main features:</p>
        <ul>
            <li><strong>Automatically generate brackets</strong> from qualifying rankings with one click.</li>
            <li>Support 4/8/16/32 large brackets per category.</li>
            <li>Input set scores or cumulative points directly from the mobile app or dashboard.</li>
            <li>Real-time bracket visualization — can be displayed on the venue's TV/display screen.</li>
            <li>Add an <strong>Additional End</strong> if there is a tie at the end of the match, without having to reset all data.</li>
            <li>Print the brackets in PDF format for archiving or sticking at the venue.</li>
        </ul>
`
}


