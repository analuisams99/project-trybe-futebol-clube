import { NextFunction, Request, Response } from 'express';
import LeaderboardHomeService from '../services/leaderboardHome';
import LeaderboardService from '../services/leaderboard';
import statusCode from '../utils/statusCode';
import LeaderboardAwayService from '../services/leaderboardAway';

const { OK } = statusCode.StatusCodes;

export default class LeaderboardController {
  constructor(
    private _leaderboardService = new LeaderboardService(),
    private _leaderboardHomeService = new LeaderboardHomeService(),
    private _leaderboardAwayService = new LeaderboardAwayService(),

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

  public getLeaderboardHome = async (req: Request, res: Response, next: NextFunction)
  : Promise<void> => {
    try {
      const LeaderboardsHome = await this._leaderboardHomeService.getLeaderboardHome();
      res.status(OK).json(LeaderboardsHome);
    } catch (e) {
      next(e);
    }
  };

  public getLeaderboardAway = async (req: Request, res: Response, next: NextFunction)
  : Promise<void> => {
    try {
      const LeaderboardsAway = await this._leaderboardAwayService.getLeaderboardAway();
      res.status(OK).json(LeaderboardsAway);
    } catch (e) {
      next(e);
    }
  };
}
