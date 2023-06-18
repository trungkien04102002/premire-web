import { Stadium } from '../models';
import { DataFetchService } from './../services/data-fetch.service';
import { WebApplication } from "../application";
import { StadiumService } from '../services';

export async function migrateStadium(app : WebApplication, folderName : string ) : Promise<void> {
    const dataFetchService : DataFetchService =  await app.get('services.DataFetchService');
    const stadiumService : StadiumService =  await app.get('services.StadiumService');
    const url : string= 'https://footballapi.pulselive.com/football/compseasons/578/teams'
    // const url : string = 'http://localhost:5000/api/teams'
    const stadiumData = await dataFetchService.fetchAndStore(folderName, 'stadiumsData.json', url)
    // console.log('teamData when call syncTeamData function;',teamData)
    await stadiumService.synchStadiumDb(stadiumData);
    console.log('FINISH MIGRATE STADIUM')
    return
}