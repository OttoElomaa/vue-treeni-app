<script setup lang="ts">
import { SelectButton } from 'primevue';
import { useTestTypeStore } from '../../stores/testTypeStore';

const testTypeStore = useTestTypeStore()
</script>

<template>
    <SelectButton v-model="testTypeStore.activeCategory" :options="testTypeStore.categoryOptions" optionLabel="label"
                                optionValue="value" :allowEmpty="false" />
</template>