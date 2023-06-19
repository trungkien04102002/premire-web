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
    default: '2023/2024',
  })
  name?: string;

  @property({
    type: 'string',
    default: 'Premier League',
  })
  fullName?: string;

  @property({
    type: 'string',
    default: '12/08/2023',
  })
  startDate?: string;

  @property({
    type: 'string',
    default: '19/05/2024',
  })
  endDate?: string;


  constructor(data?: Partial<Season>) {
    super(data);
  }
}

export interface SeasonRelations {
  // describe navigational properties here
}

export type SeasonWithRelations = Season & SeasonRelations;
