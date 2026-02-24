<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase-client'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional


const testvalues = ref<any[] | null>([])
async function getTest() {
  const { data } = await supabase.from('test_table').select()
  testvalues.value = data
}
onMounted(() => {
  getTest()
})
</script>


<template>
  <h1>Showing some test data from supabase:</h1>
  <!-- <ul>
    <li v-for="t in testvalues" :key="t.id">{{ t.test_idk }}</li>
  </ul> -->
  <DataTable :value="testvalues" tableStyle="min-width: 50rem">
    <Column field="created_at" header="Created at"></Column>
    <Column field="test_idk" header="Pointless string"></Column>
</DataTable>
</template>