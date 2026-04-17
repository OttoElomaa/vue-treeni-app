import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore'
import { useSportsTestStore } from '../../stores/sportsTestStore'
import { useTestTypeStore } from '../../stores/testTypeStore'
import type { Player, SportsTest, TestCategory } from '../../types'


// ── Types ───────────────────────────────────────────────────────────────────

export interface ParsedRow {
  line: number
  firstName: string
  lastName: string
  birthYear: number | null
  scores: (number | null)[]
  status: 'existing' | 'new' | 'error'
  errorMsg?: string
  playerId?: number
}

// ── Constants ───────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2000, i).toLocaleString('en', { month: 'long' }),
  value: i + 1,
}))

// ── Helpers (pure) ──────────────────────────────────────────────────────────

function detectSeparator(text: string): ',' | ';' {
  return (text.match(/;/g)?.length ?? 0) > (text.match(/,/g)?.length ?? 0)
    ? ';'
    : ','
}

function parseNumber(s: string, europeanDecimal: boolean): number | null {
  const n = parseFloat(europeanDecimal ? s.replace(',', '.') : s.trim())
  return Number.isNaN(n) ? null : n
}

function parseBirthYear(raw: string): number | null {
  const n = parseInt(raw, 10)
  if (Number.isNaN(n)) return null
  const year = n >= 0 && n <= 99 ? 2000 + n : n
  return year >= 1900 && year <= CURRENT_YEAR ? year : null
}

// ── Composable ──────────────────────────────────────────────────────────────

export function useBatchIntake(teamId: () => number) {
  const { players, insertPlayer } = usePlayerStore()
  const { addSportsTest } = useSportsTestStore()
  const testTypeStore = useTestTypeStore()

  // State
  const testYear = ref(CURRENT_YEAR)
  const testMonth = ref(new Date().getMonth() + 1)
  const rawCsv = ref('')
  const importing = ref(false)
  const importDone = ref(false)
  const importResult = ref({ created: 0, existing: 0 })

  // Derived — test types filtered by the store's activeCategory
  const testTypes = computed(() => testTypeStore.filteredTestTypes)

  const parsedRows = computed<ParsedRow[]>(() => {
    const text = rawCsv.value.trim()
    if (!text) return []

    const sep = detectSeparator(text)
    const europeanDecimal = sep === ';'
    const types = testTypes.value

    return text.split('\n').reduce<ParsedRow[]>((rows, line, i) => {
      const raw = line.trim()
      if (!raw) return rows

      const fields = raw.split(sep).map(s => s.trim())
      const lineNum = i + 1
      const emptyScores = () => Array<null>(types.length).fill(null)

      if (fields.length < 2 || !fields[0] || !fields[1]) {
        rows.push({
          line: lineNum, firstName: fields[0] ?? '', lastName: fields[1] ?? '',
          birthYear: null, scores: emptyScores(),
          status: 'error', errorMsg: 'Need at least first and last name',
        })
        return rows
      }

      const [firstName, lastName, birthYearStr = ''] = fields
      const scores = types.map((_, si) => {
        const val = fields[3 + si] ?? ''
        return val ? parseNumber(val, europeanDecimal) : null
      })

      // Check existing player
      const existing = players.find(
        (p: Player) =>
          p.first_name.toLowerCase() === firstName!.toLowerCase()
          && p.last_name.toLowerCase() === lastName!.toLowerCase(),
      )

      if (existing) {
        rows.push({
          line: lineNum, firstName: firstName!, lastName: lastName!,
          birthYear: existing.birth_year, scores,
          status: 'existing', playerId: existing.id,
        })
        return rows
      }

      // New player — need valid birth year
      const birthYear = parseBirthYear(birthYearStr)
      if (birthYear === null) {
        rows.push({
          line: lineNum, firstName: firstName!, lastName: lastName!,
          birthYear: null, scores,
          status: 'error', errorMsg: `Invalid birth year "${birthYearStr}" (needed for new player)`,
        })
        return rows
      }

      rows.push({
        line: lineNum, firstName: firstName!, lastName: lastName!,
        birthYear, scores, status: 'new',
      })
      return rows
    }, [])
  })

  const validRows = computed(() => parsedRows.value.filter(r => r.status !== 'error'))
  const errorRows = computed(() => parsedRows.value.filter(r => r.status === 'error'))
  const hasContent = computed(() => rawCsv.value.trim().length > 0)
  const canImport = computed(() => validRows.value.length > 0 && teamId() != null)

  // Actions
  async function doImport() {
    importing.value = true
    let createdPlayer = null as unknown as Player

    try {
      let created = 0
      let existing = 0
      const batchCreated = new Map<string, number>()
      const testDate = new Date(testYear.value, testMonth.value - 1, 1)
      const types = testTypes.value

      for (const row of validRows.value) {
        let playerId: number

        if (row.status === 'existing') {
          playerId = row.playerId!
          existing++
        } else {
          const key = `${row.firstName.toLowerCase()}|${row.lastName.toLowerCase()}`
          const alreadyCreated = batchCreated.get(key)
          if (alreadyCreated !== undefined) {
            playerId = alreadyCreated
          } else {
            const player = {first_name: row.firstName, last_name: row.lastName, birth_year: row.birthYear, team_id: teamId()} as Player
            createdPlayer = await (await insertPlayer(player)).player
            batchCreated.set(key, createdPlayer.id)
            created++
          }
        }

        for (let i = 0; i < types.length; i++) {
          const score = row.scores[i]
          if (score != null) {
            const newTest = {seconds: score, player_id: createdPlayer.id, taken_at: testDate} as SportsTest
            await addSportsTest(newTest)
          }
        }
      }

      importResult.value = { created, existing }
      importDone.value = true
      rawCsv.value = ''
    } finally {
      importing.value = false
    }
  }

  function reset() {
    importDone.value = false
    rawCsv.value = ''
  }

  return {
    // State
    testYear, testMonth, rawCsv, importing, importDone, importResult,
    // Store refs (for template binding)
    activeCategory: computed({
      get: () => testTypeStore.activeCategory,
      set: (v: TestCategory) => { testTypeStore.activeCategory = v },
    }),
    categoryOptions: computed(() => testTypeStore.categoryOptions),
    // Derived
    testTypes, hasContent, parsedRows, validRows, errorRows, canImport,
    // Constants
    MONTH_OPTIONS, CURRENT_YEAR,
    // Actions
    doImport, reset,
  }
}