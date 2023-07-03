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
  Matchday,
  Match,
} from '../models';
import {MatchdayRepository} from '../repositories';

export class MatchdayMatchController {
  constructor(
    @repository(MatchdayRepository) protected matchdayRepository: MatchdayRepository,
  ) { }

  @get('/matchdays/{id}/matches', {
    responses: {
      '200': {
        description: 'Array of Matchday has many Match',
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
    return this.matchdayRepository.matches(id).find(filter);
  }

  @post('/matchdays/{id}/matches', {
    responses: {
      '200': {
        description: 'Matchday model instance',
        content: {'application/json': {schema: getModelSchemaRef(Match)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Matchday.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatchInMatchday',
            exclude: ['id'],
            optional: ['matchdayId']
          }),
        },
      },
    }) match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.matchdayRepository.matches(id).create(match);
  }

  @patch('/matchdays/{id}/matches', {
    responses: {
      '200': {
        description: 'Matchday.Match PATCH success count',
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
    return this.matchdayRepository.matches(id).patch(match, where);
  }

  @del('/matchdays/{id}/matches', {
    responses: {
      '200': {
        description: 'Matchday.Match DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Match)) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchdayRepository.matches(id).delete(where);
  }
}
