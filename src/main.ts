import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// UI Stuff
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "./style.css";
//import Lara from "@primeuix/themes/lara";
//import Material from "@primeuix/themes/material";

const app = createApp(App) as any;

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      // Must match the valueDark from useDark above!
      darkModeSelector: ".my-app-dark",
      //cssLayer: false
      cssLayer: {
        name: "primevue",
        order: "base, primevue, utilities",
      },
    },
  },
});

app.mount("#app");
