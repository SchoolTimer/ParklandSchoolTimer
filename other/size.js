const toggle = document.createElement('button');
toggle.style.position = 'absolute';
toggle.style.top = '0%';
toggle.style.right = '0%';
toggle.style.margin = '0';
toggle.style.padding = '0';
toggle.style.width = '6vh';
toggle.style.height = '6vh';
toggle.style.borderRadius = '0';
toggle.style.borderBottomLeftRadius = '2vw';
toggle.style.fontSize = '500%';
toggle.innerHTML = '&#171;';
toggle.onclick = function() {moveSidebar();}

document.body.appendChild(toggle);

const timers = document.getElementsByClassName('timer');
const text = document.getElementsByClassName('timerText');
const sidebar = document.getElementById('fullSidebar');

var notMoved = true;

var aspect;

setSidebar();
function setSidebar() {
  var screenX =  window.innerWidth;
  var screenY =  window.innerHeight;
  aspect = screenX / screenY;

  if (aspect <= 1.15) {
    if (notMoved == true) {
      sidebar.style.display = 'none';
    }
    toggle.style.display = 'block';
    for (var i = 0; i < timers.length; i++) {
      timers[i].style.width = '90vw';
    }
    for (var i = 0; i < text.length; i++) {
      text[i].style.fontSize = '3.5vw';
    }
  } else {
    sidebar.style.display = 'block';
    toggle.style.display = 'none';
    for (var i = 0; i < timers.length; i++) {
      timers[i].style.width = '55vw';
    }
    for (var i = 0; i < text.length; i++) {
      text[i].style.fontSize = '2.5vw';
    }
  }
  setTimeout(setSidebar, 50);
}

function moveSidebar() {
  if (notMoved == true) {
    sidebar.style.display = 'block';
    document.getElementById('timers').style.display = 'none';
    toggle.style.left = '0%';
    toggle.style.right = '';
    toggle.style.borderBottomLeftRadius = '0';
    toggle.style.borderBottomRightRadius = '2vw';
    toggle.innerHTML = '&#187;';
    notMoved = false;
  } else {
    sidebar.style.display = 'none';
    document.getElementById('timers').style.display = 'block';
    toggle.style.right = '0%';
    toggle.style.left = '';
    toggle.style.borderBottomLeftRadius = '2vw';
    toggle.style.borderBottomRightRadius = '0';
    toggle.innerHTML = '&#171;';
    notMoved = true;
  }
}
