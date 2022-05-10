import { NextFunction, Request, Response } from 'express';
import IUser from '../interfaces/User';
import UserService from '../services/user';
import AuthService from '../services/tokenAuth';
import statusCode from '../utils/statusCode';

const { emailOrPasswordInvalid } = statusCode.errors;
const { OK } = statusCode.StatusCodes;

export default class LoginController {
  private _userService;

  constructor(
    private _loginService = new AuthService(),
  ) {
    this._userService = new UserService();
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this._userService.login(email);

      if (!user) {
        const { code, message } = emailOrPasswordInvalid;
        res.status(code).json({ message });
      }

      const token = await this._loginService.authenticate(user as IUser);

      res.status(OK).json({ user, token });
    } catch (e) {
      next(e);
    }
  };
}
