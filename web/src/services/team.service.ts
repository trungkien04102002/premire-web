import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Team } from '../models';
import { TeamRepository } from '../repositories';
import { repository } from '@loopback/repository';
@injectable({scope: BindingScope.TRANSIENT})
export class TeamService {
  constructor(
    @repository(TeamRepository)
    public teamRepository : TeamRepository
  ) {}
  async synchTeamDb(dataResponse: any) : Promise<void>{
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i];
      const existTeam  = await this.teamRepository.findOne({where: {name:obj.club.name}});
      if (!existTeam){
        await this.teamRepository.create({
          name: obj.club.name,
          abbr: obj.club.abbr,
          shortName: obj.club.shortName,
          logo: 'None'
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
