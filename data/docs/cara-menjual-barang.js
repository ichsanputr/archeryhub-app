export const cara_menjual_barang = {
    slug: 'cara-menjual-barang',
    title: 'How to Sell Items on the Marketplace',
    excerpt: 'A complete guide for sellers to register a store, upload products, and manage orders on the archeris.net Marketplace.',
    icon: 'ph:storefront-bold',
    category: 'marketplace',
    readTime: '5 min',
    toc: [
        { id: 'syarat-penjual', level: 2, text: 'Conditions for Becoming a Seller' },
        { id: 'daftar-toko', level: 2, text: 'Registering a Store' },
        { id: 'tambah-produk', level: 2, text: 'Uploading Products' },
        { id: 'kelola-stok', level: 2, text: 'Manage Stock & Prices' },
        { id: 'proses-pesanan', level: 2, text: 'Processing Incoming Orders' },
        { id: 'tips-deskripsi', level: 2, text: 'Tips for Writing Product Descriptions' },
    ],
    content: `
        <h2 id="seller-terms">Requirements for Becoming a Seller</h2>
        <p>Anyone can sell on the archeris.net Marketplace as long as they meet the following conditions:</p>
        <ul>
            <li>Have a verified archeris.net account.</li>
            <li>Agree to the Seller's Terms & Conditions and Marketplace Policies.</li>
            <li>Have a valid bank account or digital wallet number for disbursement of funds.</li>
            <li>Selling products relevant to the sport of archery (equipment, accessories, clothing, training services, etc.).</li>
        </ul>
        <div class="not-prose bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-blue-500 text-2xl shrink-0">ℹ️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Store Verification</div>
                <div class="text-gray-600 text-sm">The new shop will enter the review stage by the archeris.net team within 1×24 hours. New products can be uploaded immediately but will be shown to the public once the store is approved.</div>
            </div>
        </div>

        <h2 id="list-shop">Registering a Shop</h2>
        <p>Steps to register a shop:</p>
        <ol>
            <li>Go to <strong>Dashboard > My Shop > Create New Shop</strong>.</li>
            <li>Fill in the shop name, short description and shop logo.</li>
            <li>Enter bank account or digital wallet information for disbursement.</li>
            <li>Check that you agree to the seller's terms & conditions, then click <strong>Register Store</strong>.</li>
            <li>Wait for email confirmation from the archeris.net team.</li>
        </ol>

        <h2 id="add-product">Uploading Products</h2>
        <p>Once the store is live, you can add products via <strong>Store Dashboard > Manage Products > Add New Product</strong>. Fill in the following form:</p>
        <div class="not-process overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
                <head>
                    <tr class="bg-navy text-left text-white">
                        <th class="px-4 py-3 rounded-tl-xl">Field</th>
                        <th class="px-4 py-3 rounded-tr-xl">Description</th>
                    </tr>
                </head>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr><td class="px-4 py-3 font-bold text-navy">Product Name</td><td class="px-4 py-3">Clear and specific name. Avoid names that are too generic.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Categories</td><td class="px-4 py-3">Select the most appropriate category (Equipment, Clothing, Accessories, Training, etc.).</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Price</td><td class="px-4 py-3">Price in Rupiah before shipping costs.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Stock</td><td class="px-4 py-3">Number of units available. The system will automatically close the listing if stock runs out.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Product Photos</td><td class="px-4 py-3">Minimum 1 photo, 3–5 photos from various angles are recommended.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Description</td><td class="px-4 py-3">Describe the specifications, condition (new/used), and product advantages.</td></tr>
                    <tr><td class="px-4 py-3 font-bold text-navy">Weight & Dimensions</td><td class="px-4 py-3">Used for automatic shipping cost calculations.</td></tr>
                </tbody>
            </table>
        </div>

        <h2 id="manage-stock">Manage Stock & Prices</h2>
        <p>Stock and prices can be updated at any time from the <strong>Manage Products</strong> menu. Consider the following:</p>
        <ul>
            <li>Manage stock accurately to avoid orders that cannot be fulfilled (<em>oversell</em>).</li>
            <li>Use the <strong>Flash Sale</strong> feature (if available) to provide promotional prices within a certain time period.</li>
            <li>Products with 0 stock are automatically marked "Out of stock" and do not appear in search results.</li>
        </ul>

        <h2 id="process-order">Processing Incoming Orders</h2>
        <p>Each incoming order will appear on the <strong>Store Dashboard > Orders</strong>. Process flow:</p>
        <ol>
            <li><strong>Waiting for Confirmation</strong> — New order from buyer, funds have been held by the system.</li>
            <li><strong>Processing</strong> — You confirm availability and start preparing the package.</li>
            <li><strong>Sent</strong> — Enter the delivery receipt number. The buyer will receive a notification.</li>
            <li><strong>Done</strong> — The goods are received by the buyer, the funds are disbursed to your store balance.</li>
        </ol>
        <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4 flex gap-4">
            <div class="text-yellow-500 text-2xl shrink-0">⚠️</div>
            <div>
                <div class="font-bold text-navy text-sm mb-1">Confirmation Deadline</div>
                <div class="text-gray-600 text-sm">Orders must be confirmed within 2×24 working hours. If not confirmed, the system will automatically cancel the order and return the funds to the buyer.</div>
            </div>
        </div>

        <h2 id="description-tips">Tips for Writing Product Descriptions</h2>
        <p>A good description increases buyer confidence and reduces repeat questions. Include:</p>
        <ul>
            <li>Specific brand, type and size of product.</li>
            <li>Main material and product condition (new / second / refurbished).</li>
            <li>Compatibility: suitable for what type of bow / draw weight / level of athlete.</li>
            <li>Package contents: what is included in the shipping box/package.</li>
            <li>Special notes: for example "nocking point not included" or "requires tuning after installation".</li>
        </ul>
`
}

