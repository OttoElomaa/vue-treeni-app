<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
import { isDark, toggleDark } from '../darkmode';

</script>



<template>
    <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl">


        <RouterLink to="/intake">
            <Button label="Intake" />
        </RouterLink>
        <RouterLink to="/analyze">
            <Button label="Analyze" />
        </RouterLink>

        <Button @click="toggleDark()">
            {{ isDark ? '☀' : '☽' }}
        </Button>


    </div>
</template>