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
  LeagueSeason,
  Match,
} from '../models';
import {LeagueSeasonRepository} from '../repositories';

export class LeagueSeasonMatchController {
  constructor(
    @repository(LeagueSeasonRepository) protected leagueSeasonRepository: LeagueSeasonRepository,
  ) { }

  @get('/league-seasons/{id}/matches', {
    responses: {
      '200': {
        description: 'Array of LeagueSeason has many Match',
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
    return this.leagueSeasonRepository.matches(id).find(filter);
  }

  @post('/league-seasons/{id}/matches', {
    responses: {
      '200': {
        description: 'LeagueSeason model instance',
        content: {'application/json': {schema: getModelSchemaRef(Match)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof LeagueSeason.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatchInLeagueSeason',
            exclude: ['id'],
            optional: ['leagueSeasonId']
          }),
        },
      },
    }) match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.leagueSeasonRepository.matches(id).create(match);
  }

  @patch('/league-seasons/{id}/matches', {
    responses: {
      '200': {
        description: 'LeagueSeason.Match PATCH success count',
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
    return this.leagueSeasonRepository.matches(id).patch(match, where);
  }

  @del('/league-seasons/{id}/matches', {
    responses: {
      '200': {
        description: 'LeagueSeason.Match DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Match)) where?: Where<Match>,
  ): Promise<Count> {
    return this.leagueSeasonRepository.matches(id).delete(where);
  }
}
