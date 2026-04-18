import { ref, computed } from "vue";
import { usePlayerStore } from "../../stores/playerStore";
import { useSportsTestStore } from "../../stores/sportsTestStore";
import { useTestTypeStore } from "../../stores/testTypeStore";
import type {
  CreatePlayer,
  CreateSportsTest,
  Player,
  SportsTest,
  TestCategory,
  TestType,
} from "../../types";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ParsedRow {
  line: number;
  firstName: string;
  lastName: string;
  birthYear: number | null;
  scores: (number | null)[];
  status: "existing" | "new" | "error" | "duplicate";
  errorMsg?: string;
  playerId?: number;
}

// ── Constants ───────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2000, i).toLocaleString("en", { month: "long" }),
  value: i + 1,
}));

// ── Helpers (pure) ──────────────────────────────────────────────────────────

function detectSeparator(text: string): "," | ";" {
  return (text.match(/;/g)?.length ?? 0) > (text.match(/,/g)?.length ?? 0)
    ? ";"
    : ",";
}

function parseNumber(s: string, europeanDecimal: boolean): number | null {
  const n = parseFloat(europeanDecimal ? s.replace(",", ".") : s.trim());
  return Number.isNaN(n) ? null : n;
}

function parseBirthYear(raw: string): number | null {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  const year = n >= 0 && n <= 99 ? 2000 + n : n;
  return year >= 1900 && year <= CURRENT_YEAR ? year : null;
}

// ── Composable ──────────────────────────────────────────────────────────────

