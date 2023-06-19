import { Team } from "../models";
import { DataFetchService } from './../services/data-fetch.service';
import { WebApplication } from "../application";
import { TeamService } from "../services";

export async function migrateTeam(app : WebApplication, folderName : string ) : Promise<void> {
    const dataFetchService : DataFetchService =  await app.get('services.DataFetchService');
    const teamService : TeamService =  await app.get('services.TeamService');
    const url : string= 'https://footballapi.pulselive.com/football/compseasons/578/teams'
    // const url : string = 'http://localhost:5000/api/teams'
    const teamData = await dataFetchService.fetchAndStore(folderName, 'teamsData.json', url);
    // console.log('teamData when call syncTeamData function;',teamData)
    await teamService.synchTeamDb(teamData);
    console.log('FINISH MIGRATE TEAM');
    return
}