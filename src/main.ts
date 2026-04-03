import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
// UI Stuff
import PrimeVue from "primevue/config";
//import Aura from "@primeuix/themes/aura";
import "./styles/style.css";
import { MyCustomPreset } from "./styles/theme-config.ts";

console.log("Debug - Main.ts: Full pathname:", window.location.pathname);

const app = createApp(App) as any;
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(PrimeVue, {
	theme: {
		preset: MyCustomPreset,
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
