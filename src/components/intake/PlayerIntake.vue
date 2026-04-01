<script setup lang="ts">
import { onMounted, ref, Text } from 'vue';
import type { Player, SportsTest } from '../../types';
import { fetchPlayerById, fetchTestsByPlayerId } from '../../databaseFunctions/fetch';
import { Button, Card } from 'primevue';




const props = defineProps<{
        teamId: number,
        playerId: number
}>()

const loading = ref(true)

const player = ref();
const playerName = ref("")

const sportsTests = ref([] as SportsTest[])
const errorText = ref("")

onMounted(async () => {
        // SUPABASE FETCH PLAYER'S TESTS
        const { sportsTests: fetchedTests, errorText: fetchedError } = await fetchTestsByPlayerId(props.playerId);
        sportsTests.value = fetchedTests
        errorText.value = fetchedError

        // SUPABASE FETCH PLAYER INFO
        const { player: fetchedPlayer, errorText: fetchedError2 } = await fetchPlayerById(props.playerId)
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

                <div class="grid gap-4 grid-cols-1">
                        <template v-for="test in sportsTests" :key="test.id">

                                <Card class="cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700">
                                        <template #content>
                                                <div class="flex flex-row gap-6">
                                                        <div class="min-w-100">
                                                                <p class="text-2xl">{{ test.seconds }} {{
                                                                        test.test_type }}</p>
                                                                <p>Taken at: {{ test.taken_at }}</p>
                                                        </div>
                                                        <!-- <Button class="flex z-10" label="Muokkaa" @click.stop.prevent="goToEditPlayer(player)" /> -->
                                                </div>
                                        </template>
                                </Card>
                        </template>
                </div>
        </div>
</template>