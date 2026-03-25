<script setup lang="ts">
import { Breadcrumb, Button } from 'primevue'
import type { MenuItem, MenuItemCommandEvent } from 'primevue/menuitem'
import { onMounted, ref, watch } from 'vue'
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



watch(
  () => route.params.teamId,
  async (teamId) => {
    teamName.value = ''
    if (!teamId) return

    teamName.value = "Joukkue " + teamId
    const { team } = await fetchTeamById(parseInt(teamId as string))
    if (team) {
      teamName.value = team.team_name
    }
  },
  { immediate: true }
)

watch(
  () => route.params.playerId,
  async (playerId) => {
    playerName.value = ''
    if (!playerId) return

    playerName.value = "Pelaaja " + playerId
    const { player } = await fetchPlayerById(parseInt(playerId as string))
    if (player) {
      playerName.value = player.first_name + ' ' + player.last_name
    }
  },
  { immediate: true }
)


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
    <Breadcrumb :model="items" class="bg-transparent">



      <template #item="{ item }">
        <a class="rounded-lg p-3 bg-primary-200 dark:bg-primary-800 
        hover:bg-primary-300 dark:hover:bg-primary-600
        shadow-sm cursor-pointer" @click="(e) => item.command?.({ originalEvent: e, item })">
          <span>{{ item.label }}</span>
        </a>
      </template>


    </Breadcrumb>
  </div>

</template>