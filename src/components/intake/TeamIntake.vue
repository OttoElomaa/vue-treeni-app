<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Player } from '../../types';
import { Button, Card } from 'primevue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from '../../stores/playerStore';
import { useTeamStore } from '../../stores/teamStore';
import { goToAddTest } from '../../router/routing';


const props = defineProps<{
    teamId: string
}>()


const router = useRouter()

const playerStore = usePlayerStore()
const teamStore = useTeamStore()

// COMPUTED REF that FILTERS PLAYERS in STORE based on team ID
const players = playerStore.getPlayersByTeam(Number(props.teamId));
const teamName = ref("")


onMounted(async () => {
    // SUPABASE FETCH TEAM'S PLAYERS + FETCH TEAM INFO
    playerStore.fetchPlayersByTeamId(Number(props.teamId));
    teamName.value = await teamStore.getTeamName(Number(props.teamId))
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
    <div v-if="players.length == 0">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-else class="grid gap-4 grid-cols-1">

        <p class="text-2xl">Team Intake Screen</p>
        <h1 class="text-4xl">{{ teamName }}</h1>

        <div class="flex-row">
            <Button label="Uusi pelaaja" @click="goToAddPlayer" class="flex-none" />
        </div>

        <div class="grid gap-4 grid-cols-1">
            <template v-for="player in playerStore.players" :key="player.id">

                <Card @click="goToPlayer(player.id)"
                    class="cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700">
                    <template #content>
                        <div class="flex flex-row gap-6">
                            <div class="min-w-100">
                                <p class="text-2xl">{{ player.first_name }} {{ player.last_name }}</p>
                                <p>Born {{ player.birth_year }}</p>
                            </div>

                            <Button severity="secondary" class="flex z-10" label="Muokkaa" @click.stop.prevent="goToEditPlayer(player)" />
                            <Button label="Uusi testitulos" @click.stop.prevent="goToAddTest(teamId, String(player.id))" />
                        </div>
                    </template>
                </Card>
            </template>
        </div>

    </div>



</template>