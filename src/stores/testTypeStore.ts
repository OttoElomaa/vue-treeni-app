import { defineStore } from "pinia";
import { ref } from "vue";
import type { Player, TestCategory, TestType } from "../types";
import { fetchAll } from "./genericDatabaseFunctions";

export const useTestTypeStore = defineStore("test_types", () => {
  const testTypes = ref([] as TestType[]);

  const error = ref(null as unknown as Error);

  const activeCategory = ref(1 as TestCategory);

  const categoryOptions = [
    { label: "Kuntotestit", value: 1 },
    { label: "Tekniikkatestit", value: 2 },
  ];

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

  return { testTypes, error, activeCategory, categoryOptions, fetchTestTypes };
});
