<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { Message } from 'primevue';
import OrgAnalyze from './analyze/OrgAnalyze.vue';
import TeamAnalyze from './analyze/TeamAnalyze.vue';
import PlayerAnalyze from './analyze/PlayerAnalyze.vue';

const route = useRoute();
const router = useRouter();

const validTiers = ["org", "team", "player"]


const tier = computed(() => {
        let tierTemp = (route.params.tier as string || '').toLowerCase();
        if (!validTiers.includes(tierTemp)) {
                tierTemp = "org"
        }
        return tierTemp
});
const id = computed(() => route.params.id);


// If the URL is invalid, fix it in the address bar too
watch(tier, (newType) => {
        if (newType !== route.params.tier) {
                router.replace({ params: { ...route.params, tier: newType } });
        }
}, { immediate: true });

</script>


<template>
        <OrgAnalyze v-if="tier === 'org'" />
        <TeamAnalyze v-else-if="tier === 'team'" :id="id" />
        <PlayerAnalyze v-else-if="tier === 'player'" :id="id" />

        <div v-else>
                <Message severity="error" >Unknown tier: "{{ route.params.tier }}". Try Org, Team or Player</Message>
        </div>

</template>