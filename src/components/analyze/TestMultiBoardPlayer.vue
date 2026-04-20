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

                                        <DataTable :value="sportsTests" tableStyle="min-width: 50rem">
                                                <Column field="seconds" header="Seconds"></Column>
                                                <Column field="taken_at" header="Taken at"></Column>
                                        </DataTable>


                                </template>
                        </Card>
                </div>

</template>