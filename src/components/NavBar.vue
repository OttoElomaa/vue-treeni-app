<script setup lang="ts">
import { computed, ref } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { isDark, toggleDark } from '../darkmode';
import { SelectButton } from 'primevue';

const route = useRoute();
const router = useRouter();

const currentAction = computed(() => route.path.includes('intake') ? 'intake' : 'analyze');
const currentTier = computed(() => route.params.tier as string || 'org');
const currentId = computed(() => route.params.id as string || '');

const goTo = (action: string) => {
    console.log("Navbar button pathing: ", action, currentTier.value, currentId.value);

    router.push(`/${action}/${currentTier.value}/${currentId.value}`);
};


</script>




<template>
    <nav class="w-full p-4 sticky top-0 z-50">
        <div class="flex items-center justify-between mx-auto p-5 bg-surface-100 dark:bg-surface-900">
            <div>
                <p class="text-3xl">Treeni App</p>
            </div>
            <div class="space-x-4">
                <Button label="Intake" @click="goTo('intake')" />
                <Button label="Analyze" @click="goTo('analyze')" />
            </div>
            <Button @click="toggleDark()">
                {{ isDark ? '☀' : '☽' }}
            </Button>
        </div>

    </nav>
</template>