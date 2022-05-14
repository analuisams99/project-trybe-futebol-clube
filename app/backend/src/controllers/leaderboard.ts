import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard';
import statusCode from '../utils/statusCode';

const { OK } = statusCode.StatusCodes;

export default class LeaderboardController {
  constructor(
    private _leaderboardService = new LeaderboardService(),
  ) { }

  public getAllLeaderboard = async (req: Request, res: Response, next: NextFunction)
  : Promise<void> => {
    try {
      const allLeaderboards = await this._leaderboardService.getLeaderboard();
      res.status(OK).json(allLeaderboards);
    } catch (e) {
      next(e);
    }
  };
}
