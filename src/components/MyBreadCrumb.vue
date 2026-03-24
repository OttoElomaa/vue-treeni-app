<script setup lang="ts">
import type { MenuItem, MenuItemCommandEvent } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '../volt/Button.vue'
import Breadcrumb from '../volt/Breadcrumb.vue'


const route = useRoute()
const router = useRouter()

const currentMode = computed(() => {
  const name = route.name?.toString() || ''
  return name.includes('intake') ? 'intake' : 'analyze'
})

const routeHasAdd = computed(() => {
  const name = route.name?.toString() || ''
  return name.includes('add')
})


const items = computed<MenuItem[]>(() => {
  const mode = currentMode.value
  const params = route.params
  const crumbs: MenuItem[] = []

  crumbs.push({
    label: `Org`,
    command: () => router.push(`/${mode}`),
  })

  if (params.teamId) {
    crumbs.push({
      label: `Team ${params.teamId}`,
      command: () => router.push(`/${mode}/team/${params.teamId}`),
    })

    if (routeHasAdd.value) {
      crumbs.push({
        label: `Add Player`,
        command: () => router.push(`/${mode}/team/${params.teamId}/add`),
      })
    }
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
  <div class="mb-8">
    <Breadcrumb :model="items" class="flex-row">
      <template #item="{ item }" class="flex">
        <Button :label="item.label?.toString()" @click="(e) => item.command?.({ originalEvent: e, item })" />
      </template>
    </Breadcrumb>
  </div>

</template>