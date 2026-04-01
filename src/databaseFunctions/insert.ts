import { supabase } from "../lib/supabase-client";
import type { CreatePlayer, CreateSportsTest } from "../types";

export const insertPlayer = async (playerData:CreatePlayer) => {
  let player = playerData;
  let errorText = "Loading...";

  const { error } = await supabase
    .from("players")
    .insert(player)
    .single()

  if (error) {
    console.error("Error in supabase player insert: ", error.message);
    errorText = "Error in supabase player insert";
  } else {
    console.log("Inserted: ",player);
    errorText = "";
  }
  return { player: player, errorText: errorText };
};



export const insertSportsTest = async (testData:CreateSportsTest) => {
  let sportsTest = testData;
  let errorText = "Loading...";

  const { error } = await supabase
    .from("tests")
    .insert(sportsTest)
    .single()

  if (error) {
    console.error("Error in supabase sports test insert: ", error.message);
    errorText = "Error in supabase sports test insert";
  } else {
    console.log("Inserted: ", sportsTest);
    errorText = "";
  }
  return { sportsTest: sportsTest, errorText: errorText };
};