<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Card, Column, DataTable } from 'primevue';
import { usePlayerStore } from '../../stores/playerStore';
import { useTeamStore } from '../../stores/teamStore';
import { goToPlayerAnalyze } from '../../router/routing';
import CategorySelectButton from '../misc/CategorySelectButton.vue';
import type { SportsTest } from '../../types';
import { useSportsTestStore } from '../../stores/sportsTestStore';
import { useTestTypeStore } from '../../stores/testTypeStore';



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


//const teamTests = computed(sportsTestStore.sportsTests.filter(t => t.))

onMounted(async () => {
    // SUPABASE FETCH TEAM'S PLAYERS + FETCH TEAM INFO
    teamName.value = await teamStore.getTeamName(Number(props.teamId))
    playerStore.fetchPlayersByTeamId(Number(props.teamId));
});

</script>

<template>
    <div v-if="players.length == 0">
        <p class="text-2xl">Loading...</p>
    </div>
    <div v-else class="grid gap-4 grid-cols-1">

        <div class="flex flex-row gap-24">
            <div>
                <p class="text-2xl">Team Analyze Screen</p>
                <h1 class="text-4xl">{{ teamName }}</h1>
            </div>
            <CategorySelectButton/>

        </div>

        <div class="flex flex-row">
            <Card>
                <template #content>

                    <DataTable :value="players" tableStyle="min-width: 50rem"
                        @row-click="(e) => goToPlayerAnalyze(e.data.id, Number(props.teamId))" row-hover
                        class="cursor-pointer">
                        <Column field="first_name" header="First Name"></Column>
                        <Column field="last_name" header="Last Name"></Column>
                        <Column field="birth_year" header="Birth year"></Column>
                    </DataTable>


                </template>
            </Card>
        </div>
    </div>



</template>