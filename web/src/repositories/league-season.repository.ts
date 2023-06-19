import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LeagueSeason, LeagueSeasonRelations, Team, LeagueSeasonTeam} from '../models';
import {LeagueSeasonTeamRepository} from './league-season-team.repository';
import {TeamRepository} from './team.repository';

export class LeagueSeasonRepository extends DefaultCrudRepository<
  LeagueSeason,
  typeof LeagueSeason.prototype.id,
  LeagueSeasonRelations
> {

  public readonly teams: HasManyThroughRepositoryFactory<Team, typeof Team.prototype.id,
          LeagueSeasonTeam,
          typeof LeagueSeason.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LeagueSeasonTeamRepository') protected leagueSeasonTeamRepositoryGetter: Getter<LeagueSeasonTeamRepository>, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>,
  ) {
    super(LeagueSeason, dataSource);
    this.teams = this.createHasManyThroughRepositoryFactoryFor('teams', teamRepositoryGetter, leagueSeasonTeamRepositoryGetter,);
    this.registerInclusionResolver('teams', this.teams.inclusionResolver);
  }
}
