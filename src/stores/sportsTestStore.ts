import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { SportsTest } from "../types";
import { supabase } from "../lib/supabase-client";
import { insertOne } from "./genericDatabaseFunctions";

export const useSportsTestStore = defineStore("sportsTests", () => {
  const sportsTests = ref([] as SportsTest[]);
  let sportsTestChannel: RealtimeChannel | null = null;

  const error = ref(null as unknown as Error);

  const loadedPlayerIds = ref(new Set()); // Track which teams we've already fetched

  type myEventType = "INSERT" | "UPDATE" | "DELETE";

  // 1. Start the global listener
  function initRealtime() {
    if (sportsTestChannel) return;

    sportsTestChannel = supabase.channel("all-player-changes"); // name of your choice, just an identifier, can be anything

    sportsTestChannel

      .on(
        "postgres_changes",
        {
          event: "*", // or 'INSERT' | 'UPDATE' | 'DELETE'
          schema: "public",
          table: "tests",
        },
        (payload) => {
          console.log("Player Store Realtime:");
          console.log(payload);

          const { eventType, new: newItem, old: oldItem } = payload;

          const newTest = newItem as SportsTest;
          const oldTest = oldItem as SportsTest;

          // Only update our pool if we have already fetched this player's team
          if (newTest && loadedPlayerIds.value.has(newTest.player_id)) {
            //if (newTest) {
            handleSync(eventType, newTest, oldTest);
          } else if (eventType === "DELETE") {
            // Always try to delete by ID, just in case
            sportsTests.value = sportsTests.value.filter(
              (p) => p.id !== oldItem.id,
            );
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

  function handleSync(
    type: myEventType,
    newItem: SportsTest,
    oldItem: SportsTest,
  ) {
    switch (type) {
      case "INSERT":
        sportsTests.value.push(newItem);
        console.log("PlayerStore insert completed");
        break;

      // UPDATE PLAYERS TABLE BY ADDING THE NEW PLAYER
      case "UPDATE":
        sportsTests.value = sportsTests.value.map((p) =>
          p.id === newItem.id ? newItem : p,
        );
        console.log("PlayerStore update completed");
        break;
    }
  }

  const fetchTestsByPlayerId = async (id: number) => {
    let fetchedTests = [] as SportsTest[];
    let errorText = "Loading...";

    const { error, data } = await supabase
      .from("tests")
      .select("*")
      .eq("player_id", id)
      .order("id", { ascending: true });

    if (error) {
      console.error(
        "Error in supabase player select by team ID: ",
        error.message,
      );
      errorText = "Error in supabase player select by team ID";
    } else if (data.length == 0) {
      console.error(
        "Error in supabase select: No data was returned. Are you logged in?",
      );
      errorText = "No data was returned. Are you logged in?";
    } else {
      loadedPlayerIds.value.add(id);
      fetchedTests = data as SportsTest[];
      const existingIds = new Set(fetchedTests.map((p) => p.id));
      const kept = fetchedTests.filter((p) => !existingIds.has(p.id));
      const merged = [...fetchedTests, ...kept];
      sportsTests.value = merged;

      console.log(data);
      errorText = "";
    }
    return { sportsTests: fetchedTests, errorText: errorText };
  };

  function getTestsByPlayer(playerId: number) {
    return computed(() => {
      return sportsTests.value.filter((t) => t.player_id === playerId);
    });
  }

  async function addSportsTest(test: Partial<SportsTest>) {
    const result = await insertOne<SportsTest>("tests", test);
    if (result.error) {
      error.value = result.error;
      return;
    }
    sportsTests.value.push(result.data);
  }


function clearStore() {
		sportsTests.value = [];
	}

  return { sportsTests, initRealtime, fetchTestsByPlayerId, getTestsByPlayer, addSportsTest, clearStore };
});
