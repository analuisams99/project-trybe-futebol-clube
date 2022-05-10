import { Router } from 'express';
import UserValidation from '../middlewares/userValidate';
import LoginController from '../controllers/login';

const router = Router();

const { login } = new LoginController();
const { emailValidation, passValidation } = UserValidation;

router
  .post('/', emailValidation, passValidation, login);

export default router;
