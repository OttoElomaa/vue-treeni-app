<script setup lang="ts">
import { Breadcrumb } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const currentMode = computed(() => {
  const name = route.name?.toString() || ''
  return name.includes('intake') ? 'intake' : 'analyze'
})


const items = computed<MenuItem[]>(() => {
  const mode = currentMode.value
  const params = route.params
  const crumbs: MenuItem[] = []

  crumbs.push({label: `Org`,
      command: () => router.push(`/${mode}`),})

  if (params.teamId) {
    crumbs.push({
      label: `Team ${params.teamId}`,
      command: () => router.push(`/${mode}/team/${params.teamId}`),
    })
  }

  if (params.playerId) {
    crumbs.push({
      label: `Player ${params.playerId}`,
      command: () => router.push(`/${mode}/team/${params.teamId}/player/${params.playerId}`),
    })
  }

  return crumbs
})
</script>

<template>
  <div>
    <Breadcrumb :model="items" />
  </div>
  
</template>