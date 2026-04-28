import { useTestStats, type TestStats } from './useTestStats'
import type { SportsTest, Player } from '../../types'

export interface TeamStatsEntry {
  player: Player
  stats: TestStats
}

export function useTeamStats(
  tests: () => SportsTest[],
  players: () => Player[],
) {
  const { statsByPlayer, getTeamStats } = useTestStats(tests)

  function topPlayers(typeId: number, limit = 10): TeamStatsEntry[] {
    const playerMap = new Map(players().map(p => [p.id, p]))
    const entries: TeamStatsEntry[] = []

    for (const [playerId, typeMap] of statsByPlayer.value) {
      const stats = typeMap.get(typeId)
      if (!stats) continue
      const player = playerMap.get(playerId)
      if (!player) continue
      entries.push({ player, stats })
    }

    const field = entries[0]?.stats.field ?? 'seconds'
    entries.sort((a, b) =>
      field === 'seconds' ? a.stats.best - b.stats.best : b.stats.best - a.stats.best,
    )

    return entries.slice(0, limit)
  }

  function bestPlayer(typeId: number): TeamStatsEntry | null {
    return topPlayers(typeId, 1)[0] ?? null
  }

  function worstPlayer(typeId: number): TeamStatsEntry | null {
    const all = topPlayers(typeId, Infinity)
    return all[all.length - 1] ?? null
  }

  return { topPlayers, bestPlayer, worstPlayer, getTeamStats }
}