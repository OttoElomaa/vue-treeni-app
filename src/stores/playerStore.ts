import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase-client";
import type { Player } from "../types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const usePlayerStore = defineStore("players", () => {
	const players = ref([] as Player[]);
	let playerChannel: RealtimeChannel | null = null;

	const isLoading = ref(false);
	const errorText = ref("");

	const loadedTeamIds = ref(new Set()); // Track which teams we've already fetched

	type myEventType = "INSERT" | "UPDATE" | "DELETE";

	// 1. Start the global listener
	function initRealtime() {
		if (playerChannel) return;

		playerChannel = supabase.channel("all-player-changes");

		playerChannel
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "players",
				},
				(payload) => {
					console.log("Player Store Realtime:")
					console.log(payload);

					const { eventType, new: newItem, old: oldItem } = payload;

					const newPlayer = newItem as Player;
					const oldPlayer = oldItem as Player;

					// Only update our pool if we have already fetched this player's team
					if (newPlayer && loadedTeamIds.value.has(newPlayer.team_id)) {
						handleSync(eventType, newPlayer, oldPlayer);
					} else if (eventType === "DELETE") {
						// Always try to delete by ID, just in case
						players.value = players.value.filter((p) => p.id !== oldItem.id);
					}
				},
			)
			.subscribe((status, err) => {
				console.log("REALTIME STATUS:", status);
				if (err) console.error("REALTIME ERROR:", err);

				if (status === "CHANNEL_ERROR") {
					console.error(
						"Check if RLS is blocking the initial connection or if the table is in the publication.",
					);
				}
				if (status === "TIMED_OUT") {
					console.error("Network issue or Supabase service hiccup.");
				}
			});
	}

	function handleSync(type: myEventType, newItem: Player, oldItem: Player) {
		if (type === "INSERT") players.value.push(newItem);
		if (type === "UPDATE") {
			const i = players.value.findIndex((p) => p.id === newItem.id);
			if (i !== -1) players.value[i] = newItem;
		}
	}

	const fetchPlayersByTeamId = async (id: number) => {
		const { error, data } = await supabase
			.from("players")
			.select("*")
			.eq("team_id", id)
			.order("id", { ascending: true });

		if (error) {
			console.error(
				"Error in supabase player select by team ID: ",
				error.message,
			);
			errorText.value = "Error in supabase player select by team ID";
		} else if (data.length == 0) {
			console.error(
				"Error in supabase select: No data was returned. Are you logged in?",
			);
			errorText.value = "No data was returned. Are you logged in?";
		} else {
			players.value = data;
			console.log(data);
			errorText.value = "";
			loadedTeamIds.value.add(id);
		}
		return { players: players, errorText: errorText };
	};

	function clearStore() {
		players.value = [];
		// Don't forget to kill the Realtime channel too!
		if (playerChannel) {
			supabase.removeChannel(playerChannel);
			playerChannel = null;
		}
	}

	return {
		players,
		isLoading,
		errorText,
		fetchPlayersByTeamId,
		initRealtime,
		clearStore,
	};
});
