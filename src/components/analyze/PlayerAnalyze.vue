<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';
import type { SportsTest, TestCategory } from '../../types';
import { useSportsTestStore } from '../../stores/sportsTestStore';
import { Card, Column, DataTable, SelectButton } from 'primevue';
import { useTestTypeStore } from '../../stores/testTypeStore';
import TestMultiBoardPlayer from './TestMultiBoardPlayer.vue';
import CategorySelectButton from '../misc/CategorySelectButton.vue';



const playerStore = usePlayerStore()
const sportsTestStore = useSportsTestStore()
const testTypeStore = useTestTypeStore()

const props = defineProps<{
        teamId: string,
        playerId: string
}>()


const sportsTests = sportsTestStore.getTestsByPlayer(Number(props.playerId));

function testsByType(typeId: number) {
  return sportsTests.value.filter((test) => test.type_id === typeId)
}

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

                <div class="flex flew-row gap-24">
                        <div>
                                <p class="text-2xl">Player Analyze Screen</p>
                                <h1 class="text-4xl">{{ playerName }}</h1>
                        </div>
                        <CategorySelectButton/>
                        
                </div>


                <div v-for="type in testTypeStore.filteredTestTypes" :key="type.id">
                        <TestMultiBoardPlayer :type="type" :sportsTests="testsByType(type.id)"/>
                </div>
        </div>
</template>