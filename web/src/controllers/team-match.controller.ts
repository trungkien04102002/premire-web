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
  Match,
} from '../models';
import {TeamRepository} from '../repositories';

export class TeamMatchController {
  constructor(
    @repository(TeamRepository) protected teamRepository: TeamRepository,
  ) { }

  @get('/teams/{id}/matches', {
    responses: {
      '200': {
        description: 'Array of Team has many Match',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Match)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Match>,
  ): Promise<Match[]> {
    return this.teamRepository.matches(id).find(filter);
  }

  @post('/teams/{id}/matches', {
    responses: {
      '200': {
        description: 'Team model instance',
        content: {'application/json': {schema: getModelSchemaRef(Match)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Team.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatchInTeam',
            exclude: ['id'],
            optional: ['teamId']
          }),
        },
      },
    }) match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.teamRepository.matches(id).create(match);
  }

  @patch('/teams/{id}/matches', {
    responses: {
      '200': {
        description: 'Team.Match PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Partial<Match>,
    @param.query.object('where', getWhereSchemaFor(Match)) where?: Where<Match>,
  ): Promise<Count> {
    return this.teamRepository.matches(id).patch(match, where);
  }

  @del('/teams/{id}/matches', {
    responses: {
      '200': {
        description: 'Team.Match DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Match)) where?: Where<Match>,
  ): Promise<Count> {
    return this.teamRepository.matches(id).delete(where);
  }
}
