import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LeagueSeasonTeam, LeagueSeasonTeamRelations} from '../models';

export class LeagueSeasonTeamRepository extends DefaultCrudRepository<
  LeagueSeasonTeam,
  typeof LeagueSeasonTeam.prototype.id,
  LeagueSeasonTeamRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LeagueSeasonTeam, dataSource);
  }
}
