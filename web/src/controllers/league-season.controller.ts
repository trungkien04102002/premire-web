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
League,
LeagueSeason,
Season,
} from '../models';
import {LeagueRepository} from '../repositories';

export class LeagueSeasonController {
  constructor(
    @repository(LeagueRepository) protected leagueRepository: LeagueRepository,
  ) { }

  @get('/leagues/{id}/seasons', {
    responses: {
      '200': {
        description: 'Array of League has many Season through LeagueSeason',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Season)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Season>,
  ): Promise<Season[]> {
    return this.leagueRepository.seasons(id).find(filter);
  }

  @post('/leagues/{id}/seasons', {
    responses: {
      '200': {
        description: 'create a Season model instance',
        content: {'application/json': {schema: getModelSchemaRef(Season)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof League.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {
            title: 'NewSeasonInLeague',
            exclude: ['id'],
          }),
        },
      },
    }) season: Omit<Season, 'id'>,
  ): Promise<Season> {
    return this.leagueRepository.seasons(id).create(season);
  }

  @patch('/leagues/{id}/seasons', {
    responses: {
      '200': {
        description: 'League.Season PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {partial: true}),
        },
      },
    })
    season: Partial<Season>,
    @param.query.object('where', getWhereSchemaFor(Season)) where?: Where<Season>,
  ): Promise<Count> {
    return this.leagueRepository.seasons(id).patch(season, where);
  }

  @del('/leagues/{id}/seasons', {
    responses: {
      '200': {
        description: 'League.Season DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Season)) where?: Where<Season>,
  ): Promise<Count> {
    return this.leagueRepository.seasons(id).delete(where);
  }
}
