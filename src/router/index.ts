import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import type { Component } from "vue";
import OrgAnalyze from "../components/analyze/OrgAnalyze.vue";
import TeamAnalyze from "../components/analyze/TeamAnalyze.vue";
import PlayerAnalyze from "../components/analyze/PlayerAnalyze.vue";
import OrgIntake from "../components/intake/OrgIntake.vue";
import TeamIntake from "../components/intake/TeamIntake.vue";
import PlayerIntake from "../components/intake/PlayerIntake.vue";
import type { Mode } from "../types";
import AddPlayer from "../components/intake/AddPlayer.vue";
import EditPlayer from "../components/intake/EditPlayer.vue";
import AddTest from "../components/intake/AddTest.vue";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase-client";
import BatchIntake from "../components/intake/BatchIntake.vue";

// ─── Types ───────────────────────────────────────────────────────

const VALID_MODES: Mode[] = ["intake", "analyze"];
const DEFAULT_PATH = "/analyze";

function isValidMode(value: string): boolean {
  return VALID_MODES.includes(value as Mode);
}

// ─── Routes ──────────────────────────────────────────────────────

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: DEFAULT_PATH },

  // ── Analyze ─────────────────────────────────────────────────
  {
    path: "/analyze",
    name: "org-analyze",
    component: OrgAnalyze,
  },
  {
    path: "/analyze/team/:teamId",
    name: "team-analyze",
    component: TeamAnalyze,
    props: true,
  },
  {
    path: "/analyze/team/:teamId/player/:playerId",
    name: "player-analyze",
    component: PlayerAnalyze,
    props: true,
  },

  // ── Intake ───────────────────────────────────────────────────
  {
    path: "/intake",
    name: "org-intake",
    component: OrgIntake,
  },
  {
    path: "/intake/team/:teamId",
    name: "team-intake",
    component: TeamIntake,
    props: true,
  },
  {
    path: "/intake/team/:teamId/add",
    name: "team-intake-add-player",
    component: AddPlayer,
    props: true,
  },
  {
    path: "/intake/team/:teamId/batch",
    name: "team-batch-intake",
    component: BatchIntake,
    props: true,
  },
  {
    path: "/intake/team/:teamId/player/:playerId",
    name: "player-intake",
    component: PlayerIntake,
    props: true,
  },
  {
    path: "/intake/team/:teamId/player/:playerId/edit",
    name: "player-edit",
    component: EditPlayer,
    props: true,
  },
  {
    path: "/intake/team/:teamId/player/:playerId/add",
    name: "add-sports-test",
    component: AddTest,
    props: true,
  },

  // ── Fallbacks ────────────────────────────────────────────────
  // Valid mode but unrecognized path → back to that mode's org page
  {
    path: "/:mode/:pathMatch(.*)*",
    redirect: (to) => {
      const mode = to.params.mode as string;
      return isValidMode(mode) ? `/${mode}` : DEFAULT_PATH;
    },
  },
  // Everything else → default
  {
    path: "/:pathMatch(.*)*",
    redirect: DEFAULT_PATH,
  },
];

// ─── Router ──────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let sessionReady = false;
let currentSession: Session | null = null;

supabase.auth.onAuthStateChange((event, session) => {
  currentSession = session;
  sessionReady = true;
  console.log("🔄 Auth state changed:", event, !!session);
});

router.beforeEach(async (to) => {
  // Just a Printout
  console.log("Navigating to:", {
    path: to.path,
    name: to.name,
    params: to.params,
    matched: to.matched.map((m) => m.path),
  });

  // First navigation only: session isn't known yet, so ask Supabase directly
  if (!sessionReady) {
    const { data } = await supabase.auth.getSession();
    currentSession = data.session;
    sessionReady = true;
  }
  console.log("Session:", currentSession);
  console.log("Requires auth:", to.meta.requiresAuth);

  return;
  // Now we know for sure — redirect or allow
  //if (to.meta.requiresAuth && !currentSession) {
  //return { name: 'login' }
  //}
});

// Normalize uppercase anywhere in the URL
router.beforeEach((to, _from) => {
  const lowercased = to.path.toLowerCase();
  if (lowercased !== to.path) {
    return lowercased;
  }
  return;
});

export default router;
