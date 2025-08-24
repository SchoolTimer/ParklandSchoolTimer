// var currentDay = 'E';

// SNOW EFFECT
/*document.addEventListener('DOMContentLoaded', function(){ //Snow effect JS
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.onload = function(){
      particlesJS("snow", {
          "particles": {
              "number": {
                  "value": 60,
                  "density": {
                      "enable": true,

                      
                      "value_area": 900
                  }
              },
              "color": {
                  "value": "#ffffff"
              },
              "opacity": {
                  "value": 0.7, 
                  "random": false,
                  "anim": {
                      "enable": false
                  }
              },
              "size": {
                  "value": 5,
                  "random": true,
                  "anim": {
                      "enable": false
                  }
              },
              "line_linked": {
                  "enable": false
              },
              "move": {
                  "enable": true,
                  "speed": 5,
                  "direction": "bottom",
                  "random": true,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                      "enable": true,
                      "rotateX": 300,
                      "rotateY": 1200
                  }
              }
          },
          "interactivity": {
              "events": {
                  "onhover": {
                      "enable": false
                  },
                  "onclick": {
                      "enable": false
                  },
                  "resize": false
              }
          },
          "retina_detect": true
      });
  }
  document.head.append(script);
});*/

// RAIN EFFECT

function openMenuPanel() {
  document.getElementById("menuPanel").style.left = "50%";
  document.getElementById("everythingElse").style.filter = "blur(2px)";
  uisound();
}
function closeMenuPanel() {
  document.getElementById("menuPanel").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";
  //$('#septemba').html('<audio autoplay><source src="sounds/september.mp3"></audio>');
  uisound();
}

// takes care of the quick update panel
function openUpdatePanel() {
  localStorage.removeItem("ReadMessage");
  localStorage.removeItem("febUpdate");
  localStorage.removeItem("downUpdate");
  localStorage.removeItem("newMsg");
  // Remove old localStorage item if it exists
  localStorage.removeItem("bigupdate-sept6-2022");
  // const check = localStorage.getItem('discordUpdate');
  const check = localStorage.getItem("school-timer-2025-2026-update");
  if (check == "read") {
    document.getElementById("UpdatePanel").style.left = "-50%";
    document.getElementById("everythingElse").style.filter = "blur(0px)";
  } else {
    document.getElementById("UpdatePanel").style.left = "50%";
    document.getElementById("everythingElse").style.filter = "blur(2px)";
    // uisound();
  }
}

function closeUpdatePannel() {
  document.getElementById("UpdatePanel").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";
  //$('#septemba').html('<audio autoplay><source src="sounds/september.mp3"></audio>');
  uisound();
  localStorage.removeItem("ReadMessage");
  localStorage.removeItem("newMsg");
  localStorage.removeItem("febUpdate");
  localStorage.removeItem("downUpdate");
  localStorage.removeItem("keystoneUpdate");
  localStorage.setItem("school-timer-2025-2026-update", "read");
  // localStorage.setItem('discordUpdate', 'read');
}

var currentScheduleSelected = "A";
// var currentScheduleSelected = currentDay;
var numberOfPeriods = 9; // Default number of periods

var scheduleArray = [
  "startTimesA",
  "startTimesB",
  "startTimesC",
  "startTimesD",
];

// // 3-Hr Delay Keystone Schedule timings
// var startTimesA = ['' + '10:40', '11:08', '11:35', '12:02', '12:30', '12:58', '13:26', '13:54', '14:21'];
// var endTimesA = ['' + '11:04', '11:31', '11:58', '12:26', '12:54', '13:22', '13:50', '14:17', '14:44'];

// Current timing for A schedule for the countdown timer
var startTimesA = [
  "" + "07:40",
  "08:33",
  "09:21",
  "10:09",
  "10:57",
  "11:45",
  "12:33",
  "13:21",
  "14:09",
];
var endTimesA = [
  "" + "08:29",
  "09:17",
  "10:05",
  "10:53",
  "11:41",
  "12:29",
  "13:17",
  "14:05",
  "14:53",
];

/*
var startTimesA = ['' + '07:40', '08:32', '09:19', '10:06', '10:49', '11:32', '12:15', '13:58', '14:02'];
var endTimesA = ['' + '08:28', '09:15', '10:02', '10:45', '11:28', '12:11', '12:54', '13:58', '14:44'];
*/

