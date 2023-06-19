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
LeagueSeasonTeam,
Team,
} from '../models';
import {LeagueSeasonRepository} from '../repositories';

export class LeagueSeasonTeamController {
  constructor(
    @repository(LeagueSeasonRepository) protected leagueSeasonRepository: LeagueSeasonRepository,
  ) { }

  @get('/league-seasons/{id}/teams', {
    responses: {
      '200': {
        description: 'Array of LeagueSeason has many Team through LeagueSeasonTeam',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Team)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Team>,
  ): Promise<Team[]> {
    return this.leagueSeasonRepository.teams(id).find(filter);
  }

  @post('/league-seasons/{id}/teams', {
    responses: {
      '200': {
        description: 'create a Team model instance',
        content: {'application/json': {schema: getModelSchemaRef(Team)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof LeagueSeason.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {
            title: 'NewTeamInLeagueSeason',
            exclude: ['id'],
          }),
        },
      },
    }) team: Omit<Team, 'id'>,
  ): Promise<Team> {
    return this.leagueSeasonRepository.teams(id).create(team);
  }

  @patch('/league-seasons/{id}/teams', {
    responses: {
      '200': {
        description: 'LeagueSeason.Team PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {partial: true}),
        },
      },
    })
    team: Partial<Team>,
    @param.query.object('where', getWhereSchemaFor(Team)) where?: Where<Team>,
  ): Promise<Count> {
    return this.leagueSeasonRepository.teams(id).patch(team, where);
  }

  @del('/league-seasons/{id}/teams', {
    responses: {
      '200': {
        description: 'LeagueSeason.Team DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Team)) where?: Where<Team>,
  ): Promise<Count> {
    return this.leagueSeasonRepository.teams(id).delete(where);
  }
}
