import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {Stadium} from './stadium.model';
import {Match} from './match.model';

@model()
export class Team extends Entity {
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
  name: string;

  @property({
    type: 'string',
    default: '',
  })
  shortName?: string;

  @property({
    type: 'string',
    required: true,
  })
  logo: string;

  @property({
    type: 'string',
    required: true,
  })
  abbr: string;

  @hasOne(() => Stadium)
  stadium: Stadium;

  @hasMany(() => Match)
  matches: Match[];

  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {
  // describe navigational properties here
}

export type TeamWithRelations = Team & TeamRelations;
