// function readJsonData() {

//   fetch("https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/1", { cache: "reload" })

//     .then(response => response.json())
//     .then(data => {
//       document.getElementById("cycleDayOutput").innerHTML = data.today;
//       document.getElementById("cycleDayToday").innerHTML = data.today;
//       document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
//       document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;
//       // document.getElementById("currentSchedule").innerHTML = data.currentSchedule;

//     });

//   setTimeout(readJsonData, 60*12*60*1000);
// }
// readJsonData();

// var currentDay = "dd-df-";

// fetch('https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/1')
//   .then(res => res.json())
//   .then(data => {
//     console.log(data.today)
//     console.log(data.tomorrow)
//     console.log(data.nextDay)
//     // console.log(data.currentSchedule)
//     global = data.currentSchedule
//   })
//   .catch(error => console.log('ERROR'))

// console.log(global);

// async function funcName(){
//   const response = await fetch('https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/1');
//   var data = await response.json();
//   // console.log(data)
//   // document.getElementById("cycleDayOutput").innerHTML = data.today;
//   // document.getElementById("cycleDayToday").innerHTML = data.today;
//   // document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
//   // document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;
//   currentDay = data.currentSchedule;
//   return currentDay;

// }

function readJsonData() {
  // Use the shared combined API fetch to avoid multiple requests
  window.SchoolTimerAPI.fetchCombinedData()
    .then((combined) => {
      var dc = combined.daycycle || {};
      document.getElementById("cycleDayOutput").innerHTML = dc.today || "-";
      document.getElementById("cycleDayToday").innerHTML = dc.today || "-";
      document.getElementById("cycleDayTomorrow").innerHTML =
        dc.tomorrow || "-";
      document.getElementById("cycleDayNextDay").innerHTML = dc.next_day || "-";
    })
    .catch((error) => {
      console.error("Error fetching daycycle data:", error);
      // Display dash for all day cycle elements when API fails
      document.getElementById("cycleDayOutput").innerHTML = "-";
      document.getElementById("cycleDayToday").innerHTML = "-";
      document.getElementById("cycleDayTomorrow").innerHTML = "-";
      document.getElementById("cycleDayNextDay").innerHTML = "-";
    });

  setTimeout(readJsonData, 60 * 12 * 60 * 1000);
}
readJsonData();
