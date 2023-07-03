import {Entity, model, property, hasMany} from '@loopback/repository';
import {Match} from './match.model';

@model()
export class Matchday extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index:{
      unique: true,
    }
  })
  day: string;

  @property({
    type: 'number',
    required: true,
  })
  gameweek: number;

  @hasMany(() => Match)
  matches: Match[];

  constructor(data?: Partial<Matchday>) {
    super(data);
  }
}

export interface MatchdayRelations {
  // describe navigational properties here
}

export type MatchdayWithRelations = Matchday & MatchdayRelations;
