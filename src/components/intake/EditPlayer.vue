<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { PlayerSchema, type Player } from '../../types';
import { onMounted, ref } from 'vue';
import { Button, Card, InputNumber, InputText } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';
import { goToTeamView } from '../../router/routing';
import { usePlayerStore } from '../../stores/playerStore';



const playerStore = usePlayerStore()


const props = defineProps<{
	teamId: number,
	playerId: number
}>()

const playerName = ref("")

onMounted(async () => {
	isLoading.value = true
	const {player: fetchedPlayer, errorText} = await playerStore.fetchPlayerById(props.playerId)
	initialValues.value = fetchedPlayer as Player
	playerName.value = initialValues.value.first_name + " " + initialValues.value.last_name
	isLoading.value = false
});


const resolver = zodResolver(PlayerSchema);

const initialValues = ref({} as Player);

const submissionDone = ref(false)
const isInvalidSubmit = ref(false)
const isLoading = ref(false)

const onFormSubmit = (submitEvent: FormSubmitEvent) => {
	console.log("Submit event data: ", submitEvent.values)
	console.log("Valid: ", submitEvent.valid)
	console.log("Errors: ", submitEvent.errors)
	if (submitEvent.valid) {
		playerStore.updatePlayer(submitEvent.values as Player)
		submitEvent.reset()
		isInvalidSubmit.value = false
		goToTeamView(props.teamId)
		submissionDone.value = true
	} else {
		isInvalidSubmit.value = true
	}

}
</script>

<template>


	<div v-if="isLoading">
		<p class="text-2xl">Loading...</p>
	</div>

	<Card v-else>


		<template #content class="grid gap-4 grid-cols-1">
			<p class="text-xl">Muokkaa pelaajan tietoja</p>
			<h1 class="text-4xl">{{ playerName }}</h1>

			<Form v-slot="$form" :initialValues :resolver="resolver" @submit="onFormSubmit"
				:validateOnValueUpdate="true" class="flex flex-col gap-4">

				<FormField name="id" v-slot="$field">
					<input type="hidden" v-model="$field.value" />
				</FormField>
				<FormField name="team_id" v-slot="$field">
					<input type="hidden" v-model="$field.value" />
				</FormField>

				<!-- First Name and Last name -->
				<div class="flex flex-row gap-4">
					<div class="flex flex-col gap-1">
						<InputText name="first_name" fluid />
						<MyIntakeErrorMessage :inputValue="$form.first_name" />
					</div>
					<div class="flex flex-col gap-1">
						<InputText name="last_name" type="text" fluid />
						<MyIntakeErrorMessage :inputValue="$form.last_name" />
					</div>
				</div>
				<!-- Birth Year, Month, Day -->
				<div class="flex flex-row gap-4">
					<div class="flex flex-col gap-1">
						<InputNumber name="birth_day" :useGrouping="false" fluid />
						<MyIntakeErrorMessage :inputValue="$form.birth_day" />
					</div>
					<div class="flex flex-col gap-1">
						<InputNumber name="birth_month" :useGrouping="false" fluid />
						<MyIntakeErrorMessage :inputValue="$form.birth_month" />
					</div>
					<div class="flex flex-col gap-1">
						<InputNumber name="birth_year" :useGrouping="false" fluid />
						<MyIntakeErrorMessage :inputValue="$form.birth_year" />
					</div>
				</div>
				<p v-if="isInvalidSubmit">Annetuissa tiedoissa on jokin ongelma, yritä uudestaan!</p>
				<div class="flex flex-row gap-4">
					<Button type="submit" severity="primary" label="Tallenna" />
					<Button severity="secondary" label="Peruuta" @click="goToTeamView(props.teamId)" />
				</div>

			</Form>
		</template>

	</Card>


</template>