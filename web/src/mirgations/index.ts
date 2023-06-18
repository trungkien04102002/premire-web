import { DataFetchService } from './../services/data-fetch.service';
import { WebApplication } from "../application";
import { migrateTeam } from './teamMigration';
import { migrateStadium } from './stadiumMigration';
export async function syncDatabaseSystem(app : WebApplication) {
    const date = new Date();
    const folderName = `data-${date.getTime()}`;
    await migrateTeam(app,folderName)
    await migrateStadium(app,folderName)
}