// Current timing for B schedule for the countdown timer
var startTimesE = [
  "" + "07:40",
  "07:54",
  "08:41",
  "09:28",
  "10:15",
  "11:02",
  "11:49",
  "12:36",
  "13:23",
  "14:10",
];
var endTimesE = [
  "" + "07:50",
  "08:37",
  "09:24",
  "10:11",
  "10:58",
  "11:45",
  "12:32",
  "13:19",
  "14:06",
  "14:53",
];

// Current timing for C schedule for the countdown timer
var startTimesC = ["" + "07:40", "08:24", "09:04", "09:44", "10:24"];
var endTimesC = ["" + "08:20", "09:00", "09:40", "10:20", "11:00"];

// Current timing for D schedule for the countdown timer
var startTimesD = [
  "" + "09:40",
  "10:13",
  "10:43",
  "11:13",
  "11:47",
  "12:21",
  "12:55",
  "13:29",
  "14:13",
];
var endTimesD = [
  "" + "10:09",
  "10:39",
  "11:09",
  "11:43",
  "12:17",
  "12:51",
  "13:25",
  "14:09",
  "14:53",
];

var activeTimers = [];
var filteredActive = [];

var prevMargin, newMargin;
var doMargin = true;

create();

function create() {
  var container = document.getElementById("timers");
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }

  for (var i = 0; i < numberOfPeriods + 1; i++) {
    if (i == 0) {
      var box = document.createElement("div");
      box.id = "firstContainer";

      var schoolTitle = document.createElement("div");
      schoolTitle.id = "schoolTitle";
      schoolTitle.innerHTML = "School Timer";

      box.appendChild(schoolTitle);
      container.appendChild(box);
    } else {
      var box = document.createElement("div");
      box.className = "timer  shadows";

      if (i == 1) {
        box.id = "secondContainer";
      }

      var header = document.createElement("h2");

      header.innerHTML = suffix(i) + " Period";
      header.className = "timerText";

      var table = document.createElement("table");

      var row1 = document.createElement("tr");

      var startLabel = document.createElement("th");
      var endLabel = document.createElement("th");

      startLabel.innerHTML = "Start: ";
      startLabel.className = "thatLabelThing thatStartThing timerText";

      endLabel.innerHTML = "End: ";
      endLabel.className = "thatLabelThing thatEndThing timerText";

      var row2 = document.createElement("tr");

      var start = document.createElement("td");
      var end = document.createElement("td");

      start.innerHTML = "00:54:31";
      start.id = i - 1 + "start";
      start.className = "startActual timerText";

      end.innerHTML = "00:32:31";
      end.id = i - 1 + "end";
      end.className = "endActual timerText";

      row1.appendChild(startLabel);
      row1.appendChild(start);
      row1.appendChild(endLabel);
      row1.appendChild(end);

      table.appendChild(row1);
      table.appendChild(row2);

      box.appendChild(header);
      box.appendChild(table);

      container.appendChild(box);

      $("#firstContainer").css("height", $("#secondContainer").height() + 20);
    }
  }
}

var startTimes = [];
var endTimes = [];

var startStatus = [];
var endStatus = [];

setSchedule();

function setNew(sched) {
  currentScheduleSelected = sched;
  setSchedule();
}

function setSchedule() {
  var remSchedual = localStorage.getItem("currentScheduleSelected");
  activeTimers = [];
  doMargin = true;

  var order = ["A", "E", "C", "D"];

  switch (currentScheduleSelected) {
    case "A":
      startTimes = startTimesA;
      endTimes = endTimesA;
      numberOfPeriods = startTimesA.length;
      break;
    case "E":
      startTimes = startTimesE;
      endTimes = endTimesE;
      numberOfPeriods = startTimesE.length;
      break;
    case "C":
      startTimes = startTimesC;
      endTimes = endTimesC;
      numberOfPeriods = startTimesC.length;
      break;
    case "D":
      startTimes = startTimesD;
      endTimes = endTimesD;
      numberOfPeriods = startTimesD.length;
      break;
  }

  // Prefill active timers so layout sizing uses the correct count immediately
  activeTimers = new Array(numberOfPeriods).fill(true);

  // Recreate the timer display with the correct number of periods
  create();

  // Ensure special labels (e.g., HR for B schedule) are applied
  updatePeriodLabels();

  document.getElementById(currentScheduleSelected + "in").style.display =
    "block";
  for (var i = 0; i < order.length; i++) {
    if (order[i] !== currentScheduleSelected) {
      document.getElementById(order[i] + "in").style.display = "none";
    }
  }
  localStorage.setItem("currentScheduleSelected", currentScheduleSelected);
}

