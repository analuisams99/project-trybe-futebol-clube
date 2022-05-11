import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/matches';
import statusCode from '../utils/statusCode';

const { OK, CREATED } = statusCode.StatusCodes;
const {
  equalTeams, notFoundTeamById, matchFinished, matchesNotFound,
} = statusCode.errors;

export default class MatchesController {
  constructor(
    private _matchesService = new MatchesService(),
  ) { }

  public create = async (req: Request, res: Response, next: NextFunction)
  : Promise<void | Response> => {
    try {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = req.body;
      if (homeTeam === awayTeam) {
        return res.status(equalTeams.status).json({ message: equalTeams.message });
      }

      const MatchCreated = await this._matchesService.create(
        { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress },
      );

      if (MatchCreated === false || !MatchCreated) {
        return res.status(notFoundTeamById.status).json({ message: notFoundTeamById.message });
      }

      return res.status(CREATED).json(MatchCreated);
    } catch (e) {
      next(e);
    }
  };

  public inProgressUpdate = async (req: Request, res: Response, next: NextFunction)
  : Promise<void> => {
    try {
      const { id } = req.params;
      await this._matchesService.inProgressUpdate(+id);
      res.status(matchFinished.status).json(matchFinished.message);
    } catch (e) {
      next(e);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { inProgress } = req.query;

      const matches = await this._matchesService.getAll(inProgress as string | undefined);
      if (!matches) {
        res.status(matchesNotFound.status).json(matchesNotFound.message);
      }
      res.status(OK).json(matches);
    } catch (e) {
      next(e);
    }
  };
}
