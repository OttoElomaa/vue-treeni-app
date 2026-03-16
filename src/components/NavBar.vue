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
    console.log("Navbar button pathing: ",action,currentTier.value,currentId.value);
    
    router.push(`/${action}/${currentTier.value}/${currentId.value}`);
};


</script>




<template>
    <div class="flex flex-row">

        <Button label="Intake" @click="goTo('intake')" />
        <Button label="Analyze" @click="goTo('analyze')" />

        <Button @click="toggleDark()">
            {{ isDark ? '☀' : '☽' }}
        </Button>


    </div>
</template>