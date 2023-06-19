import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Team, TeamRelations, Stadium} from '../models';
import {StadiumRepository} from './stadium.repository';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {

  public readonly stadium: HasOneRepositoryFactory<Stadium, typeof Team.prototype.id>;


  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('StadiumRepository') protected stadiumRepositoryGetter: Getter<StadiumRepository>,
  ) {
    super(Team, dataSource);
    this.stadium = this.createHasOneRepositoryFactoryFor('stadium', stadiumRepositoryGetter);
    this.registerInclusionResolver('stadium', this.stadium.inclusionResolver);
  }
}
