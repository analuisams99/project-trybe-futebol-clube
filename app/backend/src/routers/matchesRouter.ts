import { Router } from 'express';
import MatchesController from '../controllers/matches';

const router = Router();

const { getAll } = new MatchesController();

router
  .get('/', getAll);

export default router;
