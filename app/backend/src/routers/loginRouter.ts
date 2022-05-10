import { Router } from 'express';
import UserValidation from '../middlewares/userValidate';
import LoginController from '../controllers/login';

const router = Router();

const { login, loginValidate } = new LoginController();
const { emailValidation, passValidation } = UserValidation;

router
  .post('/', emailValidation, passValidation, login)
  .get('/validate', loginValidate);

export default router;
