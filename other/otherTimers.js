var curHour;
var curMin;

(function actualTime() {
  var date = new Date();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  var ampm;
  var suffix;

  curHour = hours;
  curMin = minutes;

  if (hours === 12) {
    suffix = "PM";
  } else if (hours > 12) {
    hours = hours - 12;
    suffix = "PM";
  } else if (hours === "00") {
    hours = 12;
    suffix = "AM";
  } else {
    suffix = "AM";
  }

  var time = hours + ":" + minutes;
  document.getElementById("topTime").innerHTML = time;

  var bottomTime = ":" + seconds + " " + suffix;
  document.getElementById("bottomTime").innerHTML = bottomTime;

  setTimeout(actualTime, 10);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + " <br>" + yyyy;
  document.getElementById("currentDate").innerHTML = today;

  var testDate = new Date();
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  document.getElementById("currentDay").innerHTML = days[testDate.getDay()];
})();

(function progress() {
  var today = new Date();
  var startSchool = new Date("2025-08-15");
  var endSchool = new Date("2026-6-9");
  // Compute progress as elapsed over total duration between start and end
  var totalMs = endSchool - startSchool;
  var elapsedMs = today - startSchool;
  var percent = Math.round((elapsedMs / totalMs) * 100);

  // Clamp percent to [0, 100]
  if (percent < 0) {
    percent = 0;
  } else if (percent > 100) {
    percent = 100;
  }

  var yearProgress = document.getElementById("summerInner");
  yearProgress.style.width = percent + "%";

  var yearNumber = document.getElementById("summerNumber");
  yearNumber.innerHTML = percent + "%";

  setTimeout(progress, 1000);
})();
