import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import { TeamService } from './team.service';
import * as fs from 'fs';  
import fetch from "node-fetch";
@injectable({scope: BindingScope.TRANSIENT})
export class DataFetchService {
  constructor(
    @inject('TeamService')
    public teamService : TeamService,
  ) {}
  public async fetchAndStore(folderName : string, fileName : string,url : string) : Promise<any>{
    fs.mkdirSync(folderName);
    const response = await fetch(url.toString());
    const data = await response.json();
    console.log('teamData when call fetchAndStore function;',data)
    const folderPath = `storage/${folderName}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save to file 
    fs.writeFileSync(`${folderPath}/${fileName.toString()}`, JSON.stringify(data));
    console.log('Finish fetching data and saving file' + fileName.toString())
    return data
  }

}
