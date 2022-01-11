function openStuffPanel() {
  document.getElementById("moreStuff").style.left = "50%";
  document.getElementById("everythingElse").style.filter = "blur(2px)";
  uisound();
}

function closeStuffPanel() {
  document.getElementById("moreStuff").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";
  uisound();
}

function requestFeature() {
  var feature;
  var type = prompt(
    "Enter the feature you'd like to see in the next update of schooltimer!",
    ""
  );
  if (type == null || type == "") {
    //txt = "User cancelled the prompt.";
  } else {
    feature = type;

    var xhr = new XMLHttpRequest();
    var myURL =
      "https://maker.ifttt.com/trigger/featureRequest/with/key/fPHfTNt8bLrnCWXPajQ7hOqTFzmWMxCSARnDX1OjbUV?value1=" +
      feature;
    xhr.open("POST", myURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        value: "value"
      })
    );
  }
}

function bugReport() {
  var feature;
  var type = prompt(
    "Enter the bug you experienced on School Timer so that I can fix it.",
    ""
  );
  if (type == null || type == "") {
    //txt = "User cancelled the prompt.";
  } else {
    feature = type;
    var xhr = new XMLHttpRequest();
    var myURL =
      "https://maker.ifttt.com/trigger/bugReport/with/key/fPHfTNt8bLrnCWXPajQ7hOqTFzmWMxCSARnDX1OjbUV?value1=" +
      feature;
    xhr.open("POST", myURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        value: "value"
      })
    );
  }
}




function app() {
  
}