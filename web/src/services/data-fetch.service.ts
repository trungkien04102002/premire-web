import { repository } from '@loopback/repository';
import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import { TeamService } from './team.service';
import * as fs from 'fs';  
import fetch from "node-fetch";
const axios = require('axios');

@injectable({scope: BindingScope.TRANSIENT})
export class DataFetchService {
  constructor(
    @inject('services.TeamService')
    public teamService : TeamService,
  ) {}
  public async fetchAndStore(folderName : string, fileName : string,url : string) : Promise<any>{
    try {
      const response = await axios.get('https://footballapi.pulselive.com/football/compseasons/578/teams', {
        headers: {
          'Origin': 'https://www.premierleague.com'
        }
      });
      const data = response.data;
      console.log(data)
    }
   
    catch(error){
      throw new Error('Fail to fetchAndStore')
    }
  }
}

// @injectable({scope: BindingScope.TRANSIENT})
// export class DataFetchService {
//   constructor(
//     @inject('services.TeamService')
//     public teamService : TeamService,
//   ) {}
//   public async fetchAndStore(folderName : string, fileName : string,url : string) : Promise<any>{
//     fs.mkdirSync(folderName);
//     const response = await fetch(url, {
//       headers: {
//         'Origin': 'https://www.premierleague.com/'
//       }
//     });
//     // const response = await fetch(url)
//     // const data = await response.json();
//     const data = response
//     console.log('teamData when call fetchAndStore function;',data)
//     const folderPath = `storage/${folderName}`;

//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath, { recursive: true });
//     }

//     // Save to file 
//     fs.writeFileSync(`${folderPath}/${fileName.toString()}`, JSON.stringify(data));
//     console.log('Finish fetching data and saving file' + fileName.toString())
//     return data
//   }
// }
