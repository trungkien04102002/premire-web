import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { MatchdayRepository } from '../repositories';
import moment from 'moment-timezone';
interface FieldDictionary {
  [key: string]: number;
}
@injectable({scope: BindingScope.TRANSIENT})
export class MatchdayService {
  constructor(
    @repository(MatchdayRepository)
    public matchdayRepository : MatchdayRepository
  ) {}

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

  public async convertToVietnamTime(dateString: string): Promise<string> {
    let m = moment.utc(dateString);
    let dateObj = m.toDate();
    let formattedDate = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('dddd DD/MM/YYYY');
  
    // Return the formatted date string
    return formattedDate;
  }

  public async synchMatchDayDb(dataResponse: any) : Promise<void>{
    for (let i = 0; i < dataResponse.length; i++){
      const obj = dataResponse[i];
      const currDay =  await this.formatDate(obj.kickoff.label)
      const formatCurrDay = await this.convertToVietnamTime(currDay)
      const existDay = await this.matchdayRepository.findOne({where: {day: formatCurrDay}})
      if (!existDay){
        await this.matchdayRepository.create({
          day: formatCurrDay,
          gameweek: obj.gameweek.gameweek
        })
      }
    }
  }
  /*
   * Add service methods here
   */
}
