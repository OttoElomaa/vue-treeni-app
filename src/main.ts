import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// UI Stuff
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "./styles/style.css";
import "./styles/volt-base.css"


console.log("Debug - Main.ts: Full pathname:", window.location.pathname);

const app = createApp(App) as any;

app.use(router);
app.use(PrimeVue, {
	unstyled: true,
	theme: {
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
});

app.mount("#app");
