export const mobile_app_scoring = {
    slug: 'mobile-app-scoring', title: 'Scoring via Mobile Application', excerpt: 'Complete guide for referees using mobile scoring from logging in to data synchronization.', icon: 'ph:device-mobile-bold', category: 'scoring', readTime: '6 min',
    toc: [
        { id: 'login-mobile', level: 2, text: 'Scorekeeper Login' },
        { id: 'scan-qr', level: 2, text: 'Scan QR Assignment' },
        { id: 'input-skor-mobile', level: 2, text: 'Score Input' },
        { id: 'sinkronisasi', level: 2, text: 'Synchronization and Troubleshooting' },
    ],
    content: `
                    <h2 id="login-mobile">Scorekeeper Login</h2>
                    <p>The scorekeeper account is created by the committee from the dashboard. Use official credentials so that each score input is recorded in the name of the correct officer.</p>
                    <h2 id="scan-qr">Scan QR Assignment</h2>
                    <p>Each bearing has a QR assignment. Scan the QR to open the correct match/target and avoid wrong input to other participants.</p>
                    <h2 id="input-skor-mobile">Input Score</h2>
                    <p>Input the arrow value per end according to the shot sequence. After verification with field officers, save the end so that the data is immediately updated in the central system.</p>
                    <img src="/docs/input-values-per-end.png" alt="Input Mobile Values" />
                    <h2 id="sync">Synchronization and Troubleshooting</h2>
                    <ul>
                        <li>If the network is unstable, make sure the data is completely saved before moving end.</li>
                        <li>Perform a refresh assignment if the QR does not match the active match.</li>
                        <li>Report data mismatch to dashboard operator for centralized correction.</li>
                    </ul>
`
}
