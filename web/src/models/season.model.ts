import {Entity, model, property} from '@loopback/repository';

@model()
export class Season extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: 'Season name',
  })
  seasonName?: string;

  @property({
    type: 'string',
    default: 'Season fullname',
  })
  fullName?: string;

  @property({
    type: 'string',
    default: '2020',
  })
  start?: string;

  @property({
    type: 'string',
    default: '2021',
  })
  end?: string;


  constructor(data?: Partial<Season>) {
    super(data);
  }
}

export interface SeasonRelations {
  // describe navigational properties here
}

export type SeasonWithRelations = Season & SeasonRelations;
