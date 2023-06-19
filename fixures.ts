import axios from "axios";
import moment from "moment-timezone";

export  async function formatDateAndTime(dateString: string): Promise<[string, string]> {
    // Convert the timestamp to a Date object
    let m = moment.tz(dateString, 'ddd DD MMM YYYY, HH:mm:ss z', 'Europe/London');
    let timestamp = m.valueOf();
    let dateObj = new Date(timestamp);
  
    // Get the date and time components
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    let hours = String(dateObj.getHours()).padStart(2, '0');
    let minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
    // Format the date and time strings
    let formattedDate = `${day}/${month}/${year} `;
    let formattedTime = `${hours}:${minutes}`;
  
    // Return the tuple string
    return [formattedDate, formattedTime];
  }

interface QueryParams {
    [key: string]: string | number | boolean;
}
interface FixtureData {}
  
interface ApiResponse {
    content: FixtureData[];  
}
  
async function fetchFixures() : Promise<FixtureData[]>{
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
                // const obj =  data.content[i];
                // const date_time  = await formatDateAndTime(obj.kickoff.label)
                // console.log(`Number : ${idx} - MatchID: ${obj.id} - Gameweek: ${obj.gameweek.gameweek} - Home: ${obj.teams[0].team.club.name} - Away: ${obj.teams[1].team.club.name} - Date: ${date_time[0]} - Time: ${date_time[1]}`);
                // idx++;
            }
        } catch (error) {
          console.error(error);
        }
    }
    return allFixturesData;
}

async function printData(fixuresData : any){
    for (let i = 0; i < fixuresData.length; i++){
        const obj =  fixuresData[i];
        const date_time  = await formatDateAndTime(obj.kickoff.label)
        console.log(`Number : ${i} - MatchID: ${obj.id} - Gameweek: ${obj.gameweek.gameweek} - Home: ${obj.teams[0].team.club.name} - Away: ${obj.teams[1].team.club.name} - Date: ${date_time[0]} - Time: ${date_time[1]}`);
    }
}
async function run(){
    const data = await fetchFixures();
    await printData(data);
}

run();
