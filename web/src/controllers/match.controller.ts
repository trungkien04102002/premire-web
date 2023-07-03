
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
import {Match} from '../models';
import {MatchRepository, TeamRepository} from '../repositories';

export class MatchController {
  constructor(
    @repository(MatchRepository)
    public matchRepository : MatchRepository,
    @repository(TeamRepository)
    public teamRepository: TeamRepository
  ) {}

  @post('/matches')
  @response(200, {
    description: 'Match model instance',
    content: {'application/json': {schema: getModelSchemaRef(Match)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatch',
            exclude: ['id'],
          }),
        },
      },
    })
    match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.matchRepository.create(match);
  }

  @get('/matches/count')
  @response(200, {
    description: 'Match model count',
    content: {'application/json': {schema: CountSchema}},
  })
  public async count(
    @param.where(Match) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchRepository.count(where);
  }



  @get('/matches')
  @response(200, {
    description: 'Array of Match model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Match, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Match) filter?: Filter<Match>,
  ): Promise<Match[]> {
    return this.matchRepository.find(filter);
  }

// ----------------------- START 0 ----------------
@get('/matches/team/{id}')
@response(200, {
  description: 'Array match of specific team',
  content: {
    'application/json': {
      schema: {
        type: 'array',
        items: getModelSchemaRef(Match, {includeRelations: true}),
      },
    },
  },
})
async getMatchOfTeam(
  @param.path.number('id') id: number,
  @param.filter(Match) filter?: Filter<Match>,
): Promise<Match[]> {
  const where = {
    or: [
      { homeId: id },
      { awayId: id },
    ],
  };
  return this.matchRepository.find({ where, ...filter });
}
// ----------------------- END 0 ------------------

  // ========================= START ====================
  @get('/matches')
  @response(200, {
    description: 'Array of Match model with Pagination',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: getModelSchemaRef(Match, { includeRelations: true }),
            },
            pageInfo: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                numPages: { type: 'number' },
                pageSize: { type: 'number' },
                numEntries: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async findPagination(
    @param.query.number('pageSize') pageSize: number,
    @param.query.number('page') page: number,
  ): Promise<{ matches: Match[]; pageInfo: any }> {
    const limit = pageSize;
    const where = {}; // you can add a filter here if needed
    const countResult: Count = await this.matchRepository.count(where);
    const count = countResult.count;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(count / limit);
    const matches = await this.matchRepository.find({ limit, skip });
    const pageInfo = {
      page,
      numPages: totalPages,
      pageSize: limit,
      numEntries: count,
    };
    return { matches, pageInfo };
  }

  // @get('/matches/{pageSize}/{page}')
  // @response(200, {
  //   description: 'Array of Match model with Pagination',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Match, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async findPagination(
  //   @param.path.number('pageSize') pageSize: number,
  //   @param.path.number('page') page: number,
  // ): Promise<Match[]> {
  //   const limit = pageSize;
  //   const where = {}; // you can add a filter here if needed
  //   const countResult = await this.matchRepository.count(where);
  //   const count = countResult.count;
  //   const skip = (page - 1) * limit;
  //   const totalPages = Math.ceil(count / limit);
  //   const matches = await this.matchRepository.find({limit, skip});
  //   return matches;
  // }
 // ========================= END ====================
  @patch('/matches')
  @response(200, {
    description: 'Match PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
    @param.where(Match) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchRepository.updateAll(match, where);
  }

  @get('/matches/{id}')
  @response(200, {
    description: 'Match model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Match, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Match, {exclude: 'where'}) filter?: FilterExcludingWhere<Match>
  ): Promise<Match> {
    return this.matchRepository.findById(id, filter);
  }

  @patch('/matches/{id}')
  @response(204, {
    description: 'Match PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
  ): Promise<void> {
    await this.matchRepository.updateById(id, match);
  }

  @put('/matches/{id}')
  @response(204, {
    description: 'Match PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() match: Match,
  ): Promise<void> {
    await this.matchRepository.replaceById(id, match);
  }

  @del('/matches/{id}')
  @response(204, {
    description: 'Match DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.matchRepository.deleteById(id);
  }
}
