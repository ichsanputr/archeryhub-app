export const peran_pengguna = {
    slug: 'peran-pengguna', title: 'Account Types on the Platform', excerpt: 'Complete guide to account types, access rights, and workflow for each user type on archeris.net.', icon: 'ph:users-three-bold', category: 'platform', readTime: '8 min',
    toc: [
        { id: 'tipe-akun', level: 2, text: 'Account Types on archeris.net' },
        { id: 'pemanah', level: 2, text: 'Archer Account' },
        { id: 'organisasi', level: 2, text: 'Organization Account' },
        { id: 'penjual', level: 2, text: 'Seller Account' },
        { id: 'perbandingan', level: 2, text: 'Comparison of Access Rights' },
        { id: 'pilih-peran', level: 2, text: 'How to Choose the Right Account?' },
    ],
    content: `
                    <h2 id="account-type">Account Types on archeris.net</h2>
                    <p>archeris.net is designed to serve a complete archery ecosystem. Because user needs vary, the system provides three main account types: <strong>Archer</strong>, <strong>Organization</strong> (Organizer), and <strong>Seller</strong>. Each type has a dashboard, menu and authority tailored to its function.</p>
                    <p>Choosing the right account type from the start will make your workflow more efficient, from event registration, organizing tournaments, to selling archery products.</p>

                    <h2 id="archer">Archer Account</h2>
                    <p>The <strong>Archer</strong> account is intended for individual athletes, both beginners and active competitors. The main focus of this account is the development of athlete profiles and event participation.</p>
                    <p><strong>Key features for Archer:</strong></p>
                    <ul>
                        <li>Create a public athlete profile (name, domicile, arc type, short bio).</li>
                        <li>Register for events/tournaments and monitor registration status in real-time.</li>
                        <li>See the qualifying results, rankings and elimination brackets for each championship you participate in.</li>
                        <li>Manage a portfolio of digital achievements that can be shared with the community or sponsors.</li>
                        <li>Purchase archery equipment through the integrated marketplace.</li>
                    </ul>
                    <p><strong>Suitable for:</strong> individual athletes, students, archery hobbyists and outdoor event participants.</p>

                    <h2 id="organization">Organization Account</h2>
                    <p>The <strong>Organization</strong> account is intended for event organizers, associations or tournament committees. This is the account type with the highest focus on competition operations and match management.</p>
                    <p><strong>Key features for Organizations:</strong></p>
                    <ul>
                        <li>Create and publish events complete with age categories, arc types, and schedules.</li>
                        <li>Manage participants, automatic registration verification, and control payment status (invoices).</li>
                        <li>Establish qualifying sessions, assignments and match flow.</li>
                        <li>Manage a scorekeeper account for field score input via the mobile application.</li>
                        <li>Displays the leaderboard and elimination bracket which are updated automatically according to the entered score.</li>
                    </ul>
                    <p><strong>Note:</strong> some advanced organizational features require a subscription plan (Starter/Pro) for larger participant capacities.</p>
                    <p><strong>Suitable for:</strong> championship committees, regional/branch administrators (PERPANI), sports EOs, and competition development institutions.</p>

                    <h2 id="seller">Seller Account</h2>
                    <p>The <strong>Seller</strong> account is intended for stores or individuals who sell archery equipment. This type is separated so that product and transaction management can run focused without being mixed up with competition features.</p>
                    <p><strong>Key features for Sellers:</strong></p>
                    <ul>
                        <li>Create a display case for archery products (bows, arrows, accessories, apparel).</li>
                        <li>Manage stock, prices, product variations, and product photo media.</li>
                        <li>Process incoming orders and monitor delivery status from the seller dashboard.</li>
                        <li>Building store reputation through interaction with the buyer community on the platform.</li>
                    </ul>
                    <p><strong>Suitable for:</strong> archery shop owners, equipment resellers, local distributors, and community merchants.</p>

                    <h2 id="comparison">Comparison of Access Rights</h2>
                    <div class="not-process overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <head>
                                <tr class="bg-navy text-left">
                                    <th class="text-primary font-bold px-4 py-3 rounded-tl-xl">Features</th>
                                    <th class="text-white font-bold px-4 py-3">Archer</th>
                                    <th class="text-white font-bold px-4 py-3">Organization</th>
                                    <th class="text-white font-bold px-4 py-3 rounded-tr-xl">Seller</th>
                                </tr>
                            </head>
                            <tbody class="divide-y divide-gray-100">
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Public Profile</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Event List</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3 text-gray-400">No</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Create Event</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td><td class="px-4 py-3 text-gray-400">No</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Manage Scoring</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td><td class="px-4 py-3 text-gray-400">No</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Sell Products</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3 text-gray-400">No</td><td class="px-4 py-3 text-green-600 font-bold">Yes</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="select-role">How to Choose the Right Account?</h2>
                    <p>Use this quick guide:</p>
                    <ul>
                        <li>If you want to <strong>take part in the competition as an athlete</strong>, select <strong>Archer</strong>.</li>
                        <li>If you are the <strong>tournament organizer/organizer</strong>, select <strong>Organization</strong>.</li>
                        <li>If your focus is <strong>selling archery equipment</strong>, select <strong>Seller</strong>.</li>
                    </ul>
                    <p>Each account type has a different workflow. Make sure you choose according to your current main needs.</p>
`
}

