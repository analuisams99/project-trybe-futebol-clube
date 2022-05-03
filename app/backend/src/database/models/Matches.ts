import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import Teams from './Teams';

class Matches extends Model {
  public id: number;

  public homeTeam: number;

  public homeTeamGoals: number;

  public awayTeam: number;

  public awayTeamGoals: number;

  public inProgress: boolean;
}

Matches.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  home_team: {
    allowNull: false,
    type: INTEGER,
  },
  home_team_goals: {
    allowNull: false,
    type: INTEGER,
  },
  away_team: {
    allowNull: false,
    type: INTEGER,
  },
  away_team_goals: {
    allowNull: false,
    type: INTEGER,
  },
  in_progress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Matches.belongsTo(Teams, {
  foreignKey: 'homeTeam', as: 'teamHome' });
Matches.belongsTo(Teams, {
  foreignKey: 'awayTeam', as: 'teamAway' });

Teams.hasMany(Matches, {
  foreignKey: 'homeTeam', as: 'homeTeams' });
Teams.hasMany(Matches, {
  foreignKey: 'awayTeam', as: 'awayTeams' });

export default Matches;
