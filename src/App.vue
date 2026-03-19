<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import MyBreadCrumb from './components/MyBreadCrumb.vue';
</script>

<template>
        <div class="container mx-auto">
                <NavBar />
                <MyBreadCrumb />
                <RouterView />
        </div>
</template>
