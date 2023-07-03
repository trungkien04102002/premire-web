import moment from 'moment-timezone';
import { format } from 'date-fns';
export function formatDate(dateString: string): string {
    let m = moment.tz(dateString, 'ddd DD MMM YYYY, HH:mm:ss z', 'Europe/London');
    let timestamp = m.valueOf();
    let dateObj = new Date(timestamp);
  
    // Format the date string
    let formattedDate = dateObj.toISOString();
  
    // Return the formatted date string
    return formattedDate;
    }

export function formatDateWithoutTime(dateString: string): string {
    // Format the date using date-fns library
    let date = new Date(dateString);
    let formattedDate = format(date, 'yyyy-MM-dd');
  
    // Return the formatted date string
    return formattedDate;
  }
  export function convertToVietnamTime(dateString: string): string {
    // Create a moment object from the input date string in the UTC timezone
    let m = moment.utc(dateString);
  
    // Convert the moment object to a Date object and format it in the Vietnam timezone
    let dateObj = m.toDate();
    let formattedDate = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('dddd DD/MM/YYYY');
  
    // Return the formatted date string
    return formattedDate;
  }


export function convertToVietnamTime1(dateString: string): [string, string] {
  // Create a moment object from the input date string in the UTC timezone
  let m = moment.utc(dateString);

  // Convert the moment object to a Date object and format it in the Vietnam timezone
  let dateObj = m.toDate();
  let formattedDate = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('dddd DD/MM/YYYY');
  let formattedTime = moment(dateObj).tz('Asia/Ho_Chi_Minh').format('H:mm');

  // Return the formatted date and time strings as a tuple
  return [formattedDate, formattedTime];
}
const test:string = formatDateWithoutTime('2023-08-11T19:00:00.000Z')
console.log(convertToVietnamTime1('2023-08-11T19:00:00.000Z'))