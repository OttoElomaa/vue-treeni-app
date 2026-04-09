<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';
import type { SportsTest } from '../../types';
import { useSportsTestStore } from '../../stores/sportsTestStore';
import { Card, Column, DataTable } from 'primevue';



const playerStore = usePlayerStore()
const sportsTestStore = useSportsTestStore()

const props = defineProps<{
        teamId: string,
        playerId: string
}>()


const sportsTests = sportsTestStore.getTestsByPlayer(Number(props.playerId));
const player = ref();
const playerName = ref("")
const loading = ref(true)


onMounted(async () => {
        playerStore.fetchPlayerById(Number(props.playerId))
        playerName.value = await playerStore.getPlayerName(Number(props.playerId))
        loading.value = false

});


</script>


<template>
        <div v-if="sportsTests.length == 0">
                <p class="text-2xl">Loading...</p>
        </div>
        <div v-else class="grid gap-4 grid-cols-1">

                <p class="text-2xl">Player Analyze Screen</p>
                <h1 class="text-4xl">{{ playerName }}</h1>

                <div class="flex flex-row">
            <Card>
                <template #content>

                    <DataTable :value="sportsTests" tableStyle="min-width: 50rem">
                        <Column field="seconds" header="Seconds"></Column>
                        <Column field="taken_at" header="Taken at"></Column>
                        <Column field="test_type" header="Test type"></Column>
                    </DataTable>
                    

                </template>
            </Card>
        </div>
        </div>
</template>