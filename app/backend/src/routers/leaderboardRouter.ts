import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard';

const router = Router();

const { getAllLeaderboard, getLeaderboardHome } = new LeaderboardController();

router
  .get('/', getAllLeaderboard)
  .get('/home', getLeaderboardHome)
  .get('/away');

export default router;
