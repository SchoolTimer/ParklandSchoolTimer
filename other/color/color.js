var customBackground, customTimerTextActive, customTimerTextDeactive, customAccent, customMainTexts,
    customLightShadow, customDarkShadow, customLightShadowDim, customDarkShadowDim;

    var LightenColor = function(color, percent) {
        var num = parseInt(color.replace("#",""), 16),
    		amt = Math.round(2.55 * percent),
    		R = (num >> 16) + amt,
    		B = (num >> 8 & 0x00FF) + amt,
    		G = (num & 0x0000FF) + amt;

    		return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    };

var selectedTheme;

var currentColors = {};

getItems();

function changeColors (theme) {
  switch (theme) {
    case 'default':
    currentColors = defaultTheme;
      break;
    case 'dark':
    currentColors = darkTheme;
      break;
    case 'beach':
    currentColors = beachTheme;
      break;
    case 'eww':
    currentColors = ewwTheme;
      break;
    case 'stealth':
    currentColors = stealthTheme;
      break;
    case 'hacker':
    currentColors = hackerTheme;
      break;
  }
  setAllElementColors();
}


function setBackgrounds() {
  document.body.style.backgroundColor = currentColors.background;
  document.getElementById('background').value = currentColors.background;

  var popups = document.getElementsByClassName('popup');
  for (var i = 0; i < popups.length; i++) {
    popups[i].style.backgroundColor = LightenColor(currentColors.background, 0);
  }
}

function setMainText() {

  document.getElementById('maintext').value = currentColors.maintext;

  var mainTexts = document.getElementsByTagName('h6');
  for (var i = 0; i < mainTexts.length; i++) {
    mainTexts[i].style.color = currentColors.maintext;
  }

  var h5s = document.getElementsByTagName('h5');
  for (var i = 0; i < h5s.length; i++) {
    h5s[i].style.color = currentColors.maintext;
  }

  var h4s = document.getElementsByTagName('h4');
  for (var i = 0; i < h4s.length; i++) {
    h4s[i].style.color = currentColors.maintext;
  }

  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.color = currentColors.maintext;
  }

  var h1s = document.getElementsByTagName('h1');
  for (var i = 0; i < h1s.length; i++) {
    h1s[i].style.color = currentColors.maintext;
  }

  var radioLabels = document.getElementsByClassName('radioInner');
  for (var i = 0; i < radioLabels.length; i++) {
    radioLabels[i].style.backgroundColor = currentColors.maintext;
  }

  // var dayCycleLabels = document.getElementsByClassName('dayCycleLabels');
  // dayCycleLabels.style.backgroundColor = currentColors.maintext;

  var requestButton = document.getElementsByClassName('requestButton');
  for (var i = 0; i < requestButton.length; i++) {
    requestButton[i].style.color = currentColors.maintext;
  }

  var radioLabels = document.getElementsByTagName('select');
  for (var i = 0; i < radioLabels.length; i++) {
    radioLabels[i].style.color = currentColors.maintext;
    radioLabels[i].style.borderColor = currentColors.maintext;
  }

  var radioLabels = document.getElementsByTagName('p');
  for (var i = 0; i < radioLabels.length; i++) {
    radioLabels[i].style.color = currentColors.maintext;
    radioLabels[i].style.borderColor = currentColors.maintext;
  }

  var active = document.getElementsByClassName('timerText');
  for (var i = 0; i < active.length; i++) {
    active[i].style.color = currentColors.maintext;
  } 

  var weather = document.getElementsByTagName('i');
  for (var i = 0; i < weather.length; i++) {
    weather[i].style.color = currentColors.maintext;
  }

}

function setAccent() {

  document.getElementById('accent').value = currentColors.accent;

  var lines = document.getElementsByTagName('hr');
  for (var i = 0; i < lines.length; i++) {
    lines[i].style.borderColor = currentColors.accent;
  }
  document.getElementById('progressInner').style.backgroundColor = currentColors.accent;
  document.getElementById('summerInner').style.backgroundColor = currentColors.accent;
}

function setShadows() {
  var timers = document.getElementsByClassName('shadows');
  for (var i = 0; i < timers.length; i++) {
    timers[i].style.boxShadow = currentColors.lightshadowdim + currentColors.lightshadow() + ', ' + currentColors.darkshadowdim + currentColors.darkshadow();
  }
}

function setAllElementColors() {
  setBackgrounds();
  setMainText();
  setAccent();
  setShadows();
  localStorage.setItem('background', currentColors.background);
  localStorage.setItem('accent', currentColors.accent);
  localStorage.setItem('maintext', currentColors.maintext);
  localStorage.setItem('timertextactive', currentColors.timertextactive);
  localStorage.setItem('timertextdeactive', currentColors.timertextdeactive);
  localStorage.setItem('lightshadowdim', currentColors.lightshadowdim);
  localStorage.setItem('lightshadow', currentColors.lightshadow());
  localStorage.setItem('darkshadowdim', currentColors.darkshadowdim);
  localStorage.setItem('darkshadow', currentColors.darkshadow());
}

function getItems() {
  if(localStorage.getItem('edited') == 'true') {
    document.getElementById('themeSelector').value = 'custom';
  }

  currentColors.background = localStorage.getItem('background');
  currentColors.accent = localStorage.getItem('accent');
  currentColors.maintext = localStorage.getItem('maintext');
  currentColors.timertextactive = localStorage.getItem('timertextactive');
  currentColors.timertextdeactive = localStorage.getItem('timertextdeactive');
  currentColors.lightshadowdim = localStorage.getItem('lightshadowdim');
  currentColors.darkshadowdim = localStorage.getItem('darkshadowdim');

  currentColors.lightshadow = function () {
    var insta = localStorage.getItem('lightshadow');
    return insta;
  };
  currentColors.darkshadow = function () {
    return localStorage.getItem('darkshadow');
  };

  if (localStorage.getItem('background') == null) {
    currentColors = defaultTheme;
  }

  setAllElementColors();
}

var colorCount = 0;

function colorSpam() {
  
  if (colorCount >= 25) {
    currentColors.background = '#'+ (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    console.log(currentColors.background);
    setAllElementColors();
  }
  
  setTimeout(colorSpam, 100);
}

colorSpam();

function openColor() {
  colorCount++;
  document.getElementById('colorDiv').style.left = '50%';
  document.getElementById('everythingElse').style.filter = 'blur(2px)';
  uisound();
}

function closeColor() {
  document.getElementById('colorDiv').style.left = '-50%';
  document.getElementById('everythingElse').style.filter = 'blur(0px)';
  uisound();
}
