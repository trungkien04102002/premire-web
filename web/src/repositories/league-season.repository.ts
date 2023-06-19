import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LeagueSeason, LeagueSeasonRelations, Team, LeagueSeasonTeam, Match} from '../models';
import {LeagueSeasonTeamRepository} from './league-season-team.repository';
import {TeamRepository} from './team.repository';
import {MatchRepository} from './match.repository';

export class LeagueSeasonRepository extends DefaultCrudRepository<
  LeagueSeason,
  typeof LeagueSeason.prototype.id,
  LeagueSeasonRelations
> {

  public readonly teams: HasManyThroughRepositoryFactory<Team, typeof Team.prototype.id,
          LeagueSeasonTeam,
          typeof LeagueSeason.prototype.id
        >;

  public readonly matches: HasManyRepositoryFactory<Match, typeof LeagueSeason.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LeagueSeasonTeamRepository') protected leagueSeasonTeamRepositoryGetter: Getter<LeagueSeasonTeamRepository>, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>, @repository.getter('MatchRepository') protected matchRepositoryGetter: Getter<MatchRepository>,
  ) {
    super(LeagueSeason, dataSource);
    this.matches = this.createHasManyRepositoryFactoryFor('matches', matchRepositoryGetter,);
    this.registerInclusionResolver('matches', this.matches.inclusionResolver);
    this.teams = this.createHasManyThroughRepositoryFactoryFor('teams', teamRepositoryGetter, leagueSeasonTeamRepositoryGetter,);
    this.registerInclusionResolver('teams', this.teams.inclusionResolver);
  }
}
