import { supabase } from "../lib/supabase-client";
import type { Player, SportsTest, Team } from "../types";







// ####################################################################
// SPORTS TESTS
export const fetchTestsByPlayerId = async (id:number) => {
  let tests = [] as SportsTest[];
  let errorText = "Loading...";

  const { error, data } = await supabase
    .from("tests")
    .select("*")
    .eq("player_id", id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error in supabase player select by team ID: ", error.message);
    errorText = "Error in supabase player select by team ID";
  } else if (data.length == 0) {
    console.error(
      "Error in supabase select: No data was returned. Are you logged in?",
    );
    errorText = "No data was returned. Are you logged in?";
  } else {
    tests = data;
    console.log(data);
    errorText = "";
  }
  return { sportsTests: tests, errorText: errorText };
};