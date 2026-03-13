<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
import { isDark, toggleDark } from '../darkmode';

</script>



<template>
    <nav>

        <div class="tab-group">
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

    </nav>
</template>