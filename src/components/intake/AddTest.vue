<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useSportsTestStore } from '../../stores/sportsTestStore';
import { onMounted, reactive, ref } from 'vue';
import { CreateSportsTestSchema, type CreateSportsTest } from '../../types';
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms';
import { goToTeamView } from '../../router/routing';
import { Button, Card, InputNumber } from 'primevue';
import MyIntakeErrorMessage from './MyIntakeErrorMessage.vue';
import { usePlayerStore } from '../../stores/playerStore';



const sportsTestStore = useSportsTestStore()
const playerStore = usePlayerStore()

const props = defineProps<{
    teamId: string,
    playerId: string
}>()


const playerName = ref("")
const loading = ref(true)

onMounted(async () => {
    playerName.value = await playerStore.getPlayerName(Number(props.playerId))
    loading.value = false
})

const resolver = zodResolver(CreateSportsTestSchema);

const initialValues = reactive({
    player_id: parseInt(props.playerId)
});

const isInvalidSubmit = ref(false)
const submitSucceeded = ref(false)

const onFormSubmit = (submitEvent: FormSubmitEvent) => {
    console.log("Submit event data: ", submitEvent.values)
    console.log("Valid: ", submitEvent.valid)
    console.log("Errors: ", submitEvent.errors)
    if (submitEvent.valid) {
        sportsTestStore.addSportsTest(submitEvent.values as CreateSportsTest)
        submitEvent.reset()
        isInvalidSubmit.value = false
        submitSucceeded.value = true
    } else {
        isInvalidSubmit.value = true
        submitSucceeded.value = false
    }

}

</script>

<template>
    <div v-if="loading">
        <p class="text-2xl">Loading...</p>
    </div>
    <Card v-else>
        <template #content class="grid gap-4 grid-cols-1">
            <p class="text-2xl">Uusi testitulos</p>
            <p class="text-4xl">{{ playerName }}</p>

            <Form v-slot="$form" :initialValues :resolver="resolver" @submit="onFormSubmit"
                :validateOnValueUpdate="true" class="flex flex-col gap-4">

                <FormField name="team_id" v-slot="$field">
                    <input type="hidden" v-model="$field.value" />
                </FormField>

                <!-- Seconds and Test type -->
                <div class="flex flex-row gap-4">
                    <div class="flex flex-col gap-1">
                        <InputNumber name="seconds" type="number" placeholder="Sekunnit" fluid />
                        <MyIntakeErrorMessage :inputValue="$form.seconds" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <InputNumber name="type_id" type="number" placeholder="Testityyppi" fluid />
                        <MyIntakeErrorMessage :inputValue="$form.type_id" />
                    </div>
                </div>

                <p v-if="isInvalidSubmit">Annetuissa tiedoissa on jokin ongelma, yritä uudestaan!</p>
                <p v-if="submitSucceeded" class="text-xl">Tallennus onnistui!</p>

                <div class="flex flex-row gap-4">
                    <Button type="submit" severity="primary" label="Tallenna" />
                    <Button severity="secondary" label="Peruuta" @click="goToTeamView(Number(props.teamId))" />
                </div>
            </Form>
        </template>
    </Card>

</template>