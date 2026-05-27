export const sistem_scoring_kualifikasi = {
    slug: 'sistem-scoring-kualifikasi', title: 'Qualification Scoring System', excerpt: 'Operational guidance for qualifying scoring from session setup to leaderboard validation.', icon: 'ph:chart-bar-bold', category: 'scoring', readTime: '7 min',
    toc: [
        { id: 'sesi-kualifikasi', level: 2, text: 'Qualifying Session' },
        { id: 'penempatan-bantalan', level: 2, text: 'Bearing Placement' },
        { id: 'input-skor', level: 2, text: 'Score Input' },
        { id: 'validasi-skor', level: 2, text: 'Score Validation' },
        { id: 'leaderboard', level: 2, text: 'Leaderboard' },
    ],
    content: `
                    <h2 id="qualification-session">Qualification Session</h2>
                    <p>The committee can hold one or more qualifying sessions in one event. Each session can have a different configuration of the number of ends and the number of arrows per end.</p>
                    <img src="/docs/create-new-qualification-session.png" alt="New Qualification-Session" />
                    <h2 id="pad-placement">Pad Placement</h2>
                    <p>Assignment of participants to pads can be done manually or using <strong>Auto-Assign</strong> for more even distribution.</p>
                    <h2 id="input-score">Input Score</h2>
                    <p>Scores are input via mobile scoring or web dashboard. The value per arrow (including X/M if used) is automatically calculated into totals, hits, and tie-break indicators.</p>
                    <h2 id="validate-score">Validate Score</h2>
                    <ul>
                        <li>Make sure the number of arrows is filled according to the end configuration.</li>
                        <li>Verify there are no duplicate/missed marks before submitting.</li>
                        <li>Make corrections only by authorized personnel to ensure a consistent audit trail.</li>
                    </ul>
                    <h2 id="leaderboard">Leaderboard</h2>
                    <p>Leaderboard updates automatically in real-time. The ranking order follows the total score rules, then the tie-break indicator according to the competition format.</p>
`
}
