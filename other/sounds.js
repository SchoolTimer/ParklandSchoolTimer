var uisoundValue;

if(localStorage.getItem('uisounds') == undefined || localStorage.getItem('uisounds') == null) {
  console.log('und')
  uisoundValue = true;
  document.getElementById("uisounds").checked = true;
} else {
  console.log('else')
  uisoundValue = localStorage.getItem('uisounds');
  uisoundValue = (uisoundValue == 'true');
  document.getElementById("uisounds").checked = uisoundValue;
}

function uisound() {
  if (uisoundValue == 'true' || uisoundValue == true) {
    higherSound();
  }
}

function soundHandler() {
  var check = document.getElementById("uisounds").checked;
  uisoundValue = check;

  localStorage.setItem('uisounds', uisoundValue);
}

function higherSound() {
  var audio = new Audio('sounds/higher.mp3');
  audio.play();
}
