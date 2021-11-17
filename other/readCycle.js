function readJsonData() {
  
  fetch("https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/1", { cache: "reload" }) 

    .then(response => response.json())
    .then(data => {
      document.getElementById("cycleDayOutput").innerHTML = data.today; 
      document.getElementById("cycleDayToday").innerHTML = data.today;
      document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
      document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;
    });

  setTimeout(readJsonData, 60*12*60*1000);
}
readJsonData();