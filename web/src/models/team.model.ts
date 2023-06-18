import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {
  // describe navigational properties here
}

export type TeamWithRelations = Team & TeamRelations;
