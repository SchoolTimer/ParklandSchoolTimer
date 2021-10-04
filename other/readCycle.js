function getDate() //gets the date
{
  let  today = new Date();
  let  dd = String(today.getDate()).padStart(2, '0');
  let  mm = String(today.getMonth() + 1).padStart(2, '0');
  let  yyyy     = today.getFullYear();
  return mm + '-' + dd + '-' + yyyy;
}

function readJsonData() {
  date = getDate(); //gets the date from the function from above
  console.log(date)
  
  fetch("https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/" + date, { cache: "reload" })

    .then(response => response.json())
    .then(data => {
      if (data.today == unedfined) {
        data.today = 'N/A';
      }
      document.getElementById("cycleDayOutput").innerHTML = data.today; 
      document.getElementById("cycleDayToday").innerHTML = data.today;
      document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
      document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;
    });
  setTimeout(readJsonData, 60*12*60*1000);
}
readJsonData();