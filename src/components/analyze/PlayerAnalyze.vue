<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePlayerStore } from '../../stores/playerStore';



const playerStore = usePlayerStore()

const props = defineProps<{
        teamId: number,
        playerId: number
}>()

const loading = ref(true)

const player = ref();
const errorText = ref("Loading...")
const playerName = ref("")

onMounted(async () => {
        // SUPABASE FETCH PLAYER'S TESTS


        // SUPABASE FETCH TEAM INFO
        const { player: fetchedPlayer, errorText: fetchedError2 } = await playerStore.fetchPlayerById(props.playerId)
        errorText.value = fetchedError2
        player.value = fetchedPlayer
        if (fetchedPlayer) {
                playerName.value = fetchedPlayer.first_name + " " + fetchedPlayer.last_name
        }
        loading.value = false

});


</script>


<template>
        <div v-if="loading">
                <p class="text-2xl">Loading...</p>
        </div>
        <div v-if="errorText != ''">
                <p>{{ errorText }}</p>
        </div>

        <div v-else>

                <p class="text-2xl">Player Analyze Screen</p>
                <h1 class="text-4xl">{{ playerName }}</h1>
        </div>
</template>