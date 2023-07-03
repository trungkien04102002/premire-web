import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Matchday, MatchdayRelations, Match} from '../models';
import {MatchRepository} from './match.repository';

export class MatchdayRepository extends DefaultCrudRepository<
  Matchday,
  typeof Matchday.prototype.id,
  MatchdayRelations
> {

  public readonly matches: HasManyRepositoryFactory<Match, typeof Matchday.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MatchRepository') protected matchRepositoryGetter: Getter<MatchRepository>,
  ) {
    super(Matchday, dataSource);
    this.matches = this.createHasManyRepositoryFactoryFor('matches', matchRepositoryGetter,);
    this.registerInclusionResolver('matches', this.matches.inclusionResolver);
  }
}
