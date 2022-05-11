import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams';
import statusCode from '../utils/statusCode';

const { OK } = statusCode.StatusCodes;
const { invalidId, teamsNotFound } = statusCode.errors;

export default class TeamsController {
  constructor(
    private _teamsService = new TeamsService(),
  ) { }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const team = await this._teamsService.getById(+id);

      if (!team) {
        res.status(invalidId.status).json(invalidId.message);
      }
      res.status(OK).json(team);
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const teams = await this._teamsService.getAll();
      if (!teams) {
        res.status(teamsNotFound.status).json(teamsNotFound.message);
      }
      res.status(OK).json(teams);
    } catch (e) {
      next(e);
    }
  };
}
