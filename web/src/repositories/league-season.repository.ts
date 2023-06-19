import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LeagueSeason, LeagueSeasonRelations} from '../models';

export class LeagueSeasonRepository extends DefaultCrudRepository<
  LeagueSeason,
  typeof LeagueSeason.prototype.id,
  LeagueSeasonRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LeagueSeason, dataSource);
  }
}
