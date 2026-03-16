import { supabase } from "../lib/supabase-client";
import type { Team } from "../types";

export const fetchTeams = async () => {
  let teams = [] as Team[];
  let errorText = "Loading...";

  const { error, data } = await supabase
    .from("teams")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error in supabase select: ", error.message);
    errorText = "Error in supabase select";
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
  return { teams: teams, errorText: errorText };
};
