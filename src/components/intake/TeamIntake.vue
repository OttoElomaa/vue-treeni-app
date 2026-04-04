<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../lib/supabase-client';
import type { Player, Team } from '../../types';
import { Button, Card } from 'primevue';
import { fetchPlayersByTeamId, fetchTeamById, fetchTeams } from '../../databaseFunctions/fetch';
import { RouterLink, useRoute, useRouter } from 'vue-router';


const props = defineProps<{
    teamId: number
}>()

const route = useRoute()
const router = useRouter()

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

const goToAddPlayer = () => {
    router.push(`/intake/team/${props.teamId}/add`)
}

const goToEditPlayer = (player: Player) => {
    router.push(`/intake/team/${props.teamId}/player/${player.id}/edit`)
}

const goToPlayer = (playerId: number) => {
    router.push(`/intake/team/${props.teamId}/player/${playerId}`)
}

</script>

<template>
    <div v-if="loading">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-if="errorText != ''">
        <p>{{ errorText }}</p>
    </div>
    <div v-else class="grid gap-4 grid-cols-1">

        <p class="text-2xl">Team Intake Screen</p>
        <h1 class="text-4xl">{{ teamName }}</h1>

        <div class="flex-row">
            <Button label="Uusi pelaaja" @click="goToAddPlayer" class="flex-none" />
        </div>

        <div class="grid gap-4 grid-cols-1">
            <template v-for="player in players" :key="player.id">

                <Card @click="goToPlayer(player.id)"
                    class="cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700">
                    <template #content>
                        <div class="flex flex-row gap-6">
                            <div class="min-w-100">
                                <p class="text-2xl">{{ player.first_name }} {{ player.last_name }}</p>
                                <p>Born {{ player.birth_year }}</p>
                            </div>

                            <Button class="flex z-10" label="Muokkaa" @click.stop.prevent="goToEditPlayer(player)" />
                        </div>
                    </template>
                </Card>
            </template>
        </div>

    </div>



</template>