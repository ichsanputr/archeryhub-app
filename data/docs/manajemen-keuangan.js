export const manajemen_keuangan = {
    slug: 'manajemen-keuangan', title: 'Finance & Balance Management', excerpt: 'Complete guide to managing income, balances and bank account settings on the Organization dashboard.', icon: 'ph:wallet-bold', category: 'platform', readTime: '6 min',
    toc: [
        { id: 'penghasilan-saya', level: 2, text: 'My Income Menu' },
        { id: 'saldo-organisasi', level: 2, text: 'Balance & Transaction History' },
        { id: 'rekening-bank', level: 2, text: 'Bank Account Settings' },
        { id: 'withdraw-hasi', level: 2, text: 'Withdrawal of Funds (Withdrawal)' },
    ],
    content: `
                    <h2 id="my-income">My Income Menu</h2>
                    <p>Via the <strong>Finance > My Income</strong> menu, you can see a summary of your organization's financial performance. This page presents statistical data on income from all events you organize, separated by participant payment status.</p>
                    <img src="/docs/organization-menu-my-income.png" alt="My Income Menu" />

                    <h2 id="organization-balance">Balance & Transaction History</h2>
                    <p>All funds from verified registration (Paid status) will go into your <strong>Organization Balance</strong>. The archeris.net system records every balance mutation in detail:</p>
                    <ul>
                        <li><strong>Incoming Funds:</strong> Net income from participant registration after deducting platform service fees.</li>
                        <li><strong>Outgoing Funds:</strong> History of withdrawals that you have made to your registered bank account.</li>
                    </ul>
                    <img src="/docs/organization-menu-keuangan-saldo.png" alt="Balance & Transaction History" />

                    <h2 id="bank-account">Bank Account Settings</h2>
                    <p>To be able to withdraw funds, you must register your bank account number in the <strong>Settings > Bank Account</strong> menu. Some things to note:</p>
                    <ul>
                        <li>Make sure the account owner's name matches the name of the organization or legal person in charge.</li>
                        <li>This account data will go through a security verification process before it can be used for withdrawals.</li>
                        <li>You can change your account data at any time, but the verification process may be carried out again for the security of your funds.</li>
                    </ul>
                    <img src="/docs/organization-account-bank.png" alt="Bank Account Settings" />

                    <h2 id="withdraw-hasi">Withdrawal</h2>
                    <p>Withdrawals can be made flexibly from the available balance. You simply enter the withdrawal amount, and the system will process the transfer to your bank account within 1-3 working days (depending on each bank's policy).</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">�️</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Financial Security</div>
                            <div class="text-gray-600 text-sm">archeris.net uses a multi-layered security system for every financial transaction. Make sure you do not share your login credentials or verification code with any party for the security of your organization's balance.</div>
                        </div>
                    </div>
`
}

