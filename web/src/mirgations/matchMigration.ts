import { DataFetchService } from './../services/data-fetch.service';
import { WebApplication } from "../application";
import { MatchService } from '../services';

export async function migrateMatch(app: WebApplication, folderName: string) : Promise<void> {
    const dataFetchService : DataFetchService =  await app.get('services.DataFetchService');
    const matchService : MatchService = await app.get('services.MatchService');
    const matchData = await dataFetchService.fetchFixures(folderName,'matchsData.json');
    await matchService.synchMatchDb(matchData);
    console.log('FINISH MIGRATE MATCH');
    return  
}