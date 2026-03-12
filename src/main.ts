import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// UI Stuff
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router';



const app = createApp(App) as any

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app')
