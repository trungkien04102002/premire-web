import {Entity, model, property} from '@loopback/repository';

@model()
export class Match extends Entity {
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
  leagueSeasonId: number;

  @property({
    type: 'string',
    required: true,
  })
  matchDate: string;

  @property({
    type: 'string',
    required: true,
  })
  matchTime: string;

  @property({
    type: 'string',
    default: 'Pending',
  })
  status?: string;

  @property({
    type: 'number',
    required: true,
  })
  homeId: number;

  @property({
    type: 'number',
    required: true,
  })
  awayId: number;

  @property({
    type: 'number',
    default: -1,
  })
  homeGoal?: number;

  @property({
    type: 'number',
    default: -1,
  })
  awayGoal?: number;

  @property({
    type: 'number',
    required: true,
  })
  refId: number;

  @property({
    type: 'number',
    required: true,
  })
  gameweek: number;

  constructor(data?: Partial<Match>) {
    super(data);
  }
}

export interface MatchRelations {
  // describe navigational properties here
}

export type MatchWithRelations = Match & MatchRelations;
