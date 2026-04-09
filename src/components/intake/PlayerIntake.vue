<script setup lang="ts">
import { onMounted, ref, } from 'vue';
import { Card } from 'primevue';
import { usePlayerStore } from '../../stores/playerStore';
import { useSportsTestStore } from '../../stores/sportsTestStore.ts'


const playerStore = usePlayerStore()
const sportsTestStore = useSportsTestStore()

const props = defineProps<{
        teamId: string,
        playerId: string
}>()



const sportsTests = sportsTestStore.getTestsByPlayer(Number(props.playerId));
const playerName = ref("")
const loading = ref(true)




onMounted(async () => {
        playerName.value = await playerStore.getPlayerName(Number(props.playerId))
        sportsTestStore.fetchTestsByPlayerId(Number(props.playerId));
        loading.value = false
});


</script>


<template>
        <div v-if="sportsTests.length == 0">
                <p class="text-2xl">Loading...</p>
        </div>
        <div v-else class="grid gap-4 grid-cols-1">

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