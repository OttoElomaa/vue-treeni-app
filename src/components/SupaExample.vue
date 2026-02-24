<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase-client'


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
  <ul>
    <li v-for="t in testvalues" :key="t.id">{{ t.test_idk }}</li>
  </ul>
</template>