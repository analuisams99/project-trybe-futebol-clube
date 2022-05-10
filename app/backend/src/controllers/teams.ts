import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams';
import statusCode from '../utils/statusCode';

const { OK, BadRequest } = statusCode.StatusCodes;

export default class TeamsController {
  constructor(
    private _teamsService = new TeamsService(),
  ) { }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const team = await this._teamsService.getById(+id);

      if (!team) {
        res.status(BadRequest).json({ message: 'Invalid Id' });
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
        res.status(BadRequest).json({ message: 'Teams not found' });
      }
      res.status(OK).json(teams);
    } catch (e) {
      next(e);
    }
  };
}
