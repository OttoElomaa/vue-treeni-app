<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { Player, Team } from '../../types';
import { Column, DataTable } from 'primevue';
import { usePlayerStore } from '../../stores/playerStore';
import { useTeamStore } from '../../stores/teamStore';



const playerStore = usePlayerStore()
const teamStore = useTeamStore()

const props = defineProps<{
    teamId: string
}>()

const loading = ref(true)

const players = ref([] as Player[]);
const errorText = ref("")
const team = ref()
const teamName = ref("")

onMounted(async () => {
    // SUPABASE FETCH TEAM'S PLAYERS
    const {players: fetchedPlayers, errorText: fetchedError} = await playerStore.fetchPlayersByTeamId(Number(props.teamId));
    players.value = fetchedPlayers
    errorText.value = fetchedError
    // SUPABASE FETCH TEAM INFO
    await teamStore.fetchTeamById(Number(props.teamId))
    
    loading.value = false

});

</script>

<template>
    <div v-if="loading">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-if="errorText != ''">
        <p>Error: {{ errorText }}</p>
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