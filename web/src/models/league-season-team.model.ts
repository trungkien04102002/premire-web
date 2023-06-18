import {Entity, model, property} from '@loopback/repository';

@model()
export class LeagueSeasonTeam extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    default: 1,
  })
  leagueSeasonId?: number;

  @property({
    type: 'number',
    default: 1,
  })
  teamId?: number;


  constructor(data?: Partial<LeagueSeasonTeam>) {
    super(data);
  }
}

export interface LeagueSeasonTeamRelations {
  // describe navigational properties here
}

export type LeagueSeasonTeamWithRelations = LeagueSeasonTeam & LeagueSeasonTeamRelations;
