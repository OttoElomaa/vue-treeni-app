<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import MyBreadCrumb from './components/MyBreadCrumb.vue';
</script>

<template>
        <div class="min-h-screen flex-col m-0 p-0 bg-surface-200 dark:bg-surface-800">
                <NavBar />
                <MyBreadCrumb />
                <div class="pl-6 pr-6">
                        <RouterView />
                </div>
        </div>
</template>
