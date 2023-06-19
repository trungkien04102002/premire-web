import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Team, TeamRelations, Stadium, Match} from '../models';
import {StadiumRepository} from './stadium.repository';
import {MatchRepository} from './match.repository';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {

  public readonly stadium: HasOneRepositoryFactory<Stadium, typeof Team.prototype.id>;

  public readonly matches: HasManyRepositoryFactory<Match, typeof Team.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('StadiumRepository') protected stadiumRepositoryGetter: Getter<StadiumRepository>, @repository.getter('MatchRepository') protected matchRepositoryGetter: Getter<MatchRepository>,
  ) {
    super(Team, dataSource);
    this.matches = this.createHasManyRepositoryFactoryFor('matches', matchRepositoryGetter,);
    this.registerInclusionResolver('matches', this.matches.inclusionResolver);
    this.stadium = this.createHasOneRepositoryFactoryFor('stadium', stadiumRepositoryGetter);
    this.registerInclusionResolver('stadium', this.stadium.inclusionResolver);
  }
}
