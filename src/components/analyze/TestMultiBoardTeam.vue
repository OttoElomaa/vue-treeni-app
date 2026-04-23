<script setup lang="ts">
import { Card, Column, DataTable } from 'primevue';
import type { SportsTest, TestType } from '../../types';



const props = defineProps<{
    type: TestType
    sportsTests: SportsTest[]
}>()

</script>

<template>
    <p class="text-2xl">{{ type.test_name }}</p>

    <div class="flex flex-row">
        <Card>
            <template #content>

                <DataTable :value="sportsTests" tableStyle="min-width: 50rem" row-hover scrollable
                    scroll-height="600px">
                    <Column field="seconds" header="Seconds"></Column>
                    <Column field="taken_at" header="Taken at">
                        <template #body="{ data }">
                            {{ new Date(data.taken_at).toLocaleDateString() }}
                        </template>
                    </Column>
                    <Column field="player_id" header="Player Id"></Column>
                </DataTable>


            </template>
        </Card>
    </div>

</template>