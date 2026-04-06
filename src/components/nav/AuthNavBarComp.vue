<script setup lang="ts">
import { Button } from 'primevue';
import { useAuthStore } from '../../stores/authStore';
import { useTeamStore } from '../../stores/teamStore';
import { usePlayerStore } from '../../stores/playerStore';


const auth = useAuthStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()


const handleLogout = async () => {
	// 1. Kill the Supabase session
	await auth.signOut()

	teamStore.clearStore()
	playerStore.clearStore()

	//router.push('/login')
	console.log('Stores cleared and logged out')
}

const handleLogin = () => {
	auth.devLogin()
	playerStore.initRealtime()
}

</script>

<template>
	<div v-if="!auth.user">
		<Button @click="handleLogin">Dev Admin Login</Button>
	</div>
	<div v-else class="flex">
		<div class="flex flex-col">
			<p>Logged in as: </p>
			<p>{{ auth.user.email }}</p>
		</div>
		<Button @click="handleLogout">Logout</Button>
	</div>
</template>