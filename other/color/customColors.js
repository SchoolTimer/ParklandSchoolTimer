function customColors(currentColor, id) {
  document.getElementById('themeSelector').value = 'custom';
  localStorage.setItem('edited', true);
  currentColors[id] = currentColor;

  currentColors.lightshadow = function () {
    return LightenColor(currentColors.background, 3);
  };

  currentColors.darkshadow = function () {
    return LightenColor(currentColors.background, -1);
  };

  setAllElementColors();
}

function changeColorPicker() {
  var colorPicker = document.getElementById('colorPicker');
  var element = document.getElementById('custonElement').value;
  colorPicker.value = currentColors[element];
}