function updatePeriodLabels() {
  // Special handling for HR period in B ("E") schedule
  if (currentScheduleSelected === "E") {
    var timerHeaders = document.querySelectorAll(".timer h2");
    if (!timerHeaders || timerHeaders.length === 0) {
      return;
    }

    // First card is Homeroom
    timerHeaders[0].innerHTML = "Homeroom";

    // Remaining cards should be 1st..9th Period
    for (var i = 1; i < timerHeaders.length; i++) {
      timerHeaders[i].innerHTML = suffix(i) + " Period";
    }
    return;
  }

  // Special labeling for C schedule: periods 1,2,3,8,9
  if (currentScheduleSelected === "C") {
    var timerHeadersC = document.querySelectorAll(".timer h2");
    if (!timerHeadersC || timerHeadersC.length === 0) {
      return;
    }
    var cPeriodNumbers = [1, 2, 3, 8, 9];
    for (
      var j = 0;
      j < timerHeadersC.length && j < cPeriodNumbers.length;
      j++
    ) {
      timerHeadersC[j].innerHTML = suffix(cPeriodNumbers[j]) + " Period";
    }
    return;
  }
}

(function () {
  var start = new Date();

  function tick() {
    getItems();
    for (var i = 0; i < numberOfPeriods; i++) {
      start.setHours(
        startTimes[i].substring(0, 2),
        startTimes[i].substring(3, 5),
        0
      );

      var now = new Date();
      if (now > start) {
        // too late, go to tomorrow
        start.setDate(start.getDate() + 1);
      }

      var remain = (start - now) / 1000;
      var hh = pad((remain / 60 / 60) % 60);
      var mm = pad((remain / 60) % 60);
      var ss = pad(remain % 60);

      if (hh >= 24) {
        hh = hh - 24;
      }

      if (hh.toString().length == 1) {
        hh = "0" + hh;
      }

      if (hh >= 10) {
        document.getElementById(i + "start").innerHTML = "------------";
        startStatus[i] = true;
      } else {
        document.getElementById(i + "start").innerHTML =
          hh + ":" + mm + ":" + ss;
        startStatus[i] = false;
      }
    }
    setTimeout(tick, 100);
  }

  var doTitle = [];

  function tick2() {
    for (var i = 0; i < numberOfPeriods; i++) {
      start.setHours(
        endTimes[i].substring(0, 2),
        endTimes[i].substring(3, 5),
        0
      );

      var now = new Date();
      if (now > start) {
        // too late, go to tomorrow
        start.setDate(start.getDate() + 1);
      }

      var remain = (start - now) / 1000;
      var hh = pad((remain / 60 / 60) % 60);
      var mm = pad((remain / 60) % 60);
      var ss = pad(remain % 60);

      if (hh >= 24) {
        hh = hh - 24;
      }

      if (hh.toString().length == 1) {
        hh = "0" + hh;
      }

      var currentTimer = document.getElementsByClassName("timer");

      var startHeight = 0;

      startHeight = 0;

      if (hh >= 11) {
        if (i == 2) {
          // console.log(hh);
        }
        //  console.log(curMin / 60 + curHour)
        document.getElementById(i + "end").innerHTML = "------------";
        currentTimer[i].style.color = localStorage.getItem(
          "customTimerTextDeactive"
        );
        currentTimer[i].style.border = "0.5vh solid transparent";
        currentTimer[i].style.display = "none";

        if (i == 8) {
          document.getElementById("schoolOver").style.display = "block";
          document.getElementById("timers").style.display = "none";
        }

        var schoolDayProgress = document.getElementById("progressInner");
        schoolDayProgress.style.width = 100 + "%";

        var schoolDayProgressLabel =
          document.getElementById("dayProgressLabel");
        schoolDayProgressLabel.innerHTML = 100 + "%";
        endStatus[i] = true;
        doTitle[i] = true;
        activeTimers[i] = null;
      } else {
        if (i == 8) {
          document.getElementById("schoolOver").style.display = "none";
          document.getElementById("timers").style.display = "block";
        }
        activeTimers[i] = true;
        endStatus[i] = false;
        var myFilterArray = activeTimers.filter(Boolean);
        if (i == 9 - myFilterArray.length) {
          document.title = hh + ":" + mm + ":" + ss;
        }
        if (startStatus[i] == true && endStatus[i] == false) {
          var currentTimer = document.getElementsByClassName("timer");
          currentTimer[i].style.border =
            "0.5vh solid " + localStorage.getItem("accent");
          currentTimer[i].style.color = localStorage.getItem(
            "customTimerTextActive"
          );
          currentTimer[i].style.display = "inline-block";

          doTitle[i] = false;
        } else {
          var currentTimer = document.getElementsByClassName("timer");
          currentTimer[i].style.border = "0.5vh solid transparent";
          currentTimer[i].style.color = localStorage.getItem(
            "customTimerTextActive"
          );
          currentTimer[i].style.display = "inline-block";
          doTitle[i] = true;
        }

        document.getElementById(i + "end").innerHTML = hh + ":" + mm + ":" + ss;

        var supposed = new Date().setHours(
          startTimes[0].substring(0, 2),
          startTimes[0].substring(3, 5),
          0
        );

        var nownow = new Date();
        // Determine the last period's end time dynamically (supports schedules with < 9 periods)
        var lastIndex = endTimes.length - 1;
        var endSchool = new Date().setHours(
          endTimes[lastIndex].substring(0, 2),
          endTimes[lastIndex].substring(3, 5),
          0
        );
        var diffMs = endSchool - nownow;

        var supposedVal = endSchool - supposed;

        var percent = (((diffMs / supposedVal) * 100 - 100) * -1).toFixed(1);

        if (percent == undefined || percent == "" || percent == null) {
          percent = 0;
        } else if (percent > 100) {
          percent = 100;
        } else if (percent < 0) {
          percent = 0;
        }

        var schoolDayProgress = document.getElementById("progressInner");
        schoolDayProgress.style.width = percent + "%";

        var schoolDayProgressLabel =
          document.getElementById("dayProgressLabel");
        schoolDayProgressLabel.innerHTML = percent + "%";
      }
    }
    setTimeout(tick2, 100);
  }

  document.addEventListener("DOMContentLoaded", tick);
  document.addEventListener("DOMContentLoaded", tick2);
  document.addEventListener("DOMContentLoaded", statsHandler);
})();

