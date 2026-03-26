import { supabase } from "../lib/supabase-client";
import type { CreatePlayer, Player } from "../types";

export const updatePlayer = async (playerData: Player) => {
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
