import {Entity, model, property, hasMany} from '@loopback/repository';
import {Season} from './season.model';
import {LeagueSeason} from './league-season.model';

@model()
export class League extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: 'League Name',
  })
  name?: string;

  @property({
    type: 'string',
    default: 'URL',
  })
  logo?: string;

  @hasMany(() => Season, {through: {model: () => LeagueSeason}})
  seasons: Season[];

  constructor(data?: Partial<League>) {
    super(data);
  }
}

export interface LeagueRelations {
  // describe navigational properties here
}

export type LeagueWithRelations = League & LeagueRelations;
