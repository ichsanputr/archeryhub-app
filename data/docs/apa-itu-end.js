export const apa_itu_end = {
    slug: 'apa-itu-end',
    title: 'What is END in Archery?',
    excerpt: 'Understand the concept of the "end" as the basic unit of shot in a qualifying session, how it works, and its impact on an athletes total score.',
    icon: 'ph:arrows-in-bold',
    category: 'archery',
    readTime: '4 min',
    toc: [
        { id: 'definisi-end', level: 2, text: 'Definition of End' },
        { id: 'berapa-panah-per-end', level: 2, text: 'How Many Arrows per End?' },
        { id: 'alur-satu-end', level: 2, text: 'One End Plot from Beginning to End' },
        { id: 'end-dan-total-skor', level: 2, text: 'End and Total Score' },
        { id: 'end-di-eliminasi', level: 2, text: 'End in Elimination Context' },
        { id: 'end-di-Archeris', level: 2, text: 'End on the archeris.net platform' },
    ],
    content: `
        <h2 id="end-definition">End Definition</h2>
        <p>In competitive archery, <strong>end</strong> (Indonesian: <em>shooting round</em> or <em>shooting round</em>) is a unit of shooting in which an athlete shoots a predetermined number of arrows at a target in a period of time, before advancing to take and recording the score.</p>
        <p>Simply put: <strong>end = one turn to shoot</strong>. After all the athletes in one group have finished shooting their arrows for one end, the entire group advances together to the target line to record scores and remove arrows, then return to the shooting line to start the next end.</p>

        <h2 id="how-many-arrows-per-end">How many Arrows per End?</h2>
        <p>The number of arrows per end varies depending on the competition format:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Format / Context</th>
                        <th class="px-4 py-3 text-center">Arrows per End</th>
                        <th class="px-4 py-3 rounded-tr-xl">Description</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Outdoor Qualification (720 Round)</td>
                        <td class="px-4 py-3 text-center font-bold">6</td>
                        <td class="px-4 py-3">12 ends × 6 arrows = 72 arrows total</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Indoor Qualification (18/25 m)</td>
                        <td class="px-4 py-3 text-center font-bold">3</td>
                        <td class="px-4 py-3">20 ends × 3 arrows = 60 arrows total</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Recurve Elimination (Set System)</td>
                        <td class="px-4 py-3 text-center font-bold">3</td>
                        <td class="px-4 py-3">Each set = 1 end, winner of the set gets 2 set points</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Compound Elimination</td>
                        <td class="px-4 py-3 text-center font-bold">3 or 6</td>
                        <td class="px-4 py-3">Number of end × arrows configured per event</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Custom Event (archeris.net)</td>
                        <td class="px-4 py-3 text-center font-bold">1 – 6</td>
                        <td class="px-4 py-3">Freely configurable by committee</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 id="one-end-flow">One-End Flow from Beginning to End</h2>
        <p>The following is the sequence of events at one end in the field:</p>
        <ol>
            <li><strong>Start signal</strong> — The committee or system gives a signal (usually a bell or whistle).</li>
            <li><strong>Running time</strong> — The athlete takes a stance and shoots the number of arrows specified for that end. There is a time limit (generally 2 minutes for 3 arrows, or 4 minutes for 6 arrows).</li>
            <li><strong>Completion signal</strong> — All athletes stop shooting.</li>
            <li><strong>Advance to target</strong> — All athletes walk together to the target line.</li>
            <li><strong>Record the score</strong> — The value of each arrow is read and recorded (by the scorekeeper or the athlete themselves). Recording order: from highest to lowest value (for example: X, 10, 9, 8, M).</li>
            <li><strong>Remove the arrow</strong> — Once all values ​​are recorded and confirmed, the arrow is removed from the target.</li>
            <li><strong>Return to firing line</strong> — Next end begins.</li>
        </ol>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">⏱️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Time Limit per End</div>
                <div class="text-gray-600 text-sm">Shooting past the time limit results in the last arrow shot being declared <strong>M (miss/0 points)</strong>, according to World Archery regulations. Time management per end is an important part of athlete competition.</div>
            </div>
        </div>

        <h2 id="end-and-total-score">End and Total Score</h2>
        <p>An athlete's qualifying score is <strong>the total number of points from all arrows at all ends</strong>. For example, in the format 720 Round (12 ends × 6 arrows):</p>
        <ul>
            <li>Each end produces a subtotal of 6 arrows (maximum 60 points per end if all 10).</li>
            <li>Total 12 ends added up → final score (maximum 720 points, hence the name "720 Round").</li>
        </ul>
        <p>This is where <em>consistency per end</em> is important: an athlete who averages 55 points per end will beat an athlete who gets 60 at some ends but 40 at others.</p>

        <h2 id="end-eliminated">End in Elimination Context</h2>
        <p>In head-to-head elimination, each end in the <strong>Set System</strong> (Recurve) format is also called a <em>set</em>. The winner of each set (end) does not immediately win the match, but instead gets <strong>set points</strong>. The match is won by the athlete who first collects 6 set points.</p>
        <p>For the <strong>Compound</strong> format, ends are still cumulative — there are no set points, all arrows from all ends are added up to determine the winner of the match.</p>

        <h2 id="end-at-Archeris">End at archeris.net Platform</h2>
        <p>When organizers create a qualifying session on archeris.net, they fill in two main parameters:</p>
        <ul>
            <li><strong>Number of Ends</strong> — How many ends will be shot in the session.</li>
            <li><strong>Arrows per End</strong> — How many arrows are shot per end.</li>
        </ul>
        <p>These two numbers produce the total arrows per athlete (Number of Ends × Arrows per End), which appears on the scoresheet and is used to validate the score input. The system will not allow the score to be submitted if the number of arrows filled in does not match the predefined end configuration.</p>
`
}


