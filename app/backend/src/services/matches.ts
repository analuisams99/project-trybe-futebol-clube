import { TeamEntity } from '../interfaces/Teams';
import { MatchEntity, MatchWithTeams } from '../interfaces/Matches';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class MatchesService {
  constructor(
    private _matchesModel = Matches,
    private _teamsModel = Teams,
  ) {}

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
