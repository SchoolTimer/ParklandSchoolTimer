var curHour;
var curMin;

(function actualTime() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    var ampm;
    var suffix;

    curHour = hours;
    curMin = minutes;

    if (hours > 12) {
      hours = hours - 12;
      suffix = 'PM';
    } else {
      suffix = 'AM';
    }
    var time = hours + ":" + minutes;
    document.getElementById("topTime").innerHTML = time;

    var bottomTime = ':' + seconds + ' ' + suffix;
    document.getElementById('bottomTime').innerHTML = bottomTime;

    setTimeout(actualTime, 10);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + ' <br>' + yyyy;
    document.getElementById('currentDate').innerHTML = today;

    var testDate = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    document.getElementById('currentDay').innerHTML = days[testDate.getDay()];
})();

(function foo() {
  var today = new Date();
  var endSchool = new Date("2022-6-5");
  var diffMs = (endSchool - today); // milliseconds between now & Christmas

  var percent = (((diffMs / 24192000000 * 100)-100)*-1).toFixed(0);

  var yearProgress = document.getElementById('summerInner');
  yearProgress.style.width = percent + '%';

  var yearNumber = document.getElementById('summerNumber');
  yearNumber.innerHTML = percent + '%';

  setTimeout(foo, 1000);
})();
