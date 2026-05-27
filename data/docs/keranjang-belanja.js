export const keranjang_belanja = {
    slug: 'keranjang-belanja', title: 'Shopping Cart Management', excerpt: 'A guide on how to use the shopping cart to organize archery equipment items before checkout.', icon: 'ph:shopping-cart-bold', category: 'archer', readTime: '3 min',
    toc: [
        { id: 'tambah-produk', level: 2, text: 'Adding Products to Cart' },
        { id: 'kelola-item', level: 2, text: 'Manage Items in Cart' },
        { id: 'multi-seller', level: 2, text: 'Checkout from Various Sellers' },
        { id: 'riwayat-order', level: 2, text: 'Monitoring Goods Orders' },
    ],
    content: `
                    <h2 id="add-product">Adding Product to Cart</h2>
                    <p>When browsing the Marketplace on archeris.net, you can add various supplies to your cart. Click the basket icon on the product you want. You can continue shopping and collecting items before deciding to make a payment.</p>

                    <h2 id="manage-items">Manage Items in Cart</h2>
                    <p>You can access the shopping cart via the cart icon in the top navigation or via <strong>Dashboard > Cart</strong>. Here you can:</p>
                    <ul>
                        <li>Changing the quantity of products.</li>
                        <li>Delete products that were not purchased.</li>
                        <li>View subtotal details per item.</li>
                    </ul>

                    <h2 id="multi-seller">Checkout from Multiple Sellers</h2>
                    <p>archeris.net supports purchases from multiple sellers at once in one shopping session. Cart will automatically group products by sending store. Shipping costs will be calculated separately per store when you checkout.</p>

                    <h2 id="order-history">Monitoring Goods Orders</h2>
                    <p>After checkout and payment has been verified, you can monitor the delivery status of your goods via the <strong>Orders</strong> tab on the dashboard. There is the receipt number and travel status of the package from the shop to your address.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">🛒</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Transaction Security</div>
                            <div class="text-gray-600 text-sm">Your funds will be held by the archeris.net system and will only be transferred to the seller after you confirm that the goods have been received properly.</div>
                        </div>
                    </div>
`
}

