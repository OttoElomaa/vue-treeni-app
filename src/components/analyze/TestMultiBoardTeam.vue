<script setup lang="ts">
import { Card, Chip, Column, DataTable, Message } from 'primevue';
import type { Player, SportsTest, TestType } from '../../types';
import { useTeamStats, type TeamStatsEntry } from './useTeamStats';
import { goToPlayer, goToPlayerAnalyze } from '../../router/routing';



const props = defineProps<{
    type: TestType
    sportsTests: SportsTest[]
    players: Player[]
}>()

const teamStats = useTeamStats(
    () => props.sportsTests,
    () => props.players,
)


function formatScore(value: number, field: 'seconds' | 'points') {
    return field === 'seconds' ? `${value}s` : `${value} pts`
}

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'short' })
}

</script>

<template>

    <div class="flex flex-row">
        <Card>
            <template #content>
                <div class="flex flex-col gap-4">

                    <p class="text-2xl">{{ type.test_name }}</p>


                    <!-- Team summary -->
                    <div v-if="teamStats.getTeamStats(type.id)"
                        class="mt-4 flex flex-row gap-6 text-sm text-surface-500">


                        <Message severity="success" :closable="false" class="flex flex-row">
                            <span>Paras</span>
                            <span class="ml-2 font-medium">
                                {{ teamStats.bestPlayer(type.id)?.player.first_name }}
                                {{ formatScore(teamStats.getTeamStats(type.id)!.best,
                                    teamStats.getTeamStats(type.id)!.field) }}
                            </span>
                        </Message>

                        <Message severity="info" :closable="false" class="flex flex-row">
                            <span>Keskiarvo</span>
                            <span class="ml-2 font-medium">
                                {{ formatScore(teamStats.getTeamStats(type.id)!.avg,
                                    teamStats.getTeamStats(type.id)!.field) }}
                            </span>
                        </Message>

                        <Message severity="success" :closable="false" class="flex flex-row">
                            <span>Huonoin</span>
                            <span class="ml-2 font-medium">
                                {{ teamStats.worstPlayer(type.id)?.player.first_name }}
                                {{ formatScore(teamStats.getTeamStats(type.id)!.worst,
                                    teamStats.getTeamStats(type.id)!.field) }}
                            </span>
                        </Message>



                    </div>


                    <DataTable :value="teamStats.topPlayers(type.id)"
                        @row-click="(e) => goToPlayerAnalyze(Number(e.data.player.id), Number(e.data.player.team_id))"
                        row-hover scrollable scroll-height="300px" class="cursor-pointer">
                        <Column header="#" style="width: 3rem">
                            <template #body="{ index }">
                                <span class="font-bold text-surface-400">{{ index + 1 }}</span>
                            </template>
                        </Column>
                        <Column header="Player" style="width: 18rem">
                            <template #body="{ data }: { data: TeamStatsEntry }">
                                <span class="font-semibold">{{ data.player.first_name }} {{ data.player.last_name
                                    }}</span>
                            </template>
                        </Column>
                        <Column header="Best" style="width: 10rem">
                            <template #body="{ data }: { data: TeamStatsEntry }">
                                <span class="font-mono">{{ formatScore(data.stats.best, data.stats.field) }}</span>
                            </template>
                        </Column>
                        <Column header="Date" style="width: 10rem">
                            <template #body="{ data }: { data: TeamStatsEntry }">
                                <span class="text-surface-500">{{ formatDate(data.stats.bestTest.taken_at) }}</span>
                            </template>
                        </Column>
                    </DataTable>


                </div>

            </template>
        </Card>
    </div>

</template>