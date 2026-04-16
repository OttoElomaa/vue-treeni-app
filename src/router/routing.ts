import type { Player } from '../types';
import router from './index';

export const goToTeamView = (teamId: number) => {
  if (teamId) {
    router.push(`/intake/team/${teamId}`);
  }
};


export const goToAddPlayer = (team_id:string) => {
    router.push(`/intake/team/${team_id}/add`)
}

export const goToEditPlayer = (player: Player) => {
    router.push(`/intake/team/${player.team_id}/player/${player.id}/edit`)
}

export const goToPlayer = (player_id: number, team_id:number) => {
    router.push(`/intake/team/${team_id}/player/${player_id}`)
}



export const goToAddTest = (teamId: string, playerId: string) => {
  if (teamId && playerId) {
    router.push(`/intake/team/${teamId}/player/${playerId}/add`);
  }
};