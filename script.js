//openMessagePanel();

function openMessagePanel() {
  document.getElementById('messagePanel').style.left = '50%';
  document.getElementById('everythingElse').style.filter = 'blur(2px)';
  uisound();
}

function closeMessagePanel() {
  document.getElementById('messagePanel').style.left = '-50%';
  document.getElementById('everythingElse').style.filter = 'blur(0px)';
  //$('#septemba').html('<audio autoplay><source src="sounds/september.mp3"></audio>');
  uisound();
}


var currentScheduleSelected = 'A';
var numberOfPeriods = 9;

var scheduleArray = ['startTimesA', 'startTimesB', 'startTimesC', 'startTimesD']

var startTimesA = ['' + '07:40', '08:32', '09:19', '10:06', '10:53', '11:40', '12:27', '13:14', '14:01'];
var endTimesA = ['' + '08:28', '09:15', '10:02', '10:49', '11:36', '12:23', '13:10', '13:57', '14:44'];

var startTimesE = ['' + '07:54', '08:40', '09:26', '10:12', '10:58', '11:44', '12:30', '13:16', '14:02'];
var endTimesE = ['' + '08:36', '09:22', '10:08', '10:54', '11:40', '12:26', '13:12', '13:58', '14:44'];

var startTimesC = ['' + '07:40', '08:26', '09:08', '09:50', '10:24', '10:58', '11:32', '12:06', '12:35'];
var endTimesC = ['' + '08:22', '09:04', '09:46', '10:20', '10:54', '11:28', '12:02', '12:31', '13:00'];

var startTimesD = ['' + '09:40', '10:12', '10:41', '11:10', '11:43', '12:16', '12:46', '13:22', '14:05'];
var endTimesD = ['' + '10:08', '10:37', '11:06', '11:39', '12:12', '12:45', '13:18', '14:01', '14:44'];


var activeTimers = [];
var filteredActive = [];

var prevMargin, newMargin;
var doMargin = true;

create();

