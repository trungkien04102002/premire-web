import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {League, LeagueRelations, Season, LeagueSeason} from '../models';
import {LeagueSeasonRepository} from './league-season.repository';
import {SeasonRepository} from './season.repository';

export class LeagueRepository extends DefaultCrudRepository<
  League,
  typeof League.prototype.id,
  LeagueRelations
> {

  public readonly seasons: HasManyThroughRepositoryFactory<Season, typeof Season.prototype.id,
          LeagueSeason,
          typeof League.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LeagueSeasonRepository') protected leagueSeasonRepositoryGetter: Getter<LeagueSeasonRepository>, @repository.getter('SeasonRepository') protected seasonRepositoryGetter: Getter<SeasonRepository>,
  ) {
    super(League, dataSource);
    this.seasons = this.createHasManyThroughRepositoryFactoryFor('seasons', seasonRepositoryGetter, leagueSeasonRepositoryGetter,);
    this.registerInclusionResolver('seasons', this.seasons.inclusionResolver);
  }
}
