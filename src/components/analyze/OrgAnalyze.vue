<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '../../lib/supabase-client';
import type { Team } from '../../types';
import { Card } from 'primevue';



const tasks = ref([] as Team[]);
const errorText = ref("Nothing")

const fetchTasks = async () => {
    const { error, data } = await supabase.from("teams")
        .select("*")
        .order("id", { ascending: true })

    if (error) {
        console.error("Error in supabase select: ", error.message)
        errorText.value = "Error in supabase select"
    }
    else {
        tasks.value = data
        console.log(data)
        errorText.value = ""
    }
}

onMounted(() => {
    fetchTasks();
});

</script>

<template>
    <h1 class="text-4xl">Org Analyze Screen</h1>

    <p>{{ errorText }}</p>
    <li v-for="task in tasks">
        <Card>
            <template #title>{{task.team_name}}</template>
            <template #content>Info...</template>
        </Card>

    </li>
</template>