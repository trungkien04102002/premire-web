import { WebApplication } from "../application";
import { migrateTeam } from './teamMigration';
import { migrateStadium } from './stadiumMigration';
import { migrateLST } from './leagueSeasonTeamMigration';
import { migrateMatch } from './matchMigration';
export async function syncDatabaseSystem(app : WebApplication) {
    const date = new Date();
    const folderName = `data-${date.getTime()}`;
    await migrateTeam(app,folderName);
    await migrateStadium(app,folderName);
    await migrateLST(app);
    await migrateMatch(app,folderName);
}