import { defineStore } from "pinia";
import { ref } from "vue";
import type { Player, TestType } from "../types";
import { fetchAll } from "./genericDatabaseFunctions";

export const useTestTypeStore = defineStore("test_types", () => {
	const testTypes = ref([] as TestType[]);

	const error = ref(null as unknown as Error);

	async function fetchTestTypes() {
		const result = await fetchAll<TestType>("test_type");
		if (result.error) {
			error.value = result.error;
			return;
		}
		testTypes.value = result.data;
		console.log("Test types fetched");
		console.log(testTypes.value);
		
		
	}

	return { testTypes, error, fetchTestTypes };
});
