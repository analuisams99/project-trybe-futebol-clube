import { Router } from 'express';
import TeamsController from '../controllers/teams';

const router = Router();

const { getById, getAll } = new TeamsController();

router
  .get('/:id', getById)
  .get('/', getAll);

export default router;
