import { DataFetchService } from './../services/data-fetch.service';
import { WebApplication } from "../application";
import { MatchService, MatchdayService } from '../services';

export async function migrateMatchDay(app: WebApplication, folderName: string) : Promise<void> {
    const dataFetchService : DataFetchService =  await app.get('services.DataFetchService');
    const matchdayService : MatchdayService = await app.get('services.MatchdayService');
    const matchDayData = await dataFetchService.fetchFixures(folderName,'matchDayData.json');
    await matchdayService.synchMatchDayDb(matchDayData);
    console.log('FINISH MIGRATE MATCHDAY');
    return  
}