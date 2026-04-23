import type { Player } from '../types';
import router from './index';



// ##################################################
// #### TEAM VIEWS
export const goToTeamView = (teamId: number) => {
  if (teamId) {
    router.push(`/intake/team/${teamId}`);
  }
};

export const goToBatchIntake = (teamId: string) => {
  if (teamId) {
    router.push(`/intake/team/${teamId}/batch`);
  }
};

export const goToAddPlayer = (team_id:string) => {
    router.push(`/intake/team/${team_id}/add`)
}


// ###############################################################
// #### PLAYER VIEWS
export const goToEditPlayer = (player: Player) => {
    router.push(`/intake/team/${player.team_id}/player/${player.id}/edit`)
}

export const goToPlayer = (player_id: number, team_id:number) => {
    router.push(`/intake/team/${team_id}/player/${player_id}`)
}
export const goToPlayerAnalyze = (player_id: number, team_id:number) => {
    router.push(`/analyze/team/${team_id}/player/${player_id}`)
}


export const goToAddTest = (teamId: string, playerId: string) => {
  if (teamId && playerId) {
    router.push(`/intake/team/${teamId}/player/${playerId}/add`);
  }
};