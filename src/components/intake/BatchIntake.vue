<script setup lang="ts">
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import SelectButton from 'primevue/selectbutton'
import Message from 'primevue/message'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useBatchIntake, type ParsedRow } from './batchIntake.ts'
import CategorySelectButton from '../misc/CategorySelectButton.vue'
import { onMounted, watch } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.ts'

const props = defineProps<{ teamId: number }>()
const playerStore = usePlayerStore()

const {
  testYear, testMonth, rawCsv, importing, importDone, importResult,
  testTypes, hasContent, parsedRows, validRows, errorRows, canImport, totalTests,
  MONTH_OPTIONS, CURRENT_YEAR,
  doImport, reset,
} = useBatchIntake(() => props.teamId)


onMounted(() => {
  playerStore.fetchPlayersByTeamId(props.teamId)
})

watch(
  () => playerStore.players.length,
  (len) => console.log('players store changed, length:', len),
)

</script>

<template>
  <div>
    <!-- Success -->
    <Message v-if="importDone" severity="success" :closable="false">
      <div class="flex items-center justify-between gap-4 text-base">
        <span>
          <strong>Import complete.</strong>
          <template v-if="importResult.created">
            {{ importResult.created }} new player{{ importResult.created !== 1 ? 's' : '' }} created.
          </template>
          <template v-if="importResult.existing">
            Scores added to {{ importResult.existing }}
            existing player{{ importResult.existing !== 1 ? 's' : '' }}.
          </template>
        </span>
        <Button severity="secondary" text size="small" label="Import more" @click="reset" />
      </div>
    </Message>

    <template v-else>
      <!-- Date -->
      <div class="flex flex-row mb-6">
        <div>
          <label class="block text-sm font-semibold mb-1">Testin päivämäärä</label>
          <div class="flex flex-row gap-2">
            <Select v-model="testMonth" :options="MONTH_OPTIONS" option-label="label" option-value="value"
              class="w-40" />
            <InputNumber v-model="testYear" :min="2000" :max="CURRENT_YEAR" :use-grouping="false" class="w-24" />
          </div>
        </div>

        <!-- Test Type Category -->
        <CategorySelectButton class="ml-48" />
      </div>




      <p class="text-sm text-surface-500 mb-3">
        Paste rows as:
        <code>First, Last, Year, {{testTypes.map(t => t.test_name).join(', ')}}</code>
      </p>

      <p class="text-sm text-surface-500 mb-3">
        Lyhennetyt syntymävuodet (05, 15) muutetaan -> 2005, 2015 jne.
        Comma <em>or</em> semicolon separated; European decimal auto-detected with
        <code>;</code>.
        Existing players get scores added; new names create a player in the current team.
      </p>

      <Textarea v-model="rawCsv" class="w-full font-mono mb-4" style="resize: vertical"
        :placeholder="`Alice, Smith, 05, 12.5, 8.1\nBob, Jones, 1998, 11.2, , 13.8`" :rows="8" />

      <!-- Preview -->
      <template v-if="hasContent && parsedRows.length">
        <div class="flex flex-col gap-4 mb-6">
          <span class="text-sm font-semibold">
            Preview — {{ validRows.length }} valid row{{ validRows.length !== 1 ? 's' : '' }}
          ({{ totalTests }} test{{ totalTests !== 1 ? 's' : '' }})
          <template v-if="errorRows.length">
            , {{ errorRows.length }} error{{ errorRows.length !== 1 ? 's' : '' }}
          </template>
          </span>
          <div class="flex gap-2 shrink-0">
            <Button label="Import" size="small" :disabled="!canImport" :loading="importing" @click="doImport" />
            <Button severity="secondary" text size="small" label="Clear" @click="rawCsv = ''" />
          </div>
        </div>


      </template>

      <DataTable :value="parsedRows" scrollable scroll-height="500px" size="small">
        <!-- ICON FOR ROW STATUS -->
        <Column header="" style="width: 3rem">
          <template #body="{ data }: { data: ParsedRow }">
            <Tag v-if="data.status === 'new'" severity="success" icon="pi pi-plus" class="w-6 h-6 p-0 justify-center" />
            <Tag v-else-if="data.status === 'existing'" severity="info" icon="pi pi-user"
              class="w-6 h-6 p-0 justify-center" />
          </template>
        </Column>
        <!-- NAME AND AGE -->
        <Column header="Etunimi">
          <template #body="{ data }: { data: ParsedRow }">
            {{ data.firstName }}
          </template>
        </Column>
        <Column header="Sukunimi">
          <template #body="{ data }: { data: ParsedRow }">
            {{ data.lastName }}
          </template>
        </Column>
        <Column header="Syntymävuosi">
          <template #body="{ data }: { data: ParsedRow }">
            {{ data.birthYear ?? '—' }}
          </template>
        </Column>
        <!-- THE TEST TYPE COLUMNS TO RECORD THE RESULTS -->
        <Column v-for="(t, i) in testTypes" :key="t.id" :header="t.test_name">
          <template #body="{ data }: { data: ParsedRow }">
            {{ data.scores[i] ?? '—' }}
          </template>
        </Column>
        <Column header="">
          <template #body="{ data }: { data: ParsedRow }">
            <small v-if="data.errorMsg" class="text-red-500">{{ data.errorMsg }}</small>
          </template>
        </Column>
      </DataTable>


    </template>
  </div>
</template>