import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Match, Matchday} from '../models';
import {MatchdayRepository} from '../repositories';

export class MatchdayController {
  constructor(
    @repository(MatchdayRepository)
    public matchdayRepository : MatchdayRepository,
  ) {}

  @post('/matchdays')
  @response(200, {
    description: 'Matchday model instance',
    content: {'application/json': {schema: getModelSchemaRef(Matchday)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Matchday, {
            title: 'NewMatchday',
            exclude: ['id'],
          }),
        },
      },
    })
    matchday: Omit<Matchday, 'id'>,
  ): Promise<Matchday> {
    return this.matchdayRepository.create(matchday);
  }

  @get('/matchdays/count')
  @response(200, {
    description: 'Matchday model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Matchday) where?: Where<Matchday>,
  ): Promise<Count> {
    return this.matchdayRepository.count(where);
  }

  // @get('/matchdays')
  // @response(200, {
  //   description: 'Array of Matchday model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Matchday, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Matchday) filter?: Filter<Matchday>,
  // ): Promise<Matchday[]> {
  //   return this.matchdayRepository.find(filter);
  // }
  // ------------ START GET MATCHDAY BY GAMEWEEK -------------
  // @get('/matchdays')
  // @response(200, {
  //   description: 'GET MATCHDAY BY GAMEWEEK',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Matchday, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async findByGameWeek(
  //   @param.query.number('gameweek') gameweek: number,
  //   @param.filter(Matchday) filter?: Filter<Matchday>,
  // ): Promise<Matchday[]> {
  //   return this.matchdayRepository.find({
  //     where: {
  //       gameweek: gameweek,
  //     },
  //     include: [
  //       {
  //         relation: 'matches',
  //       },
  //     ],
  //     ...filter,
  //   });
  // }
  // // ------------ END -------------

    // ------------ GET MATCH DAY OF SPECIFIC CLUB -------------
    @get('/matchdays')
    @response(200, {
      description: 'GETMATCH DAY OF SPECIFIC CLUB',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Matchday, {includeRelations: true}),
          },
        },
      },
    })
    async findByGameClub(
      @param.query.number('clubId') clubId: number,
      @param.filter(Matchday) filter?: Filter<Matchday & { include?: Match[] }>,
    ): Promise<Matchday[]> {
      const include = [{ relation: 'matches', scope: { where: { or: [{ homeId: clubId }, { awayId: clubId }] } } }];
      filter = filter ?? {};
      filter.include = filter.include ?? include;
      return this.matchdayRepository.find(filter);
    }
  
    // ------------ END -------------

  @patch('/matchdays')
  @response(200, {
    description: 'Matchday PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Matchday, {partial: true}),
        },
      },
    })
    matchday: Matchday,
    @param.where(Matchday) where?: Where<Matchday>,
  ): Promise<Count> {
    return this.matchdayRepository.updateAll(matchday, where);
  }

  @get('/matchdays/{id}')
  @response(200, {
    description: 'Matchday model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Matchday, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Matchday, {exclude: 'where'}) filter?: FilterExcludingWhere<Matchday>
  ): Promise<Matchday> {
    return this.matchdayRepository.findById(id, filter);
  }

  @patch('/matchdays/{id}')
  @response(204, {
    description: 'Matchday PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Matchday, {partial: true}),
        },
      },
    })
    matchday: Matchday,
  ): Promise<void> {
    await this.matchdayRepository.updateById(id, matchday);
  }

  @put('/matchdays/{id}')
  @response(204, {
    description: 'Matchday PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() matchday: Matchday,
  ): Promise<void> {
    await this.matchdayRepository.replaceById(id, matchday);
  }

  @del('/matchdays/{id}')
  @response(204, {
    description: 'Matchday DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.matchdayRepository.deleteById(id);
  }
}
