import ILeaderboard from '../interfaces/Leaderboard';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class LeaderboardService {
  constructor(
    private _teamsModel = Teams,
    private _matchesModel = Matches,
    // Dicionário de learderboard
    private _leaderboardObj: { [id:number] : ILeaderboard } = {},
  ) {}

  private async createInitialLeaderboard(): Promise<ILeaderboard[]> {
    const allTeams = await this._teamsModel.findAll();
    const variavel = await Promise.all(allTeams.map(async ({ id, teamName }) => {
      // coloca id do time para achar os times no dicionário, coloca nome do time e inicia os todos pontos em zero;
      this._leaderboardObj[id] = {
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
      return this._leaderboardObj[id];
    }));
    return variavel;
  }

  private calcTotalGoalsAndGamesInGeneral(HT: number, HTGOALS: number, AT: number, ATGOALS: number)
    : void {
    // total de jogos (incrementa 1 a cada partida)
    this._leaderboardObj[HT].totalGames += 1;
    this._leaderboardObj[AT].totalGames += 1;

    // total de gols a favor (que o time fez)
    this._leaderboardObj[HT].goalsFavor += HTGOALS;
    this._leaderboardObj[AT].goalsFavor += ATGOALS;

    // total de gols contra (que o time adversário fez)
    this._leaderboardObj[HT].goalsOwn += ATGOALS;
    this._leaderboardObj[AT].goalsOwn += HTGOALS;

    // Saldo total dos gols (pontos totais de gols a favor "menos" pontos totais de gols contra)
    this._leaderboardObj[HT].goalsBalance = this
      ._leaderboardObj[HT].goalsFavor - this._leaderboardObj[HT].goalsOwn;

    this._leaderboardObj[AT].goalsBalance = this
      ._leaderboardObj[AT].goalsFavor - this._leaderboardObj[AT].goalsOwn;
  }

  private calcTotalPoints(HT: number, HTGOALS: number, AT: number, ATGOALS: number): void {
    // Se os GOLS do time da casa forem maiores que os do time de fora
    if (HTGOALS > ATGOALS) {
      // Acrescenta 3 pontos nas vitórias e nos pontos totais;
      this._leaderboardObj[HT].totalPoints += 3;
      this._leaderboardObj[HT].totalVictories += 1;
      // Acrescenta 1 ponto na derrota do time de fora
      this._leaderboardObj[AT].totalLosses += 1;

      // O mesmo acontece se o time adversário ganhar
    } else if (ATGOALS > HTGOALS) {
      this._leaderboardObj[AT].totalPoints += 3;
      this._leaderboardObj[AT].totalVictories += 1;
      this._leaderboardObj[HT].totalLosses += 1;
    } else {
      // Se não for nenhum acima é empate (acrescenta 1 ponto nos dois times)
      this._leaderboardObj[HT].totalDraws += 1;
      this._leaderboardObj[AT].totalDraws += 1;
      this._leaderboardObj[HT].totalPoints += 1;
      this._leaderboardObj[AT].totalPoints += 1;
    }
  }

  private calculateTeamEfficiency(HT: number, AT: number): void {
    // Calcula a eficiência do time = totalPoints / (totalGames * 3) * 100
    this._leaderboardObj[HT].efficiency = (
      parseFloat(
        ((this._leaderboardObj[HT]
          .totalPoints / (this._leaderboardObj[HT].totalGames * 3)) * 100).toFixed(2),
      ));

    this._leaderboardObj[AT].efficiency = (
      parseFloat(
        ((this._leaderboardObj[AT]
          .totalPoints / (this._leaderboardObj[AT].totalGames * 3)) * 100).toFixed(2),
      ));
  }

  private sortLeaderboard(): ILeaderboard[] {
    const leaderboardArray = Object.values(this._leaderboardObj);

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

  public async getLeaderboard(): Promise<ILeaderboard[]> {
    await this.createInitialLeaderboard();
    const matches = await this._matchesModel.findAll();

    await Promise.all(matches
      .map(async ({ homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress }) => {
        if (inProgress === false) {
          this.calcTotalGoalsAndGamesInGeneral(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);
          this.calcTotalPoints(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);
          this.calculateTeamEfficiency(homeTeam, awayTeam);
        }
      }));
    const sortLeaderboardsResult = this.sortLeaderboard();
    // quando uma nova partida for criada ele irá mapear novamente os resultados
    const result = sortLeaderboardsResult.map((eachLeaderboard) => ({ ...eachLeaderboard }));
    // zera o _leaderboardObj quando a função de mapeamento acaba;
    this._leaderboardObj = [];
    return result;
  }
}
