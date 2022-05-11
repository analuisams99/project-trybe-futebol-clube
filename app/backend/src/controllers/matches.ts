import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/matches';
import statusCode from '../utils/statusCode';

const { OK, BadRequest } = statusCode.StatusCodes;

export default class MatchesController {
  constructor(
    private _matchesService = new MatchesService(),
  ) { }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { inProgress } = req.query;

      const matches = await this._matchesService.getAll(inProgress as string | undefined);
      if (!matches) {
        res.status(BadRequest).json({ message: 'Matches not found' });
      }
      res.status(OK).json(matches);
    } catch (e) {
      next(e);
    }
  };
}
