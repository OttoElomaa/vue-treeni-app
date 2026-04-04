import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase-client";
import type { Team } from "../types";


export const useTeamStore = defineStore("teams", () => {
	// State (refs)
	const teams = ref([] as Team[]);
	const isLoading = ref(false);
	const errorText = ref("");

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
		teams.value = data as Team[];
	};

	const fetchTeamById = async (id: number) => {
		let teams = [] as Team[];
		let errorText = "Loading...";

		const { error, data } = await supabase
			.from("teams")
			.select("*")
			.eq("id", id)
			.order("id", { ascending: true });

		if (error) {
			console.error(
				"Error in supabase team select by team ID: ",
				error.message,
			);
			errorText = "Error in supabase team select by team ID";
		} else if (data.length == 0) {
			console.error(
				"Error in supabase select: No data was returned. Are you logged in?",
			);
			errorText = "No data was returned. Are you logged in?";
		} else {
			teams = data;
			console.log(data);
			errorText = "";
		}
		return { team: teams[0], errorText: errorText };
	};

	async function getTeamName(id: number) {
		// 1. Check the local team pool first
		let foundTeam = teams.value.find((t) => t.id === id) as Team;

		// 2. If not found, go get it from the DB
		if (!foundTeam) {
			const { team, errorText } = await fetchTeamById(id);
			foundTeam = team as Team;
		}

		// 3. Return the name (or a fallback)
		return foundTeam ? foundTeam.team_name : "Team " + id;
	}

	function clearStore() {
		teams.value = [];
	}

	return {
		teams,
		isLoading,
		errorText,
		fetchTeams,
		fetchTeamById,
		getTeamName,
		clearStore,
	};
});
