export interface IMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface MatchEntity extends IMatch {
  id: number;
}

export interface MatchWithTeams extends MatchEntity {
  teamHome: {
    teamName: string
  },
  teamAway: {
    teamName: string
  }
}

export interface MatchGoalsEntry {
  homeTeamGoals: number;
  awayTeamGoals: number;
}
