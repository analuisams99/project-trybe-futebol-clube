import * as JWT from 'jsonwebtoken';
import * as fs from 'fs';
import IUser from '../interfaces/User';

const JWT_SECRET = fs.readFileSync('jwt.evaluation.key');

export default class AuthService {
  public authenticate = async (data: IUser): Promise<string | null> => {
    const { email, role } = data;
    const token = JWT.sign({ email, role }, JWT_SECRET);
    return token;
  };

  public verifyToken = (token: string): boolean => {
    try {
      JWT.verify(token, JWT_SECRET);
    } catch (e) {
      return false;
    }

    return true;
  };
}
