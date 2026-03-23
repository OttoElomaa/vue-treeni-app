<script setup lang="ts">
import { Message } from 'primevue';


const props = defineProps(['inputValue'])

</script>


<template>
	<Message v-if="inputValue?.invalid" severity="error" size="small" variant="simple">
		{{ inputValue.error.message }}
	</Message>

</template>