<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { CreatePlayerSchema, type CreatePlayer } from '../../types';
import { reactive, ref } from 'vue';
import { Button, InputNumber, InputText, Message } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';
import { insertPlayer } from '../../databaseFunctions/insert';


const props = defineProps<{
	teamId: number
}>()


const resolver = zodResolver(CreatePlayerSchema);

const initialValues = reactive({
	team_id: parseInt(props.teamId.toString())
});

const testTestTest = ref(false)
const isInvalidSubmit = ref(false)

const onFormSubmit = (submitEvent: FormSubmitEvent) => {
	console.log("Submit event data: ", submitEvent.values)
	console.log("Valid: ", submitEvent.valid)
	console.log("Errors: ", submitEvent.errors)
	if (submitEvent.valid) {
		insertPlayer(submitEvent.values as CreatePlayer)
		submitEvent.reset()
		isInvalidSubmit.value = false
	} else {
		isInvalidSubmit.value = true
	}
	
}

</script>

<template>
	<div class="grid gap-4 grid-cols-1">
		<h1 class="text-2xl">Intake Screen - Add Player</h1>

		<div v-if="testTestTest">
			<p>Submitted!</p>
		</div>


		<Form v-slot="$form" :initialValues :resolver="resolver" @submit="onFormSubmit" :validateOnValueUpdate="true"
			class="flex flex-col gap-4">

			<FormField name="team_id" v-slot="$field">
				<input type="hidden" v-model="$field.value" />
			</FormField>

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
					<InputNumber name="birth_day" placeholder="Syntymäpäivä" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_day" />
				</div>
				<div class="flex flex-col gap-1">
					<InputNumber name="birth_month" placeholder="Syntymäkuukausi" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_month" />
				</div>
				<div class="flex flex-col gap-1">
					<InputNumber name="birth_year" placeholder="Syntymävuosi" :useGrouping="false" fluid />
					<MyIntakeErrorMessage :inputValue="$form.birth_year" />
				</div>
			</div>
			<p v-if="isInvalidSubmit">Annetuissa tiedoissa on jokin ongelma, yritä uudestaan!</p>
			<Button type="submit" severity="primary" label="Submit" />
		</Form>
	</div>


</template>