import { LeagueSeasonTeamService } from './../services/league-season-team.service';
import { WebApplication } from "../application";
export async function migrateLST(app : WebApplication): Promise<void>{
    const lstService : LeagueSeasonTeamService = await app.get('services.LeagueSeasonTeamService');
    await lstService.synchLSTeamDb();
    console.log('FINISH MIGRATE LST');
    return
}