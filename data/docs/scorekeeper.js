export const scorekeeper = {
    slug: 'scorekeeper', title: 'Scorekeeper Management', excerpt: 'Complete guide to the scorekeeper role: account creation, target assignment, score input flow, corrections, and access control.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '8 min',
    toc: [
        { id: 'apa-itu-scorekeeper', level: 2, text: 'What is Scorekeeper?' },
        { id: 'buat-scorekeeper', level: 2, text: 'Create a Scorekeeper Account' },
        { id: 'assignment-scorekeeper', level: 2, text: 'Assignment to Target / Session' },
        { id: 'alur-input-skor', level: 2, text: 'Score Input Flow in the Field' },
        { id: 'koreksi-skor', level: 2, text: 'Score Correction & Cancellation' },
        { id: 'sesi-dan-rotasi', level: 2, text: 'Change of Session and Rotation of Officers' },
        { id: 'kontrol-akses', level: 2, text: 'Access Control and Security' },
    ],
    content: `
                    <h2 id="what-is-scorekeeper">What is Scorekeeper?</h2>
                    <p>Scorekeeper is the officer responsible for entering archery scores digitally during the event. Every score entered is immediately synchronized to the public leaderboard in real-time, replacing manual recording on paper which is prone to errors.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">🎯</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Key Role in Score Integrity</div>
                            <div class="text-gray-600 text-sm">Scorekeeper does not have access to event settings or overall participant data. They can only access assigned targets, maintaining security and data isolation.</div>
                        </div>
                    </div>

                    <h2 id="create-scorekeeper">Create a Scorekeeper Account</h2>
                    <p>Only organization admins can create scorekeeper accounts. The account creation process is done from the event management dashboard:</p>
                    <ol>
                        <li>Go to <strong>Organization Dashboard → Events → [Event Name] → Scorekeeper</strong>.</li>
                        <li>Click the <strong>Add Scorekeeper</strong> button.</li>
                        <li>Fill in the officer's name, cellphone number or email, and assign to the desired target/session.</li>
                        <li>The system will generate temporary login credentials (PIN or password) that can be shared with officers.</li>
                        <li>The officer logs in via the mobile application or browser using these credentials.</li>
                    </ol>
                    <img src="/docs/organization-management-scorekeeper.png" alt="Scorekeeper Management" />

                    <div class="not-process overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <head>
                                <tr class="bg-navy text-white">
                                    <th class="px-4 py-3 text-left font-bold rounded-tl-xl">Information</th>
                                    <th class="px-4 py-3 text-left font-bold rounded-tr-xl">Description</th>
                                </tr>
                            </head>
                            <tbody>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Maximum number</td>
                                    <td class="px-4 py-3 text-gray-600">Unlimited per event</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Login method</td>
                                    <td class="px-4 py-3 text-gray-600">6 digit PIN or email + password</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Device</td>
                                    <td class="px-4 py-3 text-gray-600">Smartphone, tablet, or laptop</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Offline access</td>
                                    <td class="px-4 py-3 text-gray-600">Automatically sync when connection is restored</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="assignment-scorekeeper">Assignment to Target / Session</h2>
                    <p>Each scorekeeper must be assigned to a specific target to avoid overlapping input. One scorekeeper can handle several targets simultaneously if team capacity is limited.</p>
                    <ul>
                        <li>Assignment can be done <strong>before or during the event</strong>.</li>
                        <li>One target can be assigned to more than one scorekeeper (as a backup).</li>
                        <li>Changes in assignments will be immediately visible in the scorekeeper application.</li>
                    </ul>
                    <img src="/docs/event-assign-target.png" alt="Assignment Target" />

                    <h2 id="skor-input flow">Score Input Flow in the Field</h2>
                    <p>After logging in, scorekeeper only sees the list of assigned targets. The following is the score input flow per end:</p>
                    <ol>
                        <li><strong>Select Target</strong> — Select a target number from the list provided.</li>
                        <li><strong>Select End</strong> — Select the end number to be input (End 1, 2, 3, etc.).</li>
                        <li><strong>Input Each Arrow's Score</strong> — Enter the arrow values ​​one at a time (0–10, or X for 10 inner rings). The input order is from largest to smallest according to World Archery regulations.</li>
                        <li><strong>Total Confirmation</strong> — The system automatically totals the scores per end. Confirm if the total is correct.</li>
                        <li><strong>Submit</strong> — Score is saved and immediately appears on the public leaderboard.</li>
                    </ol>

                    <div class="not-prose bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-green-600 text-2xl shrink-0">✅</div>
                        <div>
                            <div class="font-bold text-green-800 text-sm mb-1">Double Verification</div>
                            <div class="text-green-700 text-sm">Before the score is sent, the system displays a summary of all arrows in one end. Scorekeeper must confirm before the data is stored permanently.</div>
                        </div>
                    </div>

                    <h2 id="score-correction">Score Correction & Cancellation</h2>
                    <p>Input errors may occur in the field. archeris.net provides a controlled correction mechanism:</p>
                    <ul>
                        <li><strong>Immediate correction (within 5 minutes):</strong> Scorekeeper can immediately edit the newly input final score as long as the correction time window is still open.</li>
                        <li><strong>Correction by admin:</strong> If the time window has expired, only the event admin can unlock the end and allow re-correction.</li>
                        <li><strong>Correction history:</strong> Each score change is recorded along with the time, name of the scorekeeper, and reason for the correction for audit purposes.</li>
                    </ul>

                    <h2 id="session-and-rotation">Session Change and Officer Rotation</h2>
                    <p>In multi-session events, the scorekeeper can be rotated between sessions without disturbing already stored data. Admin simply changes the assignment target on the dashboard before the next session starts. The new scorekeeper will immediately see the new target after re-logging in.</p>

                    <h2 id="access-control">Access Control and Security</h2>
                    <ul>
                        <li><strong>Data isolation:</strong> Scorekeeper can only view and input scores for assigned targets — no access to other participants' data.</li>
                        <li><strong>Deactivate account:</strong> Admins can deactivate the scorekeeper account at any time from the event management dashboard.</li>
                        <li><strong>PIN rotation:</strong> Change the PIN every event to prevent misuse of old credentials.</li>
                        <li><strong>Activity log:</strong> All scorekeeper actions (logins, inputs, corrections) are recorded in a log that admins can access for audit purposes.</li>
                    </ul>
`
}

