<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Card, Column, DataTable } from 'primevue';
import { usePlayerStore } from '../../stores/playerStore';
import { useTeamStore } from '../../stores/teamStore';
import { goToPlayerAnalyze } from '../../router/routing';
import CategorySelectButton from '../misc/CategorySelectButton.vue';
import type { Player, SportsTest } from '../../types';
import { useSportsTestStore } from '../../stores/sportsTestStore';
import { useTestTypeStore } from '../../stores/testTypeStore';
import TestMultiBoardTeam from './TestMultiBoardTeam.vue';
import { useTestStats } from './useTestStats';
import { useTeamStats } from './useTeamStats';



const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const sportsTestStore = useSportsTestStore()
const testTypeStore = useTestTypeStore()


const props = defineProps<{
    teamId: string
}>()


// COMPUTED REF that FILTERS PLAYERS in STORE based on team ID
const players = playerStore.getPlayersByTeam(Number(props.teamId));
const teamName = ref("")


const teamTests = ref([] as SportsTest[])

function teamTestsByType(typeId: number) {
    return teamTests.value.filter(t => t.type_id === typeId)
}


const { getPlayerStats } = useTestStats(
    () => teamTests.value
)


onMounted(async () => {
    // SUPABASE FETCH TEAM'S PLAYERS + FETCH TEAM INFO
    playerStore.fetchPlayersByTeamId(Number(props.teamId));
    teamTests.value = await sportsTestStore.fetchTestsByTeam(Number(props.teamId))
    teamName.value = await teamStore.getTeamName(Number(props.teamId))
});

</script>

<template>
    <div v-if="teamTests.length == 0">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-else class="grid gap-4 grid-cols-1">

        <div class="flex flex-row gap-24">
            <div>
                <p class="text-2xl">Team Analyze Screen</p>
                <h1 class="text-4xl">{{ teamName }}</h1>
            </div>
            <CategorySelectButton />

        </div>

        <div class="flex flex-col gap-6">
            <div class="flex flex-row">
                <Card>
                    <template #content>
                        <DataTable :value="players" tableStyle="min-width: 50rem"
                            @row-click="(e) => goToPlayerAnalyze(e.data.id, Number(props.teamId))" row-hover stripedRows
                            scrollable scroll-height="600px" class="cursor-pointer">
                            <Column field="first_name" header="First Name" sortable></Column>
                            <Column field="last_name" header="Last Name" sortable></Column>
                            <Column field="birth_year" header="Birth year" sortable></Column>

                            <Column v-for="t in testTypeStore.filteredTestTypes" :key="t.id" :header="t.test_name"
                                style="width: 5.5rem">
                                <template #body="{ data }: { data: Player }">
                                    {{ getPlayerStats(data.id, t.id)?.best ?? '—' }}
                                </template>
                            </Column>

                        </DataTable>
                    </template>
                </Card>
            </div>

            <div v-for="type in testTypeStore.filteredTestTypes" :key="type.id">
                <TestMultiBoardTeam :type="type" :sportsTests="teamTestsByType(type.id)" :players="players" />
            </div>
        </div>
    </div>



</template>