function pad(num) {
  return ("0" + parseInt(num)).substr(-2);
}

function setTimerHeights() {
  prevMargin = newMargin;

  var timersHeight = document.getElementById("timers").offsetHeight; // timersHeight for 6 = 972
  var currentTimer = document.getElementsByClassName("timer");
  var theHeight = window.innerHeight; //1008
  var theWidth = window.innerWidth;

  filteredActive = activeTimers.filter(function () {
    return true;
  });

  filteredActive = filteredActive.filter(function (el) {
    return el != null;
  });

  if (filteredActive.length <= 4) {
    var newHeight = theHeight / 4 - (theHeight / 4) * 0.25;
    var newRadius = theHeight / 4;
    var newMargin =
      (theHeight - newHeight * filteredActive.length) /
      (filteredActive.length + 1);
  } else {
    var newHeight =
      theHeight / filteredActive.length -
      (theHeight / filteredActive.length) * 0.25;
    var newRadius = theHeight / filteredActive.length;
    var newMargin = newHeight / 3.5;
  }

  for (var i = 0; i < currentTimer.length; i++) {
    currentTimer[i].style.height = newHeight + "px";
    currentTimer[i].style.borderRadius = newRadius + "px";
    currentTimer[i].style.marginTop = newMargin + "px";
  }

  setTimeout(setTimerHeights, 100);
}

function round(number) {
  return Math.round(number / 40) * 40;
}

setTimerHeights(); // execute function

function suffix(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function isOdd(num) {
  return num % 2;
}

function openCyclePanel() {
  document.getElementById("cycleDiv").style.left = "50%";
  document.getElementById("everythingElse").style.filter = "blur(2px)";
  uisound();
}

function closeCyclePanel() {
  document.getElementById("cycleDiv").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";
  uisound();
}

var y = 0;
var x = 0;

var offset = 5;

document.addEventListener("keypress", function (event) {
  console.log(event.keyCode);
  if (event.keyCode == 119) {
    y -= offset;
  }
  if (event.keyCode == 115) {
    y += offset;
  }
  if (event.keyCode == 97) {
    x -= offset;
  }
  if (event.keyCode == 100) {
    x += offset;
  }
  console.log(y);
  document.body.style.transform =
    "translateX(" +
    x +
    "px) translateY(" +
    y +
    "px) scale(" +
    1 +
    ") rotate(" +
    0 +
    "deg)";
});

var playChristmasMusic = document.getElementById("playChristmasMusic"); //easter egg - plays christmas music
function togglePlay() {
  playChristmasMusic.play();
}

function reset() {
  // closes the more stuff panel
  document.getElementById("moreStats").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";

  localStorage.clear();
  alert("School Timer has been reset!");

  // Reloads the page
  window.location.reload();
}
