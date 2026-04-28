import { computed } from 'vue'
import type { SportsTest } from '../../types'

// ── Types ───────────────────────────────────────────────────────────────────

export type ScoreField = 'seconds' | 'points'

export interface TestStats {
  best: number
  bestTest: SportsTest
  worst: number
  worstTest: SportsTest
  avg: number
  count: number
  field: ScoreField
}

// ── Helpers (pure) ──────────────────────────────────────────────────────────

function getScore(test: SportsTest): { value: number; field: ScoreField } | null {
  if (test.seconds != null) return { value: test.seconds, field: 'seconds' }
  if (test.points != null) return { value: test.points, field: 'points' }
  return null
}

function isBetter(a: number, b: number, field: ScoreField): boolean {
  return field === 'seconds' ? a < b : a > b
}

function isWorse(a: number, b: number, field: ScoreField): boolean {
  return field === 'seconds' ? a > b : a < b
}

function accumulate(
  map: Map<number, TestStats>,
  key: number,
  value: number,
  field: ScoreField,
  test: SportsTest,
) {
  const existing = map.get(key)
  if (existing) {
    if (isBetter(value, existing.best, field)) {
      existing.best = value
      existing.bestTest = test
    }
    if (isWorse(value, existing.worst, field)) {
      existing.worst = value
      existing.worstTest = test
    }
    existing.avg = (existing.avg * existing.count + value) / (existing.count + 1)
    existing.count++
  } else {
    map.set(key, {
      best: value, worst: value, avg: value, count: 1, field,
      bestTest: test, worstTest: test,
    })
  }
}



// ── Composable ──────────────────────────────────────────────────────────────

export function useTestStats(tests: () => SportsTest[]) {

  const statsByPlayer = computed(() => {
    const map = new Map<number, Map<number, TestStats>>()

    for (const test of tests()) {
      const score = getScore(test)
      if (!score) continue

      if (!map.has(test.player_id)) map.set(test.player_id, new Map())
      accumulate(map.get(test.player_id)!, test.type_id, score.value, score.field, test)
    }

    return map
  })

  const statsByType = computed(() => {
    const map = new Map<number, TestStats>()

    for (const test of tests()) {
      const score = getScore(test)
      if (!score) continue

      accumulate(map, test.type_id, score.value, score.field, test)
    }

    return map
  })

  // ── Getters ─────────────────────────────────────────────────────────────

  function getPlayerStats(playerId: number, typeId: number): TestStats | null {
    return statsByPlayer.value.get(playerId)?.get(typeId) ?? null
  }

  function getAllPlayerStats(playerId: number): Map<number, TestStats> {
    return statsByPlayer.value.get(playerId) ?? new Map()
  }

  function getTeamStats(typeId: number): TestStats | null {
    return statsByType.value.get(typeId) ?? null
  }

  return { statsByPlayer, statsByType, getPlayerStats, getAllPlayerStats, getTeamStats }
}