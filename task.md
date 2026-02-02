Please do these all we focused to user archer.

- On /dashboard/events for user archer please dont show button buat event pertama because archer cannot create the event, that page for archer only shown events that they regist
- On /dashboard/archers/club page place Belum Bergabung dengan Klub section below input search
- /dashboard/cart header section bg make it same like some pages event management
- /dashboard/cart this page is used for product that the archer add to cart, not for Registration & Payment
- /dashboard/archers/profile this page make sure all column on table archer have fields on that page so user can customize their profile
- /dashboard/archers/profile remove Statistik
- Please adjust all page usehead title for all pages dashboard because i still saw a lot pages for example /dashboard/archers/profile still <title>Archeryhub.id - All In One Platform Panahan Indonesia</title>
- Fix this issue on page /dashboard/settings

nuxt.js?v=b0b02372:124 [nuxt] error caught during app initialization H3Error: Unknown route middleware: 'auth'. Valid middleware: .Caused by: Error: Unknown route middleware: 'auth'. Valid middleware: .
    at router.js?v=b0b02372:164:21


PHASE 2

Now focused about registration

/events/seleksi-2-popda-kabsleman-2026/register

- Please make sure all fields section Data Atlet have proper icon, we use mingcute icon a collection for all icons, i saw tanggal lahir and jenis busur and other still wrong icon
- Please using mcp mysql remove column "province" on table archers, then adjust all api endpoint and all page vue, we remove that column because there is existing column city
- Please club is only readonly and that is just archer information, user cannot change it and dont make it as field
- Kategori Event items ui section why still behind section parent? it should infront like z index maximum
- Please trace why Informasi Event empty for that page?
- Please fix about fetching api issue hydration, when i open the page from another page using nuxtlink i can see content Informasi Event, but when i hard reload that url i cant see the content
- Please fix this issue when i wanna upload bukti pembayaran

Upload failed: ReferenceError: token is not defined
    at handleProofUpload (register.vue:695:48)

PHASE 3

- Please dashboard header on mobile show the logo on middle between hamburger menu and notification icon
- Pages /dashboard/archers/club and please use same header like dashboard cart
- /dashboard/settings user archer remove tab akun because archer user if wanna edit their profile can via /dashboard/archers/profile
- I got error when access page /dashboard/cart

 error-handler.ts:10 TypeError: Cannot read properties of undefined (reading 'length')
    at Proxy._sfc_render (index.vue:43:35)
 
Proxy(Object)
 'render function'
