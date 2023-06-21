import { Stadium } from './../models/stadium.model';
import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { StadiumRepository, TeamRepository } from '../repositories';
import { repository } from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class StadiumService {
  constructor(
    @repository(StadiumRepository)
    public stadiumRepository : StadiumRepository,
    @repository(TeamRepository)
    public teamRepository : TeamRepository
  ) {}
  async synchStadiumDb(dataResponse: any) : Promise<void>{
  
    for (let i = 0; i < dataResponse.length; i++){
      // console.log(dataResponse[10].grounds[0].name)
      // console.log(dataResponse[10].grounds[0].name)
      const obj = dataResponse[i];
      if(dataResponse[i].grounds.length === 0){
        console.log('No tham gia!')
        continue;
      }
      else {
        const nameStadium = obj.grounds[0].name;
        const existStadium  = await this.stadiumRepository.findOne({where: {name:nameStadium}});
        if(existStadium === null){
          // console.log('Access',existStadium.name)
          const nameClub : string = obj.club.name;
          // let team: Team | null = await this.teamRepository.findOne({where: {name : nameClub }})
          let team  = await this.teamRepository.findOne({where: {name : nameClub }})
          if (team === null){
            throw new Error('Cannot find this owner stadium!')
          } 
          else {
            let capacity : number =  30460;
            if(obj.grounds[0].capacity){
              capacity = obj.grounds[0].capacity
            }
            await this.stadiumRepository.create({
              name: obj.grounds[0].name,
              city: obj.grounds[0].city,
              capacity,
              teamId: team.id 
            })
          }
        }
        else {
          // console.log('Co bi trung nhe')
        }
      }
      
    }
    console.log('Success update the stadium!')
    return
  }
}
