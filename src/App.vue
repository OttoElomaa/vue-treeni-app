<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/nav/NavBar.vue';
import MyBreadCrumb from './components/nav/MyBreadCrumb.vue';
import { onMounted } from 'vue';
import { usePlayerStore } from './stores/playerStore';
import { useTeamStore } from './stores/teamStore';
import { useAuthStore } from './stores/authStore';


const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()


/* onMounted( () => {
        authStore.signOut()
        playerStore.clearStore()
        teamStore.clearStore()
} ) */


</script>

<template>
        <div class="min-h-screen flex-col m-0 p-0 bg-surface-200 dark:bg-surface-900">
                <div class="mb-8 sticky top-0 z-50">
                        <NavBar />
                        <MyBreadCrumb />
                </div>

                <div class="pl-6 pr-6">
                        <RouterView />
                </div>
        </div>
</template>