export function useBatchIntake(teamId: () => number) {
  const { addSportsTests } = useSportsTestStore();
  const testTypeStore = useTestTypeStore();

  const playerStore = usePlayerStore()

  // State
  const testYear = ref(CURRENT_YEAR);
  const testMonth = ref(new Date().getMonth() + 1);
  const rawCsv = ref("");
  const importing = ref(false);
  const importDone = ref(false);
  const importResult = ref({ created: 0, existing: 0 });

  // Derived — test types filtered by the store's activeCategory
  const testTypes = computed(() => testTypeStore.filteredTestTypes);

  const hasContent = computed(() => rawCsv.value.trim().length > 0);

  // ###############################################################
  // PARSED ROW HELPER

  function parseRow(
    playerList: Player[],
    line: string,
    lineNum: number,
    types: TestType[],
    sep: "," | ";",
    europeanDecimal: boolean,
    seenNew: Set<string>,
  ): ParsedRow | null {
    const raw = line.trim();
    if (!raw) return null;

    const fields = raw.split(sep).map((s) => s.trim());
    const emptyScores = () => Array<null>(types.length).fill(null);

    
    if (fields.length < 2 || !fields[0] || !fields[1]) {
      return {
        line: lineNum,
        firstName: fields[0] ?? "",
        lastName: fields[1] ?? "",
        birthYear: null,
        scores: emptyScores(),
        status: "error",
        errorMsg: "Need at least first and last name",
      };
    }

    const [firstName, lastName, birthYearStr = ""] = fields;
    const scores = types.map((_, si) => {
      const val = fields[3 + si] ?? "";
      return val ? parseNumber(val, europeanDecimal) : null;
    });

    console.log("type check:", typeof playerList, typeof playerList[0]?.first_name);
    const existing = playerList.find(
      (p: Player) =>
        p.first_name.toLowerCase() === firstName!.toLowerCase() &&
        p.last_name.toLowerCase() === lastName!.toLowerCase(),
    );

    if (existing) {
      return {
        line: lineNum,
        firstName: firstName!,
        lastName: lastName!,
        birthYear: existing.birth_year,
        scores,
        status: "existing",
        playerId: existing.id,
      };
    }

    const birthYear = parseBirthYear(birthYearStr);
    if (birthYear === null) {
      return {
        line: lineNum,
        firstName: firstName!,
        lastName: lastName!,
        birthYear: null,
        scores,
        status: "error",
        errorMsg: `Invalid birth year "${birthYearStr}" (needed for new player)`,
      };
    }

    // Only first occurrence of a new name gets 'new' status
    const key = `${firstName!.toLowerCase()}|${lastName!.toLowerCase()}`;
    const isFirst = !seenNew.has(key);
    seenNew.add(key);

    return {
      line: lineNum,
      firstName: firstName!,
      lastName: lastName!,
      birthYear,
      scores,
      status: isFirst ? "new" : "duplicate",
    };
  }

  // #################################################################
  // #### PARSED ROWS
  const parsedRows = computed<ParsedRow[]>(() => {
    const text = rawCsv.value.trim();
    if (!text) return [];

    const sep = detectSeparator(text);
    const europeanDecimal = sep === ";";
    const types = testTypes.value;
    const seenNew = new Set<string>();

    const rows = text.split("\n").reduce<ParsedRow[]>((rows, line, i) => {
      const row = parseRow(playerStore.players, line, i + 1, types, sep, europeanDecimal, seenNew);
      if (row) rows.push(row);
      return rows;
    }, []);
    console.log("Parsed rows:", rows);

    return rows;
  });

  // COMPUTED BASED ON ParsedRows
  const validRows = computed(() =>
    parsedRows.value.filter((r) => r.status !== "error"),
  );
  const errorRows = computed(() =>
    parsedRows.value.filter((r) => r.status === "error"),
  );

  const canImport = computed(
    () => validRows.value.length > 0 && teamId() != null,
  );

  const totalTests = computed(() =>
    validRows.value.reduce((sum, row) => sum + row.scores.filter(s => s != null).length, 0),
  )

  // #############################################################
  // #### Actions

  // THE MAIN IMPORT FUNCTION
  async function doImport() {
    importing.value = true;
    try {
      let created = 0;
      let existing = 0;
      const batchCreated = new Map<string, Player>();
      const testDate = new Date(testYear.value, testMonth.value - 1, 1);
      const types = testTypes.value;

      // CREATE PLAYER OR RETRIEVE EXISTING PLAYER
      for (const row of validRows.value) {
        const result = await resolvePlayer(row, batchCreated);

        // CREATE TESTS BASED ON THE CSV ROW DATA
        if (result?.player) {
          await createTestsForPlayer(result.player.id, row, types, testDate);
          result.wasCreated ? created++ : existing++;
        }
      }

      importResult.value = { created, existing };
      importDone.value = true;
      rawCsv.value = "";
    } finally {
      importing.value = false;
    }
  }

  async function resolvePlayer(
    row: ParsedRow,
    batchCreated: Map<string, Player>,
  ): Promise<{ player: Player | null; wasCreated: boolean } | null> {
    let newPlayer = null as unknown as Player;

    if (row.status === "existing" && row.playerId)
      return { player: null, wasCreated: false };

    const key = `${row.firstName.toLowerCase()}|${row.lastName.toLowerCase()}`;
    const existing = batchCreated.get(key);
    if (existing !== undefined) return { player: existing, wasCreated: true };

    const player = {
      first_name: row.firstName,
      last_name: row.lastName,
      birth_year: row.birthYear,
      team_id: teamId(),
    } as CreatePlayer;

    const { player: createdPlayer, errorText: newError } =
      await playerStore.insertPlayer(player);
    console.log("Row player create:", createdPlayer);
    
    if (createdPlayer) {
      newPlayer = createdPlayer;
      batchCreated.set(key, createdPlayer);
      return { player: createdPlayer, wasCreated: true };
    } else {
      console.error("Failed to create player:", newError);
      return null;
    }
  }

  async function createTestsForPlayer(
    playerId: number,
    row: ParsedRow,
    types: TestType[],
    testDate: Date,
  ) {
    const newTests = [];

    for (const [i, type] of types.entries()) {
      const score = row.scores[i];
      if (score != null) {
        newTests.push({
          seconds: score,
          taken_at: testDate,
          type_id: type.id,
          player_id: playerId,
        } as CreateSportsTest);
      }
    }

    if (newTests.length) await addSportsTests(newTests);
  }

  function reset() {
    importDone.value = false;
    rawCsv.value = "";
  }

  return {
    // State
    testYear,
    testMonth,
    rawCsv,
    importing,
    importDone,
    importResult,
    // Store refs (for template binding)
    activeCategory: computed({
      get: () => testTypeStore.activeCategory,
      set: (v: TestCategory) => {
        testTypeStore.activeCategory = v;
      },
    }),
    categoryOptions: computed(() => testTypeStore.categoryOptions),
    // Derived
    testTypes,
    hasContent,
    parsedRows,
    validRows,
    errorRows,
    canImport,
    totalTests,
    // Constants
    MONTH_OPTIONS,
    CURRENT_YEAR,
    // Actions
    doImport,
    reset,
  };
}
