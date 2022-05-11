import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/tokenAuth';
import statusCode from '../utils/statusCode';

const { unauthorizedUser } = statusCode.errors;

export default class TokenValidation {
  constructor(
    private _loginService = new AuthService(),
  ) { }

  public tokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const isItAuthorized = this._loginService.verifyToken(authorization);
    if (!isItAuthorized) {
      res.status(unauthorizedUser.status).json(unauthorizedUser.message);
    }
    next();
  };
}
