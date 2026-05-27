export const penempatan_bantalan = {
    slug: 'penempatan-bantalan',
    title: 'Draw Type & Automatic Placement of Bearings',
    excerpt: 'Guide to choosing the type of draw (random, manual, or ranking) and how the automatic assignment feature of participants to pads in qualifying sessions works.',
    icon: 'ph:shuffle-bold',
    category: 'archery',
    readTime: '5 min',
    toc: [
        { id: 'apa-itu-draw', level: 2, text: 'What is Draw?' },
        { id: 'tipe-draw', level: 2, text: 'Available Draw Types' },
        { id: 'penempatan-otomatis', level: 2, text: 'Automatic Placement (Auto-Assign)' },
        { id: 'penempatan-manual', level: 2, text: 'Manual Placement' },
        { id: 'aturan-penempatan', level: 2, text: 'Placement Rules & Considerations' },
        { id: 'cetak-target-list', level: 2, text: 'Printing Bearing List (Target List)' },
    ],
    content: `
        <h2 id="what-is-draw">What is Draw?</h2>
        <p><strong>Draw</strong> in the context of archery competitions is the process of drawing lots or determining positions — namely which target bearing will be used by each participant in a shooting session. The bearing position (target face position) is often also called <em>target number</em> or <em>bearing number</em>.</p>
        <p>A fair and transparent draw is important to maintain the integrity of the competition. For example, in outdoor wind conditions, pad positions on the left vs. right side of the court can provide different advantages for athletes — so a truly random draw is preferred.</p>

        <h2 id="draw-type">Available Draw Types</h2>
        <p>On archeris.net, organizers can choose from several draw approaches when organizing qualifying sessions:</p>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">1. Random Draw (Random Draw)</h3>
        <p>The system randomly shuffles all participants registered in a session, then maps them to available pads. This is the most common and recommended method for open competitions.</p>
        <ul>
            <li><strong>Advantages:</strong> No bias, transparent, fast.</li>
            <li><strong>When to use:</strong> Open events, first phase qualifiers, or when there are no special placement considerations.</li>
        </ul>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">2. Draw Based on Category (Grouped Draw)</h3>
        <p>Participants are first grouped by division or age category, then a random draw is carried out within each group. As a result, one bearing area is dominated by one category — making it easier for field judges to monitor.</p>
        <ul>
            <li><strong>Advantages:</strong> Category judges do not need to move too far, reading the scores per group is more efficient.</li>
            <li><strong>When to use:</strong> Large events with many categories and special judges per division.</li>
        </ul>

        <h3 style="font-size:1rem; font-weight:700; margin-top:1.5rem; margin-bottom:0.5rem;">3. Manual Draw (Manual Assignment)</h3>
        <p>The committee determines the position of each participant individually — shifting, adjusting, or swapping positions via the drag-and-drop interface on the dashboard.</p>
        <ul>
            <li><strong>Advantages:</strong> Full control, suitable for special situations (athletes with special needs, committee requests, etc.).</li>
            <li><strong>When to use:</strong> Semi-private events, exercise classes, or when there are special conditions that need to be considered.</li>
        </ul>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">💡</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Commonly Used Draw Combinations</div>
                <div class="text-gray-600 text-sm">Many organizers start with <strong>Draw By Category</strong> to group participants, then do manual <strong>fine-tuning</strong> if a participant needs to be moved for some reason. These two approaches can be combined at archeris.net.</div>
            </div>
        </div>

        <h2 id="auto-assignment">Auto-Assign</h2>
        <p>The <strong>Auto-Assign</strong> feature on archeris.net allows the committee to assign all participants to available pads with just one click. Here's how it works:</p>
        <ol>
            <li>The organizers open a preconfigured qualifying session (number of ends, arrows per end, and list of targets available).</li>
            <li>Select draw mode: <strong>Random</strong> or <strong>By Category</strong>.</li>
            <li>Click the <strong>Auto-Assign</strong> button.</li>
            <li>The system immediately maps all participants who have not been placed to empty pads automatically.</li>
            <li>The results can be previewed immediately before being confirmed and published.</li>
        </ol>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Number of Targets Must Be Sufficient</div>
                <div class="text-gray-600 text-sm">Auto-Assign only succeeds if the number of pad slots ≥ the number of participants. Make sure you have added enough targets in the session configuration before running auto-assign. If there are not enough slots, the system will ask you to add targets first.</div>
            </div>
        </div>

        <h2 id="manual-placement">Manual Placement</h2>
        <p>After auto-assign is complete (or at any time), the committee can still make manual changes on the Assignment page:</p>
        <ul>
            <li><strong>Move participants</strong> — Click a participant and then select the target destination (drag-and-drop or dropdown).</li>
            <li><strong>Swap positions</strong> — Swap the positions of two participants at once without having to remove one of them first.</li>
            <li><strong>Delete assignment</strong> — Frees one slot so it can be refilled manually or via partial auto-assign.</li>
        </ul>

        <h2 id="placement-rules">Placement Rules & Considerations</h2>
        <p>Several things to consider when drawing:</p>
        <ul>
            <li><strong>One pad, one athlete</strong> — In the standard Olympic format each pad is for only one participant. For 3D or field formats, one target can be visited alternately.</li>
            <li><strong>Capacity per target</strong> — For sessions with many participants and limited targets, the system supports an "A/B" configuration (two participants per pad in one session split over two waves).</li>
            <li><strong>Athletes with special needs</strong> — Prioritize placement in accessible pads (flat areas, near judges' entrances, etc.) — do this via manual assignment before auto-assign.</li>
            <li><strong>Do not place participants from the same team/club if possible</strong> — In team competitions, this prevents team members from tagging each other.</li>
        </ul>

        <h2 id="print-target-list">Printing a Bearing List (Target List)</h2>
        <p>Once final placements are confirmed, organizers can print the <strong>Target List</strong> — a complete list showing the names of participants along with their bearing numbers — in PDF format directly from the dashboard. This document is usually posted on the venue notice board before the session starts.</p>
        <p>On archeris.net, the Target List can be printed with filtered views per session, per category, or for all participants at once, according to the committee's needs.</p>
`
}

