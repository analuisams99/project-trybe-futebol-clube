import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard';

const router = Router();

const { getAllLeaderboard, getLeaderboardAway, getLeaderboardHome } = new LeaderboardController();

router
  .get('/', getAllLeaderboard)
  .get('/away', getLeaderboardAway)
  .get('/home', getLeaderboardHome);

export default router;
