export const kategorisasi_produk = {
    slug: 'kategorisasi-produk',
    title: 'Marketplace Product Categorization',
    excerpt: 'A complete explanation of the product categories available on the archeris.net Marketplace and guidelines for proper product placement.',
    icon: 'ph:tag-bold',
    category: 'marketplace',
    readTime: '3 min',
    toc: [
        { id: 'mengapa-kategori', level: 2, text: 'Why Categories Matter' },
        { id: 'daftar-kategori', level: 2, text: 'List of Product Categories' },
        { id: 'sub-kategori', level: 2, text: 'Advanced Sub-Categories & Filters' },
        { id: 'kategori-salah', level: 2, text: 'Product in the Wrong Category' },
    ],
    content: `
        <h2 id="why-categories">Why Categories Matter</h2>
        <p>The right categories help buyers find your products faster. The archeris.net Marketplace search algorithm uses categories as a relevance signal. Products that are categorized correctly tend to get more organic impressions than products that are inappropriately categorized.</p>

        <h2 id="category-list">Product Category List</h2>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Category</th>
                        <th class="px-4 py-3">Product Examples</th>
                        <th class="px-4 py-3 rounded-tr-xl">Suitable For</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Equipment <span class="text-xs font-normal text-gray-400">(equipment)</span></td>
                        <td class="px-4 py-3">Bow, limb, riser, bowstring, arrow rest, sight, stabilizer, clicker, release aid</td>
                        <td class="px-4 py-3">Major components of the bow and firing system</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Darts & Accessories <span class="text-xs font-normal text-gray-400">(accessories)</span></td>
                        <td class="px-4 py-3">Arrow carbon/aluminium, nock, point, fletching, pin nock, nocking plier, arrow tube</td>
                        <td class="px-4 py-3">Arrows and small shooting support components</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Clothing & Protection <span class="text-xs font-normal text-gray-400">(apparel)</span></td>
                        <td class="px-4 py-3">Finger tab, arm guard, chest guard, quiver, uniform, cap, archery shoes</td>
                        <td class="px-4 py-3">Athlete clothing, body armor and personal equipment</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Training & Education <span class="text-xs font-normal text-gray-400">(training)</span></td>
                        <td class="px-4 py-3">Target pads, target faces, stretching tools, bow stands, training aids, course books/videos</td>
                        <td class="px-4 py-3">Equipment and content for independent practice</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-navy">Other <span class="text-xs font-normal text-gray-400">(other)</span></td>
                        <td class="px-4 py-3">Plaques, trophies, souvenirs, club merchandise, competition stationery</td>
                        <td class="px-4 py-3">Products that do not fit into the above categories</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 id="sub-category">Sub-Categories & Advanced Filters</h2>
        <p>In addition to selecting the main category, sellers are advised to complete advanced attributes so that products can appear in buyers' specific filters:</p>
        <ul>
            <li><strong>Compatible bow types</strong> — Recurve, Compound, Barebow, Standard Bow, etc.</li>
            <li><strong>Athlete level</strong> — Beginner, Intermediate, Professional / Competition.</li>
            <li><strong>Item condition</strong> — New / Used (Second).</li>
            <li><strong>Brand</strong> — Samick, Hoyt, Win&Win, Easton, Carbon Express, local, or no-brand.</li>
        </ul>
        <p>This attribute is not mandatory, but it has a big influence on product visibility in buyer search filter results.</p>

        <h2 id="wrong-category">Products in Wrong Category</h2>
        <p>The archeris.net team carries out periodic curation of listings. Products that are proven to be in irrelevant categories will be moved or temporarily deleted pending correction from the seller. The seller will receive a notification and an explanation of the reasons for the action.</p>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Prohibited Products</div>
                <div class="text-gray-600 text-sm">archeris.net does not accept listings for firearms, dangerous products that are not related to the sport of archery, or fake/KW products that violate brand rights. Violations may result in store suspension.</div>
            </div>
        </div>
`
}