function create() {
  var container = document.getElementById('timers');
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }

  for (var i = 0; i < numberOfPeriods + 1; i++) {

    if (i == 0) {
      var box = document.createElement('div');
      box.id = 'firstContainer';

      var schoolTitle = document.createElement('div');
      schoolTitle.id = 'schoolTitle';
      schoolTitle.innerHTML = 'School Timer';

      box.appendChild(schoolTitle);
      container.appendChild(box);

    } else {

      var box = document.createElement('div');
      box.className = 'timer  shadows';

      if (i == 1) {
        box.id = 'secondContainer';
      }

      var header = document.createElement('h2');

      header.innerHTML = suffix(i) + ' Period';
      header.className = 'timerText';

      var table = document.createElement('table');

      var row1 = document.createElement('tr');

      var startLabel = document.createElement('th');
      var endLabel = document.createElement('th');

      startLabel.innerHTML = 'Start: ';
      startLabel.className = 'thatLabelThing thatStartThing timerText';

      endLabel.innerHTML = 'End: ';
      endLabel.className = 'thatLabelThing thatEndThing timerText';

      var row2 = document.createElement('tr');

      var start = document.createElement('td');
      var end = document.createElement('td');

      start.innerHTML = '00:54:31';
      start.id = i - 1 + 'start';
      start.className = 'startActual timerText';

      end.innerHTML = '00:32:31';
      end.id = i - 1 + 'end';
      end.className = 'endActual timerText';

      row1.appendChild(startLabel);
      row1.appendChild(start);
      row1.appendChild(endLabel);
      row1.appendChild(end)

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
  var remSchedual = localStorage.getItem('currentScheduleSelected');
  activeTimers = [];
  doMargin = true;

  var order = ['A', 'E', 'C', 'D'];

  switch (currentScheduleSelected) {
    case 'A':
      startTimes = startTimesA;
      endTimes = endTimesA;
      break;
    case 'E':
      startTimes = startTimesE;
      endTimes = endTimesE;
      break;
    case 'C':
      startTimes = startTimesC;
      endTimes = endTimesC;
      break;
    case 'D':
      startTimes = startTimesD;
      endTimes = endTimesD;
  }
  document.getElementById(currentScheduleSelected + 'in').style.display = 'block';
  for (var i = 0; i < order.length; i++) {
    if (order[i] !== currentScheduleSelected) {
      document.getElementById(order[i] + 'in').style.display = 'none';
    }
  }
  localStorage.setItem('currentScheduleSelected', currentScheduleSelected);
}

(function() {

  var start = new Date;

  function tick() {
    getItems();
    for (var i = 0; i < numberOfPeriods; i++) {
      start.setHours(startTimes[i].substring(0, 2), startTimes[i].substring(3, 5), 0);

      var now = new Date;
      if (now > start) { // too late, go to tomorrow
        start.setDate(start.getDate() + 1);
      }

      var remain = ((start - now) / 1000);
      var hh = pad((remain / 60 / 60) % 60);
      var mm = pad((remain / 60) % 60);
      var ss = pad(remain % 60);

      if (hh >= 24) {
        hh = hh - 24;
      }

      if (hh.toString().length == 1) {
        hh = '0' + hh;
      }

      if (hh >= 10) {
        document.getElementById(i + 'start').innerHTML = '------------';
        startStatus[i] = true;
      } else {
        document.getElementById(i + 'start').innerHTML = hh + ':' + mm + ':' + ss;
        startStatus[i] = false;
      }
    }
    setTimeout(tick, 100);
  }

  var doTitle = [];

  function tick2() {

    for (var i = 0; i < numberOfPeriods; i++) {
      start.setHours(endTimes[i].substring(0, 2), endTimes[i].substring(3, 5), 0);

      var now = new Date;
      if (now > start) { // too late, go to tomorrow
        start.setDate(start.getDate() + 1);
      }

      var remain = ((start - now) / 1000);
      var hh = pad((remain / 60 / 60) % 60);
      var mm = pad((remain / 60) % 60);
      var ss = pad(remain % 60);

      if (hh >= 24) {
        hh = hh - 24;
      }

      if (hh.toString().length == 1) {
        hh = '0' + hh;
      }

      var currentTimer = document.getElementsByClassName('timer');

      var startHeight = 0;

      startHeight = 0;

      if (hh >= 11) {
        if (i == 2) {
          console.log(hh);
        }
        //  console.log(curMin / 60 + curHour)
        document.getElementById(i + 'end').innerHTML = '------------'
        currentTimer[i].style.color = localStorage.getItem('customTimerTextDeactive');
        currentTimer[i].style.border = '0.5vh solid transparent';
        currentTimer[i].style.display = 'none';

        if (i == 8) {
          document.getElementById('schoolOver').style.display = 'block';
          document.getElementById('timers').style.display = 'none';
        }

        var schoolDayProgress = document.getElementById('progressInner');
        schoolDayProgress.style.width = 100 + '%';

        var schoolDayProgressLabel = document.getElementById('dayProgressLabel');
        schoolDayProgressLabel.innerHTML = 100 + '%';
        endStatus[i] = true;
        doTitle[i] = true;
        activeTimers[i] = null;
      } else {
        if (i==8) {
          document.getElementById('schoolOver').style.display = 'none';
          document.getElementById('timers').style.display = 'block';
        }
        activeTimers[i] = true;
        endStatus[i] = false;
        var myFilterArray = activeTimers.filter(Boolean);
        if (i == (9 - myFilterArray.length)) {
          document.title = hh + ':' + mm + ':' + ss;
        }
        if (startStatus[i] == true && endStatus[i] == false) {
          var currentTimer = document.getElementsByClassName('timer');
          currentTimer[i].style.border = '0.5vh solid ' + localStorage.getItem('accent');
          currentTimer[i].style.color = localStorage.getItem('customTimerTextActive');
          currentTimer[i].style.display = 'inline-block';

          doTitle[i] = false;
        } else {
          var currentTimer = document.getElementsByClassName('timer');
          currentTimer[i].style.border = '0.5vh solid transparent';
          currentTimer[i].style.color = localStorage.getItem('customTimerTextActive');
          currentTimer[i].style.display = 'inline-block';
          doTitle[i] = true;
        }

        document.getElementById(i + 'end').innerHTML = hh + ':' + mm + ':' + ss;

        var supposed = new Date().setHours(startTimes[0].substring(0, 2), startTimes[0].substring(3, 5), 0);

        var nownow = new Date();
        var endSchool = new Date().setHours(endTimes[8].substring(0, 2), endTimes[8].substring(3, 5), 0);
        var diffMs = (endSchool - nownow);

        var supposedVal = endSchool - supposed;

        var percent = (((diffMs / supposedVal * 100) - 100) * -1).toFixed(1);

        if (percent == undefined || percent == '' || percent == null) {
          percent = 0;
        } else if (percent > 100) {
          percent = 100;
        } else if (percent < 0) {
          percent = 0;
        }

        var schoolDayProgress = document.getElementById('progressInner');
        schoolDayProgress.style.width = percent + '%';

        var schoolDayProgressLabel = document.getElementById('dayProgressLabel');
        schoolDayProgressLabel.innerHTML = percent + '%';
      }
    }
    setTimeout(tick2, 100);
  }

  document.addEventListener('DOMContentLoaded', tick);
  document.addEventListener('DOMContentLoaded', tick2);
  document.addEventListener('DOMContentLoaded', statsHandler);
})();

function pad(num) {
  return ('0' + parseInt(num)).substr(-2);
}

function setTimerHeights() {
  prevMargin = newMargin;

  var timersHeight = document.getElementById('timers').offsetHeight; // timersHeight for 6 = 972
  var currentTimer = document.getElementsByClassName('timer');
  var theHeight = window.innerHeight; //1008
  var theWidth = window.innerWidth;


  filteredActive = activeTimers.filter(function() {
    return true
  });

  filteredActive = filteredActive.filter(function(el) {
    return el != null;
  });

  if (filteredActive.length <= 4) {
    var newHeight = (theHeight / 4) - (theHeight / 4 * 0.25);
    var newRadius = (theHeight / 4);
    var newMargin = (theHeight - (newHeight*filteredActive.length)) / (filteredActive.length+1);
  } else {
    var newHeight = (theHeight / filteredActive.length) - (theHeight / filteredActive.length * 0.25);
    var newRadius = (theHeight / filteredActive.length);
    var newMargin = newHeight / 3.5;
  }

  for (var i = 0; i < currentTimer.length; i++) {
    currentTimer[i].style.height = newHeight + 'px';
    currentTimer[i].style.borderRadius = newRadius + 'px';
    currentTimer[i].style.marginTop = newMargin + 'px';
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
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
}

function isOdd(num) {
  return num % 2;
}

function openCyclePanel() {
  document.getElementById('cycleDiv').style.left = '50%';
  document.getElementById('everythingElse').style.filter = 'blur(2px)';
  uisound();
}

function closeCyclePanel() {
  document.getElementById('cycleDiv').style.left = '-50%';
  document.getElementById('everythingElse').style.filter = 'blur(0px)';
  uisound();
}

var y = 0;
var x = 0;

var offset = 5;

document.addEventListener("keypress", function(event) {
  console.log(event.keyCode)
  if (event.keyCode == 119) {
    y-= offset;
  }
  if (event.keyCode == 115) {
    y+= offset;
  }
  if (event.keyCode == 97) {
    x-= offset;
  }
  if (event.keyCode == 100) {
    x+= offset;
  }
  console.log(y);
  document.body.style.transform = "translateX(" + x + "px) translateY("+ y + "px) scale("+ 1 + ") rotate(" + 0 + "deg)";
});