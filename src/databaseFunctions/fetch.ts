import { supabase } from "../lib/supabase-client";
import type { Player, SportsTest, Team } from "../types";



// ####################################################################
// TEAMS
export const fetchTeams = async () => {
  let teams = [] as Team[];
  let errorText = "Loading...";

  const { error, data } = await supabase
    .from("teams")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error in supabase team select: ", error.message);
    errorText = "Error in supabase team select";
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


export const fetchTeamById = async (id:number) => {
  let teams = [] as Team[];
  let errorText = "Loading...";

  const { error, data } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error in supabase team select by team ID: ", error.message);
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




// ####################################################################
// PLAYERS
export const fetchPlayersByTeamId = async (id:number) => {
  let players = [] as Player[];
  let errorText = "Loading...";

  const { error, data } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", id)
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
    players = data;
    console.log(data);
    errorText = "";
  }
  return { players: players, errorText: errorText };
};


export const fetchPlayerById = async (id:number) => {
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