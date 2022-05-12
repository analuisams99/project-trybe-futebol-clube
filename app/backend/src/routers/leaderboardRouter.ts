import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard';

const router = Router();

const { getAllLeaderboard } = new LeaderboardController();

router
  .get('/', getAllLeaderboard)
  .get('/home')
  .get('/away');

export default router;
