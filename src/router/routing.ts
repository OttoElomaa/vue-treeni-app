import router from './index';

export const goToTeamView = (teamId: number) => {
  if (teamId) {
    router.push(`/intake/team/${teamId}`);
  }
};
