import { repository } from '@loopback/repository';
import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import { TeamService } from './team.service';
import * as fs from 'fs';  

const axios = require('axios');
interface QueryParams {
  [key: string]: string | number | boolean;
}
interface FixtureData {}

interface ApiResponse {
  content: FixtureData[];  
} 
@injectable({scope: BindingScope.TRANSIENT})
export class DataFetchService {
  constructor(
    @inject('services.TeamService')
    public teamService : TeamService, 
  ) {}
  
  public async fetchAndStore(folderName : string, fileName : string,url : string) : Promise<any>{
    try {
      const response = await axios.get(url, {
        headers: {
          'Origin': 'https://www.premierleague.com'
        }
      });
      const data = response.data;
      // console.log(data);
      return data;
    }
    catch(error){
      throw new Error('Fail to fetchAndStore')
    }
  }

  public async  fetchFixures(folderName : string, fileName : string) : Promise<FixtureData[]>{
    let allFixturesData: FixtureData[] = [];
    const baseUrl = 'https://footballapi.pulselive.com/football/fixtures';
    const queryParams: QueryParams = {
      comps: '-1,1,4,5,2,3,2247',
      teams: '127,1,2,130,131,43,4,6,7,34,10,163,11,12,23,15,18,21,25,38',
      compSeasons: '578,540,505,499,520,528',
      pageSize: 20,
      sort: 'asc',
      statuses: 'U,L',
      altIds: true,
      detail: 2
    };
    var idx = 1;
    for (let page = 0; page < 19; page++){
        const urlSearchParams = new URLSearchParams({...queryParams, page: page.toString()});
        const url = `${baseUrl}?${urlSearchParams}`;
        try {
            const response = await axios.get(url, {
                headers: {
                  'Origin': 'https://www.premierleague.com'
                }
              });
              const data = response.data;
              for (let i = 0; i < data.content.length; i++){
                allFixturesData.push(data.content[i])
            }
        } catch (error) {
          console.error(error);
        }
    }
    return allFixturesData;
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
