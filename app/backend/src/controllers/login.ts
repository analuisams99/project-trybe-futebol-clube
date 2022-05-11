import { NextFunction, Request, Response } from 'express';
import IUser from '../interfaces/User';
import UserService from '../services/user';
import AuthService from '../services/tokenAuth';
import statusCode from '../utils/statusCode';

const { emailOrPasswordInvalid, unauthorizedUser } = statusCode.errors;
const { OK } = statusCode.StatusCodes;

export default class LoginController {
  constructor(
    private _loginService = new AuthService(),
    private _userService = new UserService(),
    private _authentication = new AuthService(),
  ) { }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this._userService.login(email);

      if (!user) {
        const { status, message } = emailOrPasswordInvalid;
        res.status(status).json({ message });
      }

      const token = await this._loginService.authenticate(user as IUser);

      res.status(OK).json({ user, token });
    } catch (e) {
      next(e);
    }
  };

  public loginValidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { authorization } = req.headers;
      if (!authorization) res.status(unauthorizedUser.status).json(unauthorizedUser.message);

      const IsTokenValid = this._authentication.verifyToken(authorization as string);
      if (typeof IsTokenValid === 'string') {
        res.status(OK).json(IsTokenValid);
      }
      res.status(unauthorizedUser.status).json(unauthorizedUser.message);
    } catch (e) {
      next(e);
    }
  };
}
