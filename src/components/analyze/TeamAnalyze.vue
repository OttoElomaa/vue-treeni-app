<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../lib/supabase-client';
import type { Player, Team } from '../../types';
import { Card, Column, DataTable } from 'primevue';
import { fetchPlayersByTeamId, fetchTeamById, fetchTeams } from '../../databaseFunctions/fetch';
import { RouterLink, useRoute, useRouter } from 'vue-router';


const props = defineProps<{
    teamId: number
}>()

const loading = ref(true)

const players = ref([] as Player[]);
const errorText = ref("Loading...")
const team = ref()
const teamName = ref("")

onMounted(async () => {
    // SUPABASE FETCH TEAM'S PLAYERS
    const { players: fetchedPlayers, errorText: fetchedError } = await fetchPlayersByTeamId(props.teamId);
    players.value = fetchedPlayers
    errorText.value = fetchedError

    // SUPABASE FETCH TEAM INFO
    const { team: fetchedTeam, errorText: fetchedError2 } = await fetchTeamById(props.teamId)
    team.value = fetchedTeam
    if (fetchedTeam) {
        teamName.value = fetchedTeam.team_name
    }
    loading.value = false

});

</script>

<template>
    <div v-if="loading">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-if="errorText != ''">
        <p>{{ errorText }}</p>
    </div>
    <div v-else class="grid gap-4 grid-cols-1">

        <p class="text-2xl">Team Analyze Screen</p>
        <h1 class="text-4xl">{{ teamName }}</h1>

        <p>{{ errorText }}</p>

        <DataTable :value="players" tableStyle="min-width: 50rem">
            <Column field="first_name" header="First Name"></Column>
            <Column field="last_name" header="Last Name"></Column>
            <Column field="birth_year" header="Birth year"></Column>
        </DataTable>
    </div>



</template>