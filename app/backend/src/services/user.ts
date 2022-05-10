import IUser from '../interfaces/User';
import Users from '../database/models/Users';

export default class UserService {
  constructor(private _userModel = Users) {}

  public async login(emailUser: string): Promise<IUser | null> {
    const foundUser = await this._userModel.findOne({ where: { email: emailUser } });

    if (!foundUser) return null;

    const { id, username, role, email } = foundUser;
    const user = { id, username, role, email };

    return user as IUser;
  }
}
