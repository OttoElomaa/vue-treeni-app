<script setup lang="ts">
import { Button } from 'primevue';
import { useAuthStore } from '../../stores/authStore';
import { useTeamStore } from '../../stores/teamStore';
import { usePlayerStore } from '../../stores/playerStore';
import { supabase } from '../../lib/supabase-client';
import { useTestTypeStore } from '../../stores/testTypeStore';


const auth = useAuthStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const testTypeStore = useTestTypeStore()



supabase.auth.onAuthStateChange((event, session) => {
	// USER LOGGED IN
	if (event === 'SIGNED_IN' && session) {
		playerStore.initRealtime()
		testTypeStore.fetchTestTypes()
	}
	// USER LOGGED OUT
	if (event === 'SIGNED_OUT') {
		teamStore.clearStore()
		playerStore.clearStore()
		console.log('Stores cleared and logged out')
	}
})


</script>

<template>
	<div v-if="!auth.user">
		<Button @click="auth.devLogin()">Dev Admin Login</Button>
	</div>
	<div v-else class="flex">
		<div class="flex flex-col">
			<p>Logged in as: </p>
			<p>{{ auth.user.email }}</p>
		</div>
		<Button @click="auth.signOut()">Logout</Button>
	</div>
</template>