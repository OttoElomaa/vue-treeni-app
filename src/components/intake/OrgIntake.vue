<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Team } from '../../types';
import { Button, Card } from 'primevue';
import { RouterLink } from 'vue-router';
import { useTeamStore } from '../../stores/teamStore';
import { goToAddPlayer, goToBatchIntake, goToTeamView } from '../../router/routing';


const teamStore = useTeamStore()

onMounted(async () => {
    teamStore.fetchTeams();
});
</script>

<template>
    <div class="grid gap-4 grid-cols-1">
        <h1 class="text-4xl">Org Intake Screen</h1>

        <p>{{ teamStore.errorText }}</p>

        <div class="flex flex-col gap-4">
            <template v-for="team in teamStore.teams" :key="team.id">
                <div class="flex flex-row">
                    <Card @click="goToTeamView(team.id)"
                        class="cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700">
                        <template #content>
                            <div class="flex flex-row gap-6">
                                <p class="text-2xl  min-w-100">{{ team.team_name }}</p>
                                <Button label="Uusi pelaaja" @click.stop.prevent="goToAddPlayer(String(team.id))" />
                                <Button label="Lisää monta" @click.stop.prevent="goToBatchIntake(String(team.id))" />
                                <div class="min-w-20" />
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </div>
    </div>
</template>