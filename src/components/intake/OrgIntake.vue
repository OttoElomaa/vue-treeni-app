<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Team } from '../../types';
import { Button, Card } from 'primevue';
import { RouterLink } from 'vue-router';
import { useTeamStore } from '../../stores/teamStore';
import { goToAddPlayer } from '../../router/routing';


const teamStore = useTeamStore()

onMounted(async () => {
    teamStore.fetchTeams();
});
</script>

<template>
    <div class="grid gap-4 grid-cols-1">
        <h1 class="text-4xl">Org Intake Screen</h1>

        <p>{{ teamStore.errorText }}</p>

        <div class="grid gap-4 grid-cols-1">
            <RouterLink v-for="team in teamStore.teams" :key="team.id" :to="`/intake/team/${team.id}`"
                class="card-link">

                <Card>
                    <template #content>
                        <div class="flex flex-row gap-6">
                            <p class="text-2xl  min-w-100">{{ team.team_name }}</p>
                            <Button label="Uusi pelaaja" @click="goToAddPlayer(String(team.id))" />
                        </div>
                    </template>
                </Card>
            </RouterLink>
        </div>
    </div>
</template>