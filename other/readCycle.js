/*function readJsonData() {
  fetch("https://school-timer-design.vercel.app/cycle.json", { cache: "reload" })
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
  setTimeout(readJsonData, 60*1000);
}

readJsonData();
*/