import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { supabase } from "../lib/supabase-client";
import type { CreatePlayer, Player } from "../types";
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

		playerChannel = supabase.channel("all-player-changes"); // name of your choice, just an identifier, can be anything

		playerChannel

			.on(
				"postgres_changes",
				{
					event: "*", // or 'INSERT' | 'UPDATE' | 'DELETE'
					schema: "public",
					table: "players",
				},
				(payload) => {
					console.log("Player Store Realtime:");
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
		switch (type) {
			case "INSERT":
				players.value.push(newItem);
				console.log("PlayerStore insert completed");
				break;

			// UPDATE PLAYERS TABLE BY ADDING THE NEW PLAYER
			case "UPDATE":
				players.value = players.value.map((p) =>
					p.id === newItem.id ? newItem : p,
				);
				console.log("PlayerStore update completed");
				break;
		}
	}

	const fetchPlayersByTeamId = async (id: number) => {
		let fetchedPlayers = [] as Player[];
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
			fetchedPlayers = data as Player[];
			const existingIds = new Set(fetchedPlayers.map((p) => p.id));
			const kept = fetchedPlayers.filter((p) => !existingIds.has(p.id));
			const merged = [...fetchedPlayers, ...kept];
			players.value = merged;

			console.log(data);
			errorText.value = "";
			loadedTeamIds.value.add(id);
			console.log("Loaded teams:");

			console.log(loadedTeamIds);
		}
		return { players: fetchedPlayers, errorText: errorText.value };
	};

	const getPlayersByTeam = (teamId: number) => {
		return computed(() => {
			return players.value.filter((p) => p.team_id === teamId);
		});
	};

	const fetchPlayerById = async (id: number) => {
		let players = [] as Player[];
		let errorText = "Loading...";

		const { error, data } = await supabase
			.from("players")
			.select("*")
			.eq("id", id)
			.order("id", { ascending: true });

		if (error) {
			console.error("Error in supabase player select by ID: ", error.message);
			errorText = "Error in supabase player select by ID";
		} else if (data.length == 0) {
			console.error(
				"Error in supabase select: No data was returned. Are you logged in?",
			);
			errorText = "No data was returned. Are you logged in?";
		} else {
			players = data;
			console.log(data);
			errorText = "";
		}
		return { player: players[0], errorText: errorText };
	};

	async function getPlayerName(id: number) {
		// 1. Check the local team pool first
		let foundPlayer = players.value.find((t) => t.id === id) as Player;
		let playerName = "Player " + id;

		// 2. If not found, go get it from the DB
		if (!foundPlayer) {
			const { player, errorText } = await fetchPlayerById(id);
			foundPlayer = player as Player;
		}
		if (foundPlayer) {
			playerName = foundPlayer.first_name + " " + foundPlayer.last_name;
			console.log("Player name loaded: " + playerName);
		}
		return playerName;
	}

	const insertPlayer = async (playerData: CreatePlayer) => {
		let player = playerData;
		let errorText = "Loading...";

		const { data, error } = await supabase.from("players").insert(player).select().single();
		const createdPlayer = data as unknown as Player

		if (error) {
			console.error("Error in supabase player insert: ", error.message);
			errorText = "Error in supabase player insert";
		} else {
			console.log("Inserted: ", createdPlayer);
			errorText = "";
		}
		return { player: createdPlayer, errorText: errorText };
	};

	const updatePlayer = async (playerData: Player) => {
		let player = playerData;
		let errorText = "Loading...";

		const { error } = await supabase
			.from("players")
			.update(player)
			.eq("id", player.id);

		if (error) {
			console.error("Error in supabase player insert: ", error.message);
			errorText = "Error in supabase player insert";
		} else {
			console.log("Inserted: ", player);
			errorText = "";
		}
		return { player: player, errorText: errorText };
	};

	function clearStore() {
		players.value = [];
		loadedTeamIds.value = new Set();
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
		getPlayersByTeam,
		fetchPlayerById,
		getPlayerName,
		insertPlayer,
		updatePlayer,
		initRealtime,
		clearStore,
	};
});
