<script setup lang="ts">
import { Breadcrumb, Button } from 'primevue'
import type { MenuItem, MenuItemCommandEvent } from 'primevue/menuitem'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPlayerById, fetchTeamById } from '../databaseFunctions/fetch'


const route = useRoute()
const router = useRouter()

const routeParams = route.params
const loading = ref(true)

const currentMode = computed(() => {
  const name = route.name?.toString() || ''
  return name.includes('intake') ? 'intake' : 'analyze'
})

const routeHasAdd = computed(() => {
  const name = route.name?.toString() || ''
  return name.includes('add')
})

const team = ref();
const teamName = ref("")

const player = ref();
const playerName = ref("")



onMounted(async () => {

  const teamId = routeParams.teamId as string
  const playerId = routeParams.playerId as string

if (teamId) {
    const { team: fetchedTeam, errorText: fetchedError1 } = await fetchTeamById(parseInt(teamId))

    team.value = fetchedTeam
    if (fetchedTeam) {
      teamName.value = fetchedTeam.team_name
    }
  }

  if (playerId) {
    const { player: fetchedPlayer, errorText: fetchedError2 } = await fetchPlayerById(parseInt(playerId))

    player.value = fetchedPlayer
    if (fetchedPlayer) {
      playerName.value = fetchedPlayer.first_name + " " + fetchedPlayer.last_name
    }
  }
  loading.value = false
});


const items = computed<MenuItem[]>(() => {
  const mode = currentMode.value
  const params = route.params
  const crumbs: MenuItem[] = []

  crumbs.push({
    label: `Palloseura`,
    command: () => router.push(`/${mode}`),
  })

  if (params.teamId) {
    crumbs.push({
      label: `${teamName.value}`,
      command: () => router.push(`/${mode}/team/${params.teamId}`),
    })

    if (routeHasAdd.value) {
      crumbs.push({
        label: `Uusi pelaaja`,
        command: () => router.push(`/${mode}/team/${params.teamId}/add`),
      })
    }
  }

  if (params.playerId) {
    crumbs.push({
      label: `${playerName.value}`,
      command: () => router.push(`/${mode}/team/${params.teamId}/player/${params.playerId}`),
    })
  }

  return crumbs
})

</script>

<template>
  <div class="mb-8">
    <Breadcrumb :model="items">



      <template #item="{ item }">
        <a class="rounded-lg p-3 bg-primary-200 dark:bg-surface-700 
        hover:bg-primary-300 dark:hover:bg-surface-600
        shadow-sm cursor-pointer" @click="(e) => item.command?.({ originalEvent: e, item })">
          <span>{{ item.label }}</span>
        </a>
      </template>


    </Breadcrumb>
  </div>

</template>