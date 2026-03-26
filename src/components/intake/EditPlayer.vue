<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { CreatePlayerSchema, PlayerSchema, type CreatePlayer, type Player } from '../../types';
import { onMounted, reactive, ref } from 'vue';
import { Button, Card, InputNumber, InputText, Message } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';
import { insertPlayer } from '../../databaseFunctions/insert';
import { fetchPlayerById } from '../../databaseFunctions/fetch';
import { updatePlayer } from '../../databaseFunctions/update';
import router from '../../router';
import { goToTeamView } from '../../router/routing';


const props = defineProps<{
	teamId: number,
	playerId: number
}>()

const player = ref({} as Player)
const playerName = ref("")
const loading = ref(true)

onMounted(async () => {


	const { player: fetchedPlayer, errorText: fetchedError } = await fetchPlayerById(props.playerId)
	player.value = fetchedPlayer as Player
	if (fetchedPlayer) {
		playerName.value = fetchedPlayer.first_name + " " + fetchedPlayer.last_name
	}
	initialValues.value = player.value
	loading.value = false
});


const resolver = zodResolver(PlayerSchema);

const initialValues = ref({} as Player);

const testTestTest = ref(false)
const isInvalidSubmit = ref(false)

const onFormSubmit = (submitEvent: FormSubmitEvent) => {
	console.log("Submit event data: ", submitEvent.values)
	console.log("Valid: ", submitEvent.valid)
	console.log("Errors: ", submitEvent.errors)
	if (submitEvent.valid) {
		updatePlayer(submitEvent.values as Player)
		submitEvent.reset()
		isInvalidSubmit.value = false
		goToTeamView(props.teamId)
	} else {
		isInvalidSubmit.value = true
	}

}



</script>

<template>


	<div v-if="loading">
		<p class="text-2xl">Loading...</p>
	</div>

	<Card v-else>


		<template #content class="grid gap-4 grid-cols-1">
			<p class="text-xl">Muokkaa pelaajan tietoja</p>
			<h1 class="text-4xl">{{ playerName }}</h1>

			<div v-if="testTestTest">
				<p>Submitted!</p>
			</div>


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