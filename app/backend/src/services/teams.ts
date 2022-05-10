import Teams from '../database/models/Teams';
import { TeamEntity } from '../interfaces/Teams';

export default class TeamsService {
  constructor(private _teamsModel = Teams) {}

  public async getById(id: number): Promise<TeamEntity | null> {
    const team = await this._teamsModel.findByPk(id) as TeamEntity;
    return team;
  }

  public async getAll(): Promise<TeamEntity[] | null> {
    const teams = await this._teamsModel.findAll() as TeamEntity[];
    return teams;
  }
}
