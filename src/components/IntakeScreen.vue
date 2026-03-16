<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import PlayerIntake from './intake/PlayerIntake.vue';
import { computed, watch } from 'vue';
import TeamIntake from './intake/TeamIntake.vue';
import OrgIntake from './intake/OrgIntake.vue';
import { Message } from 'primevue';

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
        <OrgIntake v-if="tier === 'org'" />
        <TeamIntake v-else-if="tier === 'team'" :id="id" />
        <PlayerIntake v-else-if="tier === 'player'" :id="id" />

        <div v-else>
                <Message severity="error" >Unknown tier: "{{ route.params.tier }}". Try Org, Team or Player</Message>
        </div>

</template>