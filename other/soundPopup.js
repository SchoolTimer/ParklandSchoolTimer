function openSoundPanel() {
  document.getElementById('soundDiv').style.left = '50%';
  document.getElementById('everythingElse').style.filter = 'blur(2px)';
  uisound();
}

function closeSoundPanel() {
  document.getElementById('soundDiv').style.left = '-50%';
  document.getElementById('everythingElse').style.filter = 'blur(0px)';
  uisound();
}
