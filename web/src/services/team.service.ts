import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Team } from '../models';
import { TeamRepository } from '../repositories';
import { repository } from '@loopback/repository';
interface TeamLogo {
  name: string;
  logo: string;
}
@injectable({scope: BindingScope.TRANSIENT})
export class TeamService {
  constructor(
    @repository(TeamRepository)
    public teamRepository : TeamRepository
  ) {}
  async synchTeamDb(dataResponse: any) : Promise<void>{
    const dictImg: { [key: string]: string } = {
      'Bournemouth':'https://resources.premierleague.com/premierleague/badges/rb/t91.svg',
      'Arsenal':'https://resources.premierleague.com/premierleague/badges/rb/t3.svg',
      'Aston Villa':'https://resources.premierleague.com/premierleague/badges/rb/t7.svg',
      'Brentford':'https://resources.premierleague.com/premierleague/badges/rb/t94.svg',
      'Brighton and Hove Albion':'https://resources.premierleague.com/premierleague/badges/rb/t36.svg',
      'Burnley':'https://resources.premierleague.com/premierleague/badges/rb/t90.svg',
      'Chelsea':'https://resources.premierleague.com/premierleague/badges/rb/t8.svg',
      'Crystal Palace':'https://resources.premierleague.com/premierleague/badges/rb/t31.svg',
      'Everton':'https://resources.premierleague.com/premierleague/badges/rb/t11.svg',
      'Fulham':'https://resources.premierleague.com/premierleague/badges/rb/t54.svg',
      'Liverpool':'https://resources.premierleague.com/premierleague/badges/rb/t14.svg',
      'Luton Town':'https://resources.premierleague.com/premierleague/badges/rb/t102.svg',
      'Manchester City':'https://resources.premierleague.com/premierleague/badges/rb/t43.svg',
      'Manchester United':'https://resources.premierleague.com/premierleague/badges/rb/t1.png',
      'Newcastle United':'https://resources.premierleague.com/premierleague/badges/rb/t4.png',
      'Nottingham Forest':'https://resources.premierleague.com/premierleague/badges/rb/t17.svg',
      'Sheffield United':'https://resources.premierleague.com/premierleague/badges/rb/t49.svg',
      'Tottenham Hotspur':'https://resources.premierleague.com/premierleague/badges/rb/t6.svg',
      'West Ham United':'https://resources.premierleague.com/premierleague/badges/rb/t21.svg',
      'Wolverhampton Wanderers':'https://resources.premierleague.com/premierleague/badges/rb/t39.svg'
    }
    // console.log(typeof(dictImg))
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i];
      const existTeam  = await this.teamRepository.findOne({where: {name:obj.club.name}});
      if (!existTeam){
        // var logo : string = 'None'
        // if (obj.club.name !== undefined){
        //     var logo = dictImg[obj.club.name]
        //     // console.log(logo)
        // }
        await this.teamRepository.create({
          name: obj.club.name,
          abbr: obj.club.abbr,
          shortName: obj.club.shortName,
          logo : dictImg[obj.club.name]
        })
      }
      else {
        // console.log('Co vo day ',obj.club.name)
        type TeamField = keyof typeof fieldMapping;
        const fieldMapping = {
          name: obj.club.name,
          abbr: obj.club.abbr,
          shortName: obj.club.shortName,
        };
        const updatedFields: Partial<Team> = {};
        let updated = false;

        for (const field in fieldMapping) {
          const typedField = field as TeamField;
          if (existTeam[typedField] !== fieldMapping[typedField]) {
            updatedFields[typedField] = fieldMapping[typedField];
            updated = true;
          }
        } 
        if (updated) {
          await this.teamRepository.updateById(existTeam.id, updatedFields);
        }
      }
    }
    return
  }
}
