import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase-client";
import type { Team } from "../types";
import { fetchTeams } from "../databaseFunctions/fetch";




export const useTeamStore = defineStore('teams', () => {
  // State (refs)
  const teams = ref([] as Team[])
  const isLoading = ref(false)
  const errorText = ref("")

  // Actions (functions)
  const fetchTeams = async () => {
  
  
  const { error, data } = await supabase
    .from("teams")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error in supabase team select: ", error.message);
    errorText.value = "Error in supabase team select";
  } else if (data.length == 0) {
    console.error(
      "Error in supabase select: No data was returned. Are you logged in?",
    );
    errorText.value = "No data was returned. Are you logged in?";
  } else {
    
    console.log(data);
    errorText.value = "";
  }
  teams.value = data as Team[]
};

  // Return everything the component needs access to
  return { teams, isLoading, errorText, fetchTeams }
})