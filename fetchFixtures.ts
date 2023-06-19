import axios from "axios";
import moment from "moment";


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
  var allFixuresData : any= [];
  async function fetchData(page: number): Promise<void> {
    const urlSearchParams = new URLSearchParams({...queryParams, page: page.toString()});
    const url = `${baseUrl}?${urlSearchParams}`;

    try {
        const response = await axios.get(url, {
            headers: {
              'Origin': 'https://www.premierleague.com'
            }
          });
          const data = response.data;
          console.log(response.data.content)
          allFixuresData.concat(response.data.content)
          
      // Do something with the data, such as rendering it to the UI
    } catch (error) {
      console.error(error);
    }
  }
  


async function printData(fixuresData : any){
    for (let i = 0; i < fixuresData.length; i++){
        const obj =  fixuresData[i];
        console.log(`Number : ${i} - MatchID: ${obj.id} - Gameweek: ${obj.gameweek.gameweek} - Home: ${obj.teams[0].team.club.name} - Away: ${obj.teams[1].team.club.name}`)
    }
}
for (let page = 0; page < 20; page++) {
    fetchData(page);
}
printData(allFixuresData)
// const url = 'https://footballapi.pulselive.com/football/fixtures?comps=-1,1,4,5,2,3,2247&teams=127,1,2,130,131,43,4,6,7,34,10,163,11,12,23,15,18,21,25,38&compSeasons=578,540,505,499,520,528&page=0&pageSize=20&sort=asc&statuses=U,L&altIds=true&detail=2'
// fetchFixures(url);