<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Team } from '../../types';
import { fetchTeams } from '../../databaseFunctions/fetch';
import { Card } from 'primevue';
import { RouterLink } from 'vue-router';


const teams = ref([] as Team[]);
const errorText = ref("Loading...")

onMounted(async () => {
    const { teams: fetchedTeams, errorText: fetchedError } = await fetchTeams();
    teams.value = fetchedTeams
    errorText.value = fetchedError
});
</script>

<template>
    <h1 class="text-4xl">Org Intake Screen</h1>

    <p>{{ errorText }}</p>


    <RouterLink v-for="team in teams" :key="team.id" :to="`/intake/team/${team.id}`" class="card-link">

        <Card>
            <template #title>{{ team.team_name }}</template>
            <template #content>Info...</template>
        </Card>
    </RouterLink>
</template>