var defaultTheme = {
  background: '#ededed',
  accent: '#ff2b40',
  maintext: '#575757',
  timertextactive: '#575757',
  timertextdeactive: '#bfbfbf',
  lightshadowdim: '-6px -6px 10px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 5);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -6);
  }
};

var darkTheme = {
  background: '#222226',
  accent: '#d11f3a',
  maintext: '#d4d4d4',
  timertextactive: '#d4d4d4',
  timertextdeactive: '#575757',
  lightshadowdim: '-3px -6px 7px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 3);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -2);
  }
};

var beachTheme = {
  background: '#FFF7EB',
  accent: '#55DDE0',
  maintext: '#575757',
  timertextactive: '#575757',
  timertextdeactive: '#bfbfbf',
  lightshadowdim: '-6px -6px 10px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 2);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -5);
  }
};

var stealthTheme = {
  background: '#000000',
  accent: '#1c1c1c',
  maintext: '#1c1c1c',
  timertextactive: '#1c1c1c',
  timertextdeactive: '#575757',
  lightshadowdim: '-3px -6px 7px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 3);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -2);
  }
};

var ewwTheme = {
  background: '#050064',
  accent: '#feff33',
  maintext: '#ff2afc',
  timertextactive: '#bfbfbf',
  timertextdeactive: '#575757',
  lightshadowdim: '-6px -6px 10px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 6);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -6);
  }
};

var hackerTheme = {
  background: '#000000',
  accent: '#00ff33',
  maintext: '#00ff33',
  timertextactive: '#00ff33',
  timertextdeactive: '#00ff33',
  lightshadowdim: '-6px -6px 10px ',
  lightshadow: function() {
    return LightenColor(currentColors.background, 6);
  },
  darkshadowdim: '6px 6px 10px ',
  darkshadow: function() {
    return LightenColor(currentColors.background, -6);
  }
};
