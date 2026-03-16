<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '../../lib/supabase-client';
import type { Team } from '../../types';
import { Card } from 'primevue';
import { fetchTeams } from '../../databaseFunctions/fetch';
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
    <h1 class="text-4xl">Org Analyze Screen</h1>

    <p>{{ errorText }}</p>


    <RouterLink v-for="team in teams" :key="team.id" :to="`/analyze/team/${team.id}`" class="card-link">

        <Card>
            <template #title>{{ team.team_name }}</template>
            <template #content>Info...</template>
        </Card>
    </RouterLink>


</template>