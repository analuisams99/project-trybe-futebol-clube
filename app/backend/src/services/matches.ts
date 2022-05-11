import { TeamEntity } from '../interfaces/Teams';
import { IMatch, MatchEntity, MatchWithTeams } from '../interfaces/Matches';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class MatchesService {
  constructor(
    private _matchesModel = Matches,
    private _teamsModel = Teams,
  ) {}

  public async create(match: IMatch): Promise<MatchEntity | boolean> {
    const { homeTeam, awayTeam } = match;

    const isHomeTeamValid = await this._matchesModel.findByPk(homeTeam);
    const isAwayTeamValid = await this._matchesModel.findByPk(awayTeam);

    if (!isHomeTeamValid || !isAwayTeamValid) return false;

    const result = await this._matchesModel.create(match) as MatchEntity;
    return result;
  }

  public async inProgressUpdate(id: number): Promise<void> {
    await this._matchesModel.update({ inProgress: false }, { where: { id } });
  }

  public async getAll(inProgress: string | undefined): Promise<MatchWithTeams[]> {
    const matches = await this._matchesModel.findAll({ raw: true }) as MatchEntity[];

    const matchesAndAllTeams = await Promise.all(matches.map(async (match) => {
      const homeTeamData = await this._teamsModel.findByPk(match.homeTeam) as TeamEntity;
      const awayTeamData = await this._teamsModel.findByPk(match.awayTeam) as TeamEntity;

      const result = {
        ...match,
        teamHome: { teamName: homeTeamData.teamName },
        teamAway: { teamName: awayTeamData.teamName },
      };

      return result;
    }));

    if (inProgress === 'true' || inProgress === 'false') {
      const filteredResult = matchesAndAllTeams.filter((match) =>
        String(Boolean(match.inProgress)) === inProgress);
      return filteredResult as MatchWithTeams[];
    }

    return matchesAndAllTeams as MatchWithTeams[];
  }
}
