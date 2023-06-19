import { Match } from './../models/match.model';
import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import moment from 'moment-timezone';
import { MatchRepository, TeamRepository } from '../repositories';
import { Team } from '../models';

interface FieldDictionary {
  [key: string]: number;
}

@injectable({scope: BindingScope.TRANSIENT})
export class MatchService {
  constructor(
    @repository(MatchRepository)
    public matchRepository : MatchRepository,
    @repository(TeamRepository)
    public teamRepository : TeamRepository
  ) {}
  public curIdLS : number = 1;
  // public async find(
  //   @param.filter(Team) filter?: Filter<Team>,
  // ): Promise<Team[]> {
  //   return this.teamRepository.find(filter);
  // }

  async getAllMyModels(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  public async getDictClub(): Promise<FieldDictionary> {
    const teams = await this.getAllMyModels();
    const result: FieldDictionary = {};
    for (const team of teams) {
      if(team.name !== undefined && team.id !== undefined){
        result[team.name] = team.id;
        // console.log('IN DICTCLUB FUNCTION',result)
      }    
    }
    return result;
  }

  public async formatDate(dateString: string): Promise<string> {
    // Convert the timestamp to a Date object
    let m = moment.tz(dateString, 'ddd DD MMM YYYY, HH:mm:ss z', 'Europe/London');
    let timestamp = m.valueOf();
    let dateObj = new Date(timestamp);
  
    // Format the date string
    let formattedDate = dateObj.toISOString();
  
    // Return the formatted date string
    return formattedDate;
  }

  public async formatDateAndTime(dateString: string): Promise<[string, string]> {
    // Convert the timestamp to a Date object
    let m = moment.tz(dateString, 'ddd DD MMM YYYY, HH:mm:ss z', 'Europe/London');
    let timestamp = m.valueOf();
    let dateObj = new Date(timestamp);
  
    // Get the date and time components
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    let hours = String(dateObj.getHours()).padStart(2, '0');
    let minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
    // Format the date and time strings
    let formattedDate = `${day}/${month}/${year} `;
    let formattedTime = `${hours}:${minutes}`;
  
    // Return the tuple string
    return [formattedDate, formattedTime];
  }

  public async synchMatchDb(dataResponse: any) : Promise<void>{
    const dictClub = await this.getDictClub();
    // console.log('DICT CLUB',dictClub)
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i]; 
      const id : number = obj.id; // => This is refId
      // const date_time  = await this.formatDateAndTime(obj.kickoff.label)
      const date = await this.formatDate(obj.kickoff.label)
      const existMatch  = await this.matchRepository.findOne({where:{refId : id}});
      if (!existMatch){
        await this.matchRepository.create({
          leagueSeasonId: this.curIdLS,
          matchDate: date,
          // matchTime: date_time[1],
          homeId : dictClub[obj.teams[0].team.club.name],
          awayId : dictClub[obj.teams[1].team.club.name],
          refId: obj.id,  // => This is refId
          gameweek: obj.gameweek.gameweek
        })
      }
      else {
        // console.log('The match have been added!')
      // console.log('Co vo day ',obj.club.name)
      type MatchField = keyof typeof fieldMapping;
        const fieldMapping = {
          matchDate: date,
          // matchTime: date_time[1],
        };
        const updatedFields: Partial<Match> = {};
        let updated = false;

        for (const field in fieldMapping) {
          const typedField = field as MatchField;
          if (existMatch[typedField] !== fieldMapping[typedField]) {
            updatedFields[typedField] = fieldMapping[typedField];
            updated = true;
          }
        } 
        if (updated) {
          await this.matchRepository.updateById(existMatch.id, updatedFields);
          }
      }
    }
    return
  }
}
