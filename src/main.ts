import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
// UI Stuff
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import './styles/app.css'




const app = createApp(App) as any

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app')
