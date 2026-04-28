<script setup lang="ts">
import { Card, Column, DataTable } from 'primevue';
import type { SportsTest, TestType } from '../../types';



const props = defineProps<{
        type: TestType
        sportsTests: SportsTest[]
}>()

</script>

<template>


        <div class="flex flex-row">
                <Card>
                        <template #content>
                                <div class="flex flex-col gap-4">
                                        <p class="text-2xl">{{ type.test_name }}</p>
                                        <DataTable :value="sportsTests" tableStyle="min-width: 50rem" row-hover>
                                                <Column field="seconds" header="Seconds"></Column>
                                                <Column field="taken_at" header="Taken at">
                                                        <template #body="{ data }">
                                                                {{ new Date(data.taken_at).toLocaleDateString() }}
                                                        </template>
                                                </Column>
                                        </DataTable>
                                </div>

                        </template>
                </Card>
        </div>

</template>