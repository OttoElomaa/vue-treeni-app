<script setup lang="ts">
import { Button } from 'primevue';
import { useAuthStore } from '../../stores/authStore';


const auth = useAuthStore()
</script>

<template>
	<div v-if="!auth.user" class="dev-banner">
		<Button @click="auth.devLogin">⚡ Dev Admin Login</Button>
	</div>
	<div v-else>
		<p>
			Logged in as: {{ auth.user.email }}
		</p>
	</div>
</template>