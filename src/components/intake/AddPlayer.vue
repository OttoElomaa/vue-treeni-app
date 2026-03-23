<script setup lang="ts">
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { PlayerSchema } from '../../types';
import { reactive, ref } from 'vue';
import { Button, InputNumber, InputText, Message } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';


const props = defineProps<{
	teamId: number
}>()


const resolver = zodResolver(PlayerSchema);

const initialValues = reactive({
	id: null
});

const testTestTest = ref(false)
const isInvalidSubmit = ref(false)

const onFormSubmit = () => {
	testTestTest.value = true
	isInvalidSubmit.value = true
}

</script>

<template>
	<div class="grid gap-4 grid-cols-1">
		<h1 class="text-2xl">Intake Screen - Add Player</h1>

		<div v-if="testTestTest">
			<p >Submitted!</p>
		</div>
		

		<Form v-slot="$form" :initialValues :resolver="resolver" @submit="onFormSubmit" :validateOnValueUpdate="true"
			class="flex flex-col gap-4">
			<!-- First Name and Last name -->
			<div class="flex flex-row gap-4">
				<div class="flex flex-col gap-1">
					<InputText name="first_name" type="text" placeholder="Etunimi" fluid />
					<MyIntakeErrorMessage :inputValue="$form.first_name" />
				</div>
				<div class="flex flex-col gap-1">
					<InputText name="last_name" type="text" placeholder="Sukunimi" fluid />
					<MyIntakeErrorMessage :inputValue="$form.last_name" />
				</div>
			</div>
			<!-- Birth Year, Month, Day -->
			<div class="flex flex-row gap-4">
				<div class="flex flex-col gap-1">
					<InputNumber name="birth_day" placeholder="Syntymävuosi" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_day" />
				</div>
				<div class="flex flex-col gap-1">
					<InputNumber name="birth_month" placeholder="Syntymävuosi" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_month" />
				</div>
				<div class="flex flex-col gap-1">
					<InputNumber name="birth_year" placeholder="Syntymävuosi" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_year" />
				</div>
			</div>
			<p v-if="isInvalidSubmit">Annetuissa tiedoissa on jokin ongelma, yritä uudestaan!</p>
			<Button type="submit" severity="secondary" label="Submit" />
		</Form>
	</div>


</template>