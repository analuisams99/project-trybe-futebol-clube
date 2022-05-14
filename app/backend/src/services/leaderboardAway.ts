import ILeaderboard from '../interfaces/Leaderboard';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class LeaderboardAwayService {
  constructor(
    private _teamsModel = Teams,
    private _matchesModel = Matches,
    private _leaderboardAwayObj: { [id:number] : ILeaderboard } = {},
  ) {}

  private async createInitialLeaderboard(): Promise<ILeaderboard[]> {
    const allTeams = await this._teamsModel.findAll();
    const allTeamsMap = await Promise.all(allTeams.map(async ({ id, teamName }) => {
      this._leaderboardAwayObj[id] = {
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
      return this._leaderboardAwayObj[id];
    }));
    return allTeamsMap;
  }

  private calcTotalGoalsAndGamesAway(AT: number, HTGOALS: number, ATGOALS: number)
    : void {
    this._leaderboardAwayObj[AT].totalGames += 1;
    this._leaderboardAwayObj[AT].goalsFavor += ATGOALS;
    this._leaderboardAwayObj[AT].goalsOwn += HTGOALS;
    this._leaderboardAwayObj[AT].goalsBalance = this
      ._leaderboardAwayObj[AT].goalsFavor - this._leaderboardAwayObj[AT].goalsOwn;
  }

  private calcTotalPoints(HTGOALS: number, AT: number, ATGOALS: number): void {
    if (HTGOALS > ATGOALS) {
      this._leaderboardAwayObj[AT].totalLosses += 1;
    } else if (ATGOALS > HTGOALS) {
      this._leaderboardAwayObj[AT].totalPoints += 3;
      this._leaderboardAwayObj[AT].totalVictories += 1;
    } else {
      this._leaderboardAwayObj[AT].totalDraws += 1;
      this._leaderboardAwayObj[AT].totalPoints += 1;
    }
  }

  private calculateTeamEfficiency(AT: number): void {
    this._leaderboardAwayObj[AT].efficiency = (
      parseFloat(
        ((this._leaderboardAwayObj[AT]
          .totalPoints / (this._leaderboardAwayObj[AT].totalGames * 3)) * 100).toFixed(2),
      ));
  }

  private sortLeaderboard(): ILeaderboard[] {
    const leaderboardArray = Object.values(this._leaderboardAwayObj);

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

  public async getLeaderboardAway(): Promise<ILeaderboard[]> {
    await this.createInitialLeaderboard();
    const matches = await this._matchesModel.findAll();

    await Promise.all(matches
      .map(async ({ homeTeamGoals, awayTeam, awayTeamGoals, inProgress }) => {
        if (inProgress === false) {
          this.calcTotalGoalsAndGamesAway(homeTeamGoals, awayTeam, awayTeamGoals);
          this.calcTotalPoints(homeTeamGoals, awayTeam, awayTeamGoals);
          this.calculateTeamEfficiency(awayTeam);
        }
      }));
    const sortLeaderboardsResult = this.sortLeaderboard();
    const result = sortLeaderboardsResult.map((eachLeaderboard) => ({ ...eachLeaderboard }));
    this._leaderboardAwayObj = [];
    return result;
  }
}
