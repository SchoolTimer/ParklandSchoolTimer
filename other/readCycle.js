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
  
  fetch("https://613aad1a110e000017a45364.mockapi.io/dayCycleBeta/1", { cache: "reload" }) 

    .then(response => response.json())
    .then(data => {
      document.getElementById("cycleDayOutput").innerHTML = data.today; 
      document.getElementById("cycleDayToday").innerHTML = data.today;
      document.getElementById("cycleDayTomorrow").innerHTML = data.tomorrow;
      document.getElementById("cycleDayNextDay").innerHTML = data.nextDay;
      document.getElementById("currentMonth").innerHTML = data.month;
      // document.getElementById("currentSchedule").innerHTML = data.currentSchedule;
    });

  setTimeout(readJsonData, 60*12*60*1000);
}
readJsonData();