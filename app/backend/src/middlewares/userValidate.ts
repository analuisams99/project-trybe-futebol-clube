import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import Users from '../database/models/Users';
import statusCode from '../utils/statusCode';

const { fieldNotFilled, emailOrPasswordInvalid } = statusCode.errors;

export default class UserValidation {
  public static emailValidation(req: Request, res: Response, next: NextFunction) {
    const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const { email } = req.body;

    if (email === '') {
      const { status, message } = fieldNotFilled;
      return res.status(status).json({ message });
    }

    if (!EMAIL_REGEX.test(email)) {
      const { status, message } = emailOrPasswordInvalid;
      return res.status(status).json({ message });
    }

    next();
  }

  public static async passValidation(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (password === '') {
      const { status, message } = fieldNotFilled;
      return res.status(status).json({ message });
    }

    const user = await Users.findOne({ where: { email } });
    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        const { status, message } = emailOrPasswordInvalid;
        return res.status(status).json({ message });
      }
    }
    next();
  }
}
