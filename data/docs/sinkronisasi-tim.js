export const sinkronisasi_tim = {
    slug: 'sinkronisasi-tim',
    title: 'Automatic Team Sync',
    excerpt: 'How the Team Sync feature on archeris.net works — how the system automatically groups archers into teams based on clubs and qualifying scores.',
    icon: 'ph:arrows-clockwise-bold',
    category: 'archery',
    readTime: '5 min',
    toc: [
        { id: 'apa-itu-sync-tim', level: 2, text: 'What is Team Sync?' },
        { id: 'syarat-tim-terbentuk', level: 2, text: 'Team Formation Requirements' },
        { id: 'tipe-tim', level: 2, text: 'Team Type: Standard vs Mixed' },
        { id: 'cara-kerja-pengelompokan', level: 2, text: 'How Grouping Works' },
        { id: 'kategori-individu-vs-tim', level: 2, text: 'Individual Category & Team Category' },
        { id: 'estimasi-vs-hasil-sync', level: 2, text: 'Team Estimates vs Sync Results' },
        { id: 'sync-manual', level: 2, text: 'When is Manual Sync Needed?' },
        { id: 'troubleshooting', level: 2, text: 'Troubleshooting (Error Messages)' },
    ],
    content: `
        <h2 id="what-is-team-sync">What is Team Sync?</h2>
        <p><strong>Team Synchronization</strong> is a feature on the committee dashboard that automatically forms official teams for the team elimination round based on:</p>
        <ul>
            <li>Club membership of each archer</li>
            <li>Recorded individual qualifying scores</li>
            <li>Category type (team of 3 people or mixed 2 people)</li>
        </ul>
        <p>This process replaces manual team formation which is error-prone and time-consuming, especially at events with dozens of categories.</p>

        <h2 id="team-formation-requirements">Formation-Team Conditions</h2>
        <p>For the system to form a team, several conditions must be met:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Terms</th>
                        <th class="px-4 py-3 rounded-tr-xl">Description</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Payment Status</td>
                        <td class="px-4 py-3">Participants must be <em>paid off</em> or <em>waiting for acc</em></td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Qualification Score</td>
                        <td class="px-4 py-3">Archers must have a qualifying score entered</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Club Membership</td>
                        <td class="px-4 py-3">Archers must be registered with a club (not independent)</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Quota Per Club</td>
                        <td class="px-4 py-3">One ​​club requires a minimum of 3 archers (standard) or 1 man + 1 woman (mixed) to form one team</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>If one of the conditions is not met, the club will not produce a team — but other clubs that meet the requirements will still be processed.</p>

        <h2 id="team-type">Team Type: Standard vs Mixed</h2>
        <p>archeris.net supports two types of team categories:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Type</th>
                        <th class="px-4 py-3">Members</th>
                        <th class="px-4 py-3 rounded-tr-xl">Formation Method</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Standard Team</td>
                        <td class="px-4 py-3">3 archers from the same club (same gender)</td>
                        <td class="px-4 py-3">3 archers with the highest scores per group are drawn (top 3 group, 4–6 group, etc.)</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Mixed Team</td>
                        <td class="px-4 py-3">1 boy + 1 girl from the same club</td>
                        <td class="px-4 py-3">The best male and female archers are paired per ranking from each club</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-primary text-2xl shrink-0">💡</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">One ​​Club, Many Teams</div>
                <div class="text-gray-600 text-sm">If a club has 6 archers scoring in one category, the system will automatically form 2 teams from that club — Team A (ranked 1–3 clubs) and Team B (ranked 4–6 clubs).</div>
            </div>
        </div>

        <h2 id="how-grouping-works">How Grouping Works</h2>
        <p>The team sync algorithm works as follows:</p>
        <ol>
            <li><strong>Take all participants</strong> from the appropriate individual category (same division, age group, and gender as the team category).</li>
            <li><strong>Calculate the qualifying score</strong> for each participant from the <code>qualification_end_scores</code> table.</li>
            <li><strong>Group by club</strong> and order from highest to lowest score.</li>
            <li><strong>Divide into groups of <em>n</em> archers</strong> (n = team size). The first group is the best team, the second group is the second team, etc.</li>
            <li><strong>Groups that do not meet the quota</strong> (less than n scored archers) are ignored.</li>
            <li><strong>Create a team entry</strong> in the database, complete with team name, ranking, total score, and member list.</li>
        </ol>

        <h2 id="individual-vs-team-category">Individual &amp; Team Category</h2>
        <p>In an archery event, a division usually has <strong>two separate categories</strong>: an individual category and a team category.</p>
        <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Archers Register in Individual Category</div>
                <div class="text-gray-600 text-sm">Participants <strong>always register in the individual category</strong> — not in the team category. When Team Sync is run, the system automatically searches for participants from individual categories that belong to the same division, age group, and gender as the selected team category. This means that synchronization will be successful even if the team category display does not show registered participants.</div>
            </div>
        </div>
        <p>Example: The <em>Men's U-13 Compound Team</em> category will look for participants from the <em>Individual Men's U-13 Compound</em> category at the same event.</p>

        <h2 id="estimate-vs-sync-results">Team Estimates vs Sync Results</h2>
        <p>Before running sync, the <strong>Bracket Creation</strong> page displays two numbers:</p>
        <ul>
            <li><strong>Team Estimates</strong> <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Estimations</span> — estimates of the number of teams that will form, calculated directly from current qualifying data without actually creating teams. Useful for deciding the bracket size before syncing.</li>
            <li><strong>Synchronized Teams</strong> <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Auto</span> — the number of teams that were actually created and saved in the database after the sync was executed.</li>
        </ul>
        <p>If there are already synchronized teams, this number is used as a basis for bracket size recommendations. If it doesn't exist yet, the system uses the estimate as a reference.</p>

        <h2 id="sync-manual">When is Manual Sync Needed?</h2>
        <p>While Auto Sync handles most needs, there are situations where organizers need to edit or create teams manually:</p>
        <ul>
            <li>Archers from outside the club who wish to join as a team (independent archers)</li>
            <li>Changes in composition due to archers being injured or withdrawing</li>
            <li>A special event format that does not follow standard grouping rules</li>
        </ul>
        <p>Use the <strong>Manual Add Team</strong> or <strong>Edit Team Details</strong> button on the Team Management page for those cases.</p>
        <div class="not-prose bg-red-50 border border-red-200 rounded-2xl p-5 my-4 flex gap-4">
            <div class="text-red-500 text-2xl shrink-0">🔄</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Automatic Sync Delete Old Team Data</div>
                <div class="text-gray-600 text-sm">Every time Auto Sync is run, all existing teams in that category will be deleted and re-created from scratch. Make sure the qualifying scores are final before running sync.</div>
            </div>
        </div>

        <h2 id="troubleshooting">Troubleshooting (Error Message)</h2>
        <p>The following are several error messages that may appear during the synchronization process and an explanation of their causes:</p>

        <div class="space-y-4 my-6">
            <!-- 1. Girls/Boys Category Not Found -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Category pair son/daughter (Individual) not found..."</h4>
                </div>
                <p class="text-[13px] text-gray-500 italic mb-3">Case: Mixed Team Sync.</p>
                <div class="space-y-2">
                    <p class="text-[13px] text-gray-700"><strong>Cause:</strong> The system could not find an <em>Individual</em> category with the same division and age group to pull qualifying scores from.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solution:</strong> Make sure you have created <em>Men's Individual</em> AND <em>Women's Individual</em> categories for the division. The system requires scores from both categories to form a mixed team.</p>
                </div>
            </div>

            <!-- 2. Synchronization Doesn't Make Teams -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-amber-100 text-amber-600 font-bold text-[10px] rounded ">Info</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Sync does not generate teams"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Cause:</strong> There are participants, there are categories, but the quota per club is not sufficient to form a single team.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solution:</strong>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Check participant qualification scores: Participants without scores will not be counted by the sync system.</li>
                            <li>Check the number of participants per club: Standard team requires a minimum of 3 people, Mixed requires a minimum of 1 male & 1 female from the same club.</li>
                        </ul>
                    </p>
                </div>
            </div>

            <!-- 3. Event Not Found -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Event not found"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Cause:</strong> Problems synchronizing URLs or cache data in the browser.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solution:</strong> Refresh your dashboard page and try running the sync process again.</p>
                </div>
            </div>

            <!-- 4. Failed to Calculate Rank -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Failed to calculate team ranking" / "Failed to calculate mixed team ranking"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Cause:</strong> There was an inconsistency in the score data in the database for one of the participants.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solution:</strong> Check the qualification leaderboard again. If there is a score that looks unnatural or has an error, reset and re-enter the score for that participant.</p>
                </div>
            </div>

            <!-- 5. Database Transaction Error -->
            <div class="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded ">Error</span>
                    <h4 class="text-sm font-black text-navy tracking-tight">"Failed to save synchronization results" / "Failed to start transaction"</h4>
                </div>
                <div class="space-y-2 mt-3">
                    <p class="text-[13px] text-gray-700"><strong>Cause:</strong> Connection interruption to the database server or timeout when processing large amounts of data.</p>
                    <p class="text-[13px] text-gray-700"><strong>Solution:</strong> Wait a while and repeat the process. If the problem persists, contact the Archeris support team to check the server status.</p>
                </div>
            </div>
        </div>
`,
}


