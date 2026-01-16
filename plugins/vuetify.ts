import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  const vuetify = createVuetify({
    // your config will come here
    ssr: false, // Match the main Nuxt config
    directives,
    theme: false
  });

  nuxtApp.vueApp.use(vuetify);
});
