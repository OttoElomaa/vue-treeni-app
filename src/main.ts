import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
// UI Stuff
import PrimeVue from "primevue/config";
//import Aura from "@primeuix/themes/aura";
import "./styles/style.css";
import { MyCustomPreset } from "./styles/theme-config.ts";
import { supabase } from "./lib/supabase-client.ts";

console.log("Debug - Main.ts: Full pathname:", window.location.pathname);

const app = createApp(App);
const pinia = createPinia();

//const { data: { session } } = await supabase.auth.getSession()
//console.log("Session: ", session);


app.use(router);
app.use(pinia);
app.use(PrimeVue, {
	theme: {
		preset: MyCustomPreset,
		options: {
			darkModeSelector: ".my-app-dark",  // Must match the valueDark from useDark!
			cssLayer: {
				name: "primevue",
				order: "base, primevue, utilities",
			},
		},
	},
});

app.mount("#app");
