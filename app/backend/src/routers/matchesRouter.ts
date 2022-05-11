import { Router } from 'express';
import TokenValidation from '../middlewares/tokenValidation';
import MatchesController from '../controllers/matches';

const router = Router();

const { getAll, create, inProgressUpdate, matchUpdate } = new MatchesController();
const { tokenValidation } = new TokenValidation();

router
  .post('/', tokenValidation, create)
  .patch('/:id/finish', inProgressUpdate)
  .patch('/:id', matchUpdate)
  .get('/', getAll);

export default router;
