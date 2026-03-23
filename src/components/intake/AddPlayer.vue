<script setup lang="ts">
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { PlayerSchema } from '../../types';
import { reactive, ref } from 'vue';
import { Button, InputText, Message } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';


const resolver = zodResolver(PlayerSchema);

const initialValues = reactive({
	id: null
});

const testTestTest = ref(false)

const onFormSubmit = () => {
	testTestTest.value = true
}

</script>

<template>
	<div class="grid gap-4 grid-cols-1">
		<h1 class="text-2xl">Intake Screen - Add Player</h1>
		<p v-if="testTestTest">Submitted!</p>




		<Form v-slot="$form" :initialValues :resolver="resolver" @submit="onFormSubmit" :validateOnValueUpdate="true"
			class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<InputText name="first_name" type="text" placeholder="Etunimi" fluid />
				<MyIntakeErrorMessage :inputValue="$form.first_name" />
			</div>
			<Button type="submit" severity="secondary" label="Submit" />
		</Form>
	</div>


</template>