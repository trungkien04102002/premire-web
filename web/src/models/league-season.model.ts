import {Entity, model, property, hasMany} from '@loopback/repository';
import {Team} from './team.model';
import {LeagueSeasonTeam} from './league-season-team.model';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'leagueseason',
    },
    indexes: {
      unique_leagueId_seasonId: {
        keys: {
          leagueId: 1,
          seasonId: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class LeagueSeason extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  leagueId: number;

  @property({
    type: 'number',
    required: true,
  })
  seasonId: number;

  @property({
    type: 'string',
    default: 'League Season name',
  })
  name?: string;

  @property({
    type: 'string',
    default: 'URL',
  })
  logo?: string;

  @hasMany(() => Team, {through: {model: () => LeagueSeasonTeam}})
  teams: Team[];

  constructor(data?: Partial<LeagueSeason>) {
    super(data);
  }
}

export interface LeagueSeasonRelations {
  // describe navigational properties here
}

export type LeagueSeasonWithRelations = LeagueSeason & LeagueSeasonRelations;
