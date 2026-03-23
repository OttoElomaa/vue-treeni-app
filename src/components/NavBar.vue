<script setup lang="ts">
import { computed, ref } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { isDark, toggleDark } from '../styles/darkmode';
import { SelectButton } from 'primevue';
import type { Mode } from '../types';

const route = useRoute();
const router = useRouter();

const currentMode = computed(() => {
    const name = route.name?.toString() || ''
    if (name.includes('intake')) return 'intake'
    return 'analyze'
})

function goTo(mode: Mode) {
    const rest = route.path.split('/').slice(2).join('/')
    router.push(`/${mode}/${rest}`)
}


</script>




<template>
    <nav class="sticky top-0 z-50">
        <div class="flex items-center justify-between mx-auto p-5 bg-surface-100 dark:bg-surface-900">
            <div>
                <p class="text-3xl">Treeni App</p>
            </div>
            <div class="space-x-4">
                <Button label="Intake" :severity="currentMode === 'intake' ? 'primary' : 'secondary'"
                    @click="goTo('intake')" />
                <Button label="Analyze" :severity="currentMode === 'analyze' ? 'primary' : 'secondary'"
                    @click="goTo('analyze')" />
            </div>
            <Button severity="primary"  @click="toggleDark()">
                {{ isDark ? '☀' : '☽' }}
            </Button>
        </div>

    </nav>
</template>