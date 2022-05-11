import { Router } from 'express';
import TokenValidation from '../middlewares/tokenValidation';
import MatchesController from '../controllers/matches';

const router = Router();

const { getAll, create, inProgressUpdate } = new MatchesController();
const { tokenValidation } = new TokenValidation();

router
  .post('/', tokenValidation, create)
  .patch('/:id/finish', inProgressUpdate)
  .get('/', getAll);

export default router;
