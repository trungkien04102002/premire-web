import { Match } from './../models/match.model';
import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import moment from 'moment-timezone';
import { MatchRepository, MatchdayRepository, TeamRepository } from '../repositories';
import { Team,Matchday } from '../models';

interface FieldDictionary {
  [key: string]: number;
}

@injectable({scope: BindingScope.TRANSIENT})
export class MatchService {
  constructor(
    @repository(MatchRepository)
    public matchRepository : MatchRepository,
    @repository(TeamRepository)
    public teamRepository : TeamRepository,
    @repository(MatchdayRepository)
    public matchdayRepository :  MatchdayRepository
  ) {}
  public curIdLS : number = 1;

  async getAllMyTeamModels(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async getAllMyMatchDayModels(): Promise<Matchday[]> {
    return this.matchdayRepository.find();
  }

  public async getDictClub(): Promise<FieldDictionary> {
    const teams = await this.getAllMyTeamModels();
    const result: FieldDictionary = {};
    for (const team of teams) {
      if(team.name !== undefined && team.id !== undefined){
        result[team.name] = team.id;
        // console.log('IN DICTCLUB FUNCTION',result)
      }    
    }
    return result;
  }

  public async getDictDay(): Promise<FieldDictionary> {
    const days = await this.getAllMyMatchDayModels();
    const result: FieldDictionary = {};
    for (const day of days) {
      if(day.day !== undefined && day.id !== undefined){
        result[day.day] = day.id;
      }    
    }
    return result;
  }
  public async  convertToVietnamTime(dateString: string): Promise<[string, string]> {
    // Create a moment object from the input date string in the UTC timezone
    let m = moment.utc(dateString);
  
    // Convert the moment object to a Date object and format it in the Vietnam timezone
    let dateObj = m.toDate();
    let formattedDate = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('dddd DD/MM/YYYY');
    let formattedTime = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('H:mm');
  
    // Return the formatted date and time strings as a tuple
    return [formattedDate, formattedTime];
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
      // 'Leeds United':'https://resources.premierleague.com/premierleague/badges/rb/t2.svg' 
    }
    const dictClub = await this.getDictClub();
    const dictDay = await this.getDictDay();
    // console.log('DICT CLUB',dictClub)
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i]; 
      const id : number = obj.id; // => This is refId
      // const date_time  = await this.formatDateAndTime(obj.kickoff.label)
      const date = await this.formatDate(obj.kickoff.label)
      const [dayDisplay,timeDisplay] : [string,string] = await this.convertToVietnamTime(date)
      const existMatch  = await this.matchRepository.findOne({where:{refId : id}});
      if (!existMatch){
        await this.matchRepository.create({
          leagueSeasonId: this.curIdLS,
          matchDateISOS: date,
          // matchTime: date_time[1],
          homeId : dictClub[obj.teams[0].team.club.name],
          awayId : dictClub[obj.teams[1].team.club.name],
          refId: obj.id,  // => This is refId
          gameweek: obj.gameweek.gameweek,
          homeName: obj.teams[0].team.club.shortName,
          awayName: obj.teams[1].team.club.shortName,
          stadium: `${obj.ground.name}, ${obj.ground.city}`,
          time: timeDisplay,
          matchdayId: dictDay[dayDisplay],
          awayLogo: dictImg[obj.teams[1].team.club.name],
          homeLogo:dictImg[obj.teams[0].team.club.name]
        })
      }
      else {
        // console.log('The match have been added!')
      // console.log('Co vo day ',obj.club.name)
      type MatchField = keyof typeof fieldMapping;
        const fieldMapping = {
          matchDateISOS: date,
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
