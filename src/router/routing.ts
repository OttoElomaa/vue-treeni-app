import router from './index';

export const goToTeamView = (teamId: number) => {
  if (teamId) {
    router.push(`/intake/team/${teamId}`);
  }
};


export const goToAddTest = (teamId: string, playerId: string) => {
  if (teamId && playerId) {
    router.push(`/intake/team/${teamId}/player/${playerId}/add`);
  }
};