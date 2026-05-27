export const jarak_dan_target = {
    slug: 'jarak-dan-target', title: 'Shooting Distance and Target Format', excerpt: 'Standard guide to shooting distances and target face sizes for various archery divisions.', icon: 'ph:ruler-bold', category: 'archery', readTime: '6 min',
    toc: [
        { id: 'standar-jarak', level: 2, text: 'Shooting Distance Standards' },
        { id: 'target-face', level: 2, text: 'Target Face Size' },
        { id: 'skoring-zona', level: 2, text: 'Scoring Zones' },
        { id: 'format-indoor', level: 2, text: 'Indoor vs Outdoor Formats' },
    ],
    content: `
                    <h2 id="standard-distance">Standard Shooting Distance</h2>
                    <p>The shooting distance in archery depends greatly on the bow division and age group of the participant. The following are general standards that are often used in competitions in Indonesia:</p>
                    <ul>
                        <li><strong>Recurve Open (Senior):</strong> 70 Meters</li>
                        <li><strong>Compound Open (Senior):</strong> 50 Meters</li>
                        <li><strong>Standard Bow (General National):</strong> 40 or 50 Meters</li>
                        <li><strong>Barebow:</strong> 20 or 50 Meters (Depending on event regulations)</li>
                        <li><strong>Early Age Group (U-9/U-12):</strong> Starting from 5, 10, 15, to 20 Meters</li>
                    </ul>

                    <h2 id="target-face">Target Face Size</h2>
                    <p>There are several target face sizes that are used based on the shooting distance:</p>
                    <ul>
                        <li><strong>Diameter 122 cm:</strong> Used for long distances (70m & 60m Recurve, as well as National Standard Bow).</li>
                        <li><strong>Diameter 80 cm:</strong> Used for a distance of 50m (Compound and Barebow).</li>
                        <li><strong>Diameter 60/40 cm:</strong> Used for close range or indoor matches.</li>
                        <li><strong>6-Ring Target:</strong> Especially for Compound elimination rounds, targets are often used that only display a 10 to 5 score zone.</li>
                    </ul>

                    <h2 id="skoring-zona">Scoring Zones</h2>
                    <p>The standard target face consists of 5 colors with 2 scoring rings each:</p>
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
                        <div class="bg-yellow-400 p-3 rounded-lg text-center font-bold text-navy">Yellow (9-10)</div>
                        <div class="bg-red-500 p-3 rounded-lg text-center font-bold text-white">Red (7-8)</div>
                        <div class="bg-blue-500 p-3 rounded-lg text-center font-bold text-white">Blue (5-6)</div>
                        <div class="bg-black p-3 rounded-lg text-center font-bold text-white">Black (3-4)</div>
                        <div class="bg-white border border-gray-200 p-3 rounded-lg text-center font-bold text-navy">White (1-2)</div>
                    </div>
                    <p>The highest score is 10 (center). If the arrow hits the line (line cutter), then the highest value it touches is taken.</p>

                    <h2 id="indoor-format">Indoor vs Outdoor Format</h2>
                    <p><strong>Outdoor:</strong> The match is played in an open field. The main challenges for archers are the wind and sunlight factors. The distance used tends to be longer.</p>
                    <p><strong>Indoor:</strong> The match is played indoors with a standard distance of 18 meters. Because there is no wind interference, the archer's accuracy is tested on the consistency of shots on smaller target faces (usually vertical 3-spots).</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📏</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Check Event Handbook</div>
                            <div class="text-gray-600 text-sm">The committee has the authority to adjust the combination of distance and target size. Always read the official event announcement on the archeris.net platform before starting to practice.</div>
                        </div>
                    </div>
`
}

