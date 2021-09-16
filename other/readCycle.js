function readJsonData() {
  fetch("https://613aad1a110e000017a45364.mockapi.io/dayCycle", { cache: "reload" })
    .then(response => response.json())
    .then(data => {
      if (data.today.slice(-1) == 'E') {
        setNew('E');
      }
      console.log(data);
      document.getElementById("cycleDayOutput").innerHTML = data.today;

      document.getElementById("cycleDayToday").innerHTML = data.today;
      document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
      document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;

    //  document.getElementById('lastUpdated').innerHTML = 'Last Updated: ' + curHour + ':' + curMin;
    });
  setTimeout(readJsonData, 12*60*60*1000);
}

readJsonData();
