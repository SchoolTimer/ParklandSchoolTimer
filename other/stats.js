function openStatsPanel() {
  document.getElementById('moreStats').style.left = '50%';
  document.getElementById('everythingElse').style.filter = 'blur(2px)';
  uisound();
}

function closeStatsPanel() {
  document.getElementById('moreStats').style.left = '-50%';
  document.getElementById('everythingElse').style.filter = 'blur(0px)';
  uisound();
}

var deadlines = [
                 new Date("June 9, 2022 9:20:00").getTime(),
                 new Date("May  27, 2022 14:30:00").getTime(),
                ];

var statNames = [
                 'Last Day of School',
                 'Seniors Last Day',
                ];

const container = document.getElementById('statsDiv');

var deadline = new Date("June 11, 2021 9:20:00").getTime();


for (var i = 0; i < deadlines.length; i++) {
  var label = document.createElement('h4');
  label.innerHTML = statNames[i];
  label.style.display = 'inline-block';
  label.style.fontWeight = 'bold';
  label.style.marginRight = '10px';
  label.style.margin = '0px;';
  label.style.marginLeft = '0vw';

  var output = document.createElement('h4');
  output.className = 'stat';
  output.id = 'stat' + i;
  output.style.display = 'inline-block';

  container.appendChild(label);
  container.appendChild(output);

  var brrr = document.createElement('br');
  container.appendChild(brrr);
}

function statsHandler() {

  for (var i = 0; i < deadlines.length; i++) {
    var now = new Date().getTime();
    var t = deadlines[i] - now;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);

    document.getElementById('stat' + i).innerHTML = days + ' Days ' + hours + ' Hours ' + minutes + ' Minutes ' + seconds + ' Seconds';
    if (t < 0) {
      document.getElementById('stat' + i).innerHTML = 'Expired';
    }

  }
  setTimeout(statsHandler, 10);
}
