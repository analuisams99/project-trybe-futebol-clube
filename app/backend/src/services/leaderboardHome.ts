import ILeaderboard from '../interfaces/Leaderboard';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class LeaderboardHomeService {
  constructor(
    private _teamsModel = Teams,
    private _matchesModel = Matches,
    private _leaderboardHomeObj: { [id:number] : ILeaderboard } = {},
  ) {}

  private async createInitialLeaderboard(): Promise<ILeaderboard[]> {
    const allTeams = await this._teamsModel.findAll();
    const allTeamsMap = await Promise.all(allTeams.map(async ({ id, teamName }) => {
      this._leaderboardHomeObj[id] = {
        name: teamName,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
        goalsBalance: 0,
        efficiency: 0.00,
      };
      return this._leaderboardHomeObj[id];
    }));
    return allTeamsMap;
  }

  private calcTotalGoalsAndGamesHOME(HT: number, HTGOALS: number, ATGOALS: number)
    : void {
    this._leaderboardHomeObj[HT].totalGames += 1;
    this._leaderboardHomeObj[HT].goalsFavor += HTGOALS;
    this._leaderboardHomeObj[HT].goalsOwn += ATGOALS;
    this._leaderboardHomeObj[HT].goalsBalance = this
      ._leaderboardHomeObj[HT].goalsFavor - this._leaderboardHomeObj[HT].goalsOwn;
  }

  private calcTotalPoints(HT: number, HTGOALS: number, ATGOALS: number): void {
    if (HTGOALS > ATGOALS) {
      this._leaderboardHomeObj[HT].totalPoints += 3;
      this._leaderboardHomeObj[HT].totalVictories += 1;
    } else if (ATGOALS > HTGOALS) {
      this._leaderboardHomeObj[HT].totalLosses += 1;
    } else {
      this._leaderboardHomeObj[HT].totalDraws += 1;
      this._leaderboardHomeObj[HT].totalPoints += 1;
    }
  }

  private calculateTeamEfficiency(HT: number): void {
    this._leaderboardHomeObj[HT].efficiency = (
      parseFloat(
        ((this._leaderboardHomeObj[HT]
          .totalPoints / (this._leaderboardHomeObj[HT].totalGames * 3)) * 100).toFixed(2),
      ));
  }

  private sortLeaderboard(): ILeaderboard[] {
    const leaderboardArray = Object.values(this._leaderboardHomeObj);

    const result = leaderboardArray.sort((t1, t2) => {
      if (t1.totalPoints === t2.totalPoints && t1.totalVictories === t2.totalVictories) {
        if (t1.goalsBalance === t2.goalsBalance && t1.goalsFavor === t2.goalsFavor) {
          return t2.goalsOwn - t1.goalsOwn;
        }
        if (t1.goalsBalance === t2.goalsBalance) return t2.goalsFavor - t1.goalsFavor;
        return t2.goalsBalance - t1.goalsBalance;
      }
      if (t1.totalPoints === t2.totalPoints) return t2.totalVictories - t1.totalVictories;
      return t2.totalPoints - t1.totalPoints;
    });
    return result;
  }

  public async getLeaderboardHome(): Promise<ILeaderboard[]> {
    await this.createInitialLeaderboard();
    const matches = await this._matchesModel.findAll();

    await Promise.all(matches
      .map(async ({ homeTeam, homeTeamGoals, awayTeamGoals, inProgress }) => {
        if (inProgress === false) {
          this.calcTotalGoalsAndGamesHOME(homeTeam, homeTeamGoals, awayTeamGoals);
          this.calcTotalPoints(homeTeam, homeTeamGoals, awayTeamGoals);
          this.calculateTeamEfficiency(homeTeam);
        }
      }));
    const sortLeaderboardsResult = this.sortLeaderboard();
    const result = sortLeaderboardsResult.map((eachLeaderboard) => ({ ...eachLeaderboard }));
    this._leaderboardHomeObj = [];
    return result;
  }
}
