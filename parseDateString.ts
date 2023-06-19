import moment from 'moment-timezone';

export function parseDateString(dateString: string): number {
    let m = moment.tz(dateString, 'ddd DD MMM YYYY, HH:mm:ss z', 'Europe/London');
    let timestamp = m.valueOf();
    return timestamp;
}

function formatDateAndTime(timestamp: number): [string, string] {
  // Convert the timestamp to a Date object
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
let dateString = 'Sat 12 Aug 2023, 12:30 BST';
let timestamp = parseDateString(dateString);
let date = formatDateAndTime(timestamp)
console.log(timestamp);
console.log(date)