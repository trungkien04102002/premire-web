import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { LeagueSeasonTeamRepository, TeamRepository } from '../repositories';
import axios from 'axios';

@injectable({scope: BindingScope.TRANSIENT})
export class LeagueSeasonTeamService {
  constructor(
    @repository(LeagueSeasonTeamRepository)
    public leagueSeasonTeamRepository : LeagueSeasonTeamRepository,
    @repository(TeamRepository)
    public teamRepository : TeamRepository
  ) {}
    // Get current season
    // Pick league
    // => Get id season, league
    // Get all team from the url
    // find by id of team
    // Create new element
  public curIdLS : number = 1;
  async synchLSTeamDb() : Promise<void>{
    const url = 'https://footballapi.pulselive.com/football/compseasons/578/teams';
    const response = await axios.get(url, {
      headers: {
        'Origin': 'https://www.premierleague.com'
      }
    });
    const dataResponse = response.data;
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i];
      const existTeam  = await this.teamRepository.findOne({where: {name:obj.club.name}});
      const teamId = existTeam?.id
      const existLST = await this.leagueSeasonTeamRepository.findOne({
        where: {
          and: [
            { teamId: teamId },
            { leagueSeasonId:this.curIdLS }
          ]
        }
      })
      if (existLST){
        console.log('This team have been added!')
      }
      else {
        await this.leagueSeasonTeamRepository.create({
          teamId: teamId,
          leagueSeasonId:this.curIdLS
        })
      }
    }
    return
  }

}
