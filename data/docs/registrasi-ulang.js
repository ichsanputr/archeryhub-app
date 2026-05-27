export const registrasi_ulang = {
    slug: 'registrasi-ulang', title: 'Re-Register Archer Account', excerpt: 'Guide to updating archer account registration data: change of club, age category and re-verification of identity.', icon: 'ph:arrows-clockwise-bold', category: 'archer', readTime: '5 min',
    toc: [
        { id: 'kapan-perlu', level: 2, text: 'When do you need to re-register?' },
        { id: 'pindah-klub', level: 2, text: 'Move or Change Club' },
        { id: 'update-kategori', level: 2, text: 'Update Categories & Divisions' },
        { id: 'verifikasi-identitas', level: 2, text: 'Re-Verify Identity' },
        { id: 'langkah-langkah', level: 2, text: 'Re-Registration Steps' },
        { id: 'dampak', level: 2, text: 'Impact on History & Achievements' },
    ],
    content: `
                    <h2 id="when-necessary">When do you need to re-register?</h2>
                    <p>Re-registration is required when important data changes occur in the archer's profile which impacts participation in the event. Some conditions that require re-registration include:</p>
                    <ul>
                        <li><strong>Changing clubs:</strong> Joining a new club after leaving the old one.</li>
                        <li><strong>Moving up age group:</strong> Entering the birthday year that changes the age category (e.g. from U-18 to U-21).</li>
                        <li><strong>Arc division change:</strong> Switching from one arc division to another officially.</li>
                        <li><strong>Renewal of identity documents:</strong> New KTP/KIA, or the validity period of the previous document has expired.</li>
                        <li><strong>Reset account:</strong> The old account cannot be accessed and needs to be recreated with the same data.</li>
                    </ul>

                    <div class="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-4">
                        <div class="text-amber-500 text-2xl shrink-0">⚠️</div>
                        <div>
                            <div class="font-bold text-amber-800 text-sm mb-1">Pay attention to event deadlines</div>
                            <div class="text-amber-700 text-sm">Make sure re-registration is complete <strong>before registering for a new event</strong>. The event committee generally uses the latest profile data when the check-in process is carried out.</div>
                        </div>
                    </div>

                    <h2 id="move-club">Move or Change Club</h2>
                    <p>If you have recently changed clubs, immediately update the club information on your archer profile. The club listed in your profile will be your representative at every event you participate in.</p>
                    <ol>
                        <li>Sign in to <strong>Archer Dashboard → My Profile</strong>.</li>
                        <li>Click the edit icon in the <strong>Club Information</strong> section.</li>
                        <li>Search for the new club name via the search field.</li>
                        <li>Confirm change — the system will record the date of change of club affiliation.</li>
                    </ol>
                    <p>Membership in the new club is fully managed by the club management. Make sure you have been officially accepted by the club before changing your affiliation on the platform.</p>

                    <h2 id="update-category">Update Category & Division</h2>
                    <p>archeris.net calculates age groups automatically based on registered birth dates. However, bow divisions can be updated manually according to competition requirements:</p>
                    <div class="not-process overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <head>
                                <tr class="bg-navy text-white">
                                    <th class="px-4 py-3 text-left font-bold rounded-tl-xl">Data</th>
                                    <th class="px-4 py-3 text-left font-bold">How to Change</th>
                                    <th class="px-4 py-3 text-left font-bold rounded-tr-xl">Description</th>
                                </tr>
                            </head>
                            <tbody>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Age Group</td>
                                    <td class="px-4 py-3 text-gray-600">Automatic</td>
                                    <td class="px-4 py-3 text-gray-500">Calculated from date of birth</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Arc Division</td>
                                    <td class="px-4 py-3 text-gray-600">Manual (edit profile)</td>
                                    <td class="px-4 py-3 text-gray-500">May vary per event</td>
                                </tr>
                                <tr class="border-b border-gray-100 bg-white">
                                    <td class="px-4 py-3 font-semibold text-navy">Full Name</td>
                                    <td class="px-4 py-3 text-gray-600">Manual (edit profile)</td>
                                    <td class="px-4 py-3 text-gray-500">Use the name according to your KTP</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-navy">Date of Birth</td>
                                    <td class="px-4 py-3 text-gray-600">Contact support</td>
                                    <td class="px-4 py-3 text-gray-500">Document verification required</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="identity-verification">Re-Verify Identity</h2>
                    <p>Some events may require updated identity verification, especially for events with official categories or prizes. If your verification has expired or been rejected, follow these steps:</p>
                    <ul>
                        <li>Prepare a photo of your valid KTP/KIA (JPEG/PNG format, max. 5MB).</li>
                        <li>Go to <strong>My Profile â†’ Identity Verification</strong>.</li>
                        <li>Upload the document and wait for the review process by the archeris.net team (1–2 working days).</li>
                        <li>The verification status will be updated and a notification sent to the registered email.</li>
                    </ul>

                    <h2 id="steps">Re-Registration Steps</h2>
                    <p>The following is a summary of the complete flow of re-registering an archer account:</p>
                    <ol>
                        <li><strong>Login</strong> to your archeris.net account.</li>
                        <li>Go to <strong>Dashboard â†’ My Profile â†’ Edit Profile</strong>.</li>
                        <li>Update changed data: name, date of birth, club, arc division and profile photo.</li>
                        <li>Save changes by clicking <strong>Save Profile</strong>.</li>
                        <li>If there are identity documents that need to be updated, upload them in the <strong>Identity Verification</strong> section.</li>
                        <li>Wait for confirmation from the system (for changes that require manual verification).</li>
                    </ol>

                    <h2 id="impact">Impact on History & Achievements</h2>
                    <p>Re-registration <strong>does not delete</strong> the achievement history and scores that have been recorded. All previous match data remains stored and linked to your account, even after a change in club membership or division.</p>
                    <ul>
                        <li>Score history and rankings are maintained.</li>
                        <li>Digital certificates and awards remain accessible.</li>
                        <li>If you change clubs, old achievements will still appear with the original club label at the time of the event.</li>
                    </ul>
                    <p>If you encounter problems when re-registering, contact support via the chat feature in the application or send an email to support@archeris.net.</p>
`
}

