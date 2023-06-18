import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Team,
  Stadium,
} from '../models';
import {TeamRepository} from '../repositories';

export class TeamStadiumController {
  constructor(
    @repository(TeamRepository) protected teamRepository: TeamRepository,
  ) { }

  @get('/teams/{id}/stadium', {
    responses: {
      '200': {
        description: 'Team has one Stadium',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Stadium),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Stadium>,
  ): Promise<Stadium> {
    return this.teamRepository.stadium(id).get(filter);
  }

  @post('/teams/{id}/stadium', {
    responses: {
      '200': {
        description: 'Team model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stadium)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Team.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stadium, {
            title: 'NewStadiumInTeam',
            exclude: ['id'],
            optional: ['teamId']
          }),
        },
      },
    }) stadium: Omit<Stadium, 'id'>,
  ): Promise<Stadium> {
    return this.teamRepository.stadium(id).create(stadium);
  }

  @patch('/teams/{id}/stadium', {
    responses: {
      '200': {
        description: 'Team.Stadium PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stadium, {partial: true}),
        },
      },
    })
    stadium: Partial<Stadium>,
    @param.query.object('where', getWhereSchemaFor(Stadium)) where?: Where<Stadium>,
  ): Promise<Count> {
    return this.teamRepository.stadium(id).patch(stadium, where);
  }

  @del('/teams/{id}/stadium', {
    responses: {
      '200': {
        description: 'Team.Stadium DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Stadium)) where?: Where<Stadium>,
  ): Promise<Count> {
    return this.teamRepository.stadium(id).delete(where);
  }
}
