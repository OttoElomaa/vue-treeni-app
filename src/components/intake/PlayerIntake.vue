<script setup lang="ts">
import { onMounted, ref, Text } from 'vue';
import type { Player } from '../../types';
import { fetchPlayerById } from '../../databaseFunctions/fetch';




const props = defineProps<{
        teamId: number,
        playerId: number
}>()

const loading = ref(true)

const player = ref();
const errorText = ref("Loading...")
const playerName = ref("")

onMounted(async () => {
        // SUPABASE FETCH PLAYER'S TESTS


        // SUPABASE FETCH TEAM INFO
        const { player: fetchedPlayer, errorText: fetchedError2 } = await fetchPlayerById(props.playerId)
        errorText.value = fetchedError2
        player.value = fetchedPlayer
        if (fetchedPlayer) {
                playerName.value = fetchedPlayer.first_name + " " + fetchedPlayer.last_name
        }
        loading.value = false

});


</script>


<template>
        <div v-if="loading">
                <p class="text-2xl">Loading...</p>
        </div>

        <div v-else>

                <p class="text-2xl">Player Intake Screen</p>
                <h1 class="text-4xl">{{ playerName }}</h1>
        </div>
</template>