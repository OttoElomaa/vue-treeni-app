<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../lib/supabase-client';
import type { Player, Team } from '../../types';
import { Card } from 'primevue';
import { fetchPlayersByTeamId, fetchTeams } from '../../databaseFunctions/fetch';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  teamId: number
}>()

const players = ref([] as Player[]);
const errorText = ref("Loading...")

onMounted(async () => {
    const { players: fetchedPlayers, errorText: fetchedError } = await fetchPlayersByTeamId(props.teamId);
    players.value = fetchedPlayers
    errorText.value = fetchedError
});

</script>

<template>
    <h1 class="text-4xl">Team Analyze Screen</h1>

    <p>{{ errorText }}</p>


    <RouterLink v-for="player in players" :key="player.id" :to="`/analyze/team/${props.teamId}/player/${player.id}`" class="card-link">

        <Card>
            <template #title>{{ player.first_name }} {{player.last_name}}</template>
            <template #content>Born {{ player.birth_year }}</template>
        </Card>
    </RouterLink>


</template>