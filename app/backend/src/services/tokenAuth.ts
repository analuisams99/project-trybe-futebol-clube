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

  public verifyToken = (token: string): string | boolean => {
    try {
      const { role } = JWT.verify(token, JWT_SECRET) as IUser;
      return role;
    } catch (e) {
      return false;
    }
    return true;
  };
}
