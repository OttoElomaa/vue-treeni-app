<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Card } from 'primevue';
import { RouterLink } from 'vue-router';
import { useTeamStore } from '../../stores/teamStore';



const teamStore = useTeamStore()

onMounted(async () => {
    teamStore.fetchTeams();
    
});

</script>

<template>
    <div class="grid gap-4 grid-cols-1">
        <h1 class="text-4xl">Org Analyze Screen</h1>

        <p>{{ teamStore.errorText }}</p>

        <div class="grid gap-4 grid-cols-1">
            <RouterLink v-for="team in teamStore.teams" :key="team.id" :to="`/analyze/team/${team.id}`" class="card-link">

                <Card>
                    <template #title>{{ team.team_name }}</template>
                    <template #content>Info...</template>
                </Card>
            </RouterLink>
        </div>
    </div>


</template>