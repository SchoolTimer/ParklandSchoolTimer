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

function openMessagePanel() {
  closeStatsPanel();
  document.getElementById("messagePanel").style.left = "50%";
  document.getElementById("everythingElse").style.filter = "blur(2px)";
  uisound();
}

function closeMessagePanel() {
  document.getElementById("messagePanel").style.left = "-50%";
  document.getElementById("everythingElse").style.filter = "blur(0px)";
  //$('#septemba').html('<audio autoplay><source src="sounds/september.mp3"></audio>');
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

    // Send to Discord webhook
    var xhr = new XMLHttpRequest();
    var webhookURL =
      "https://discord.com/api/webhooks/1409040897647181885/GI7W9G0fjy-_KxiToB-H-MiIeziCD_k-OLVfpeJJedkXM8mKJfV43FxTUvn5uuErFNJW";

    var embed = {
      embeds: [
        {
          title: "💡 Feature Request",
          description: feature,
          color: 3066993,
          timestamp: new Date().toISOString(),
          footer: {
            text: "School Timer Feature Request",
          },
        },
      ],
    };

    xhr.open("POST", webhookURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(embed));

    // Show success message
    alert(
      "Thank you for requesting a feature! I will try my very best to implement your feature!"
    );
  }
}

function bugReport() {
  var bugDescription;
  var type = prompt(
    "Enter the bug you experienced on School Timer so that I can fix it.",
    ""
  );
  if (type == null || type == "") {
    //txt = "User cancelled the prompt.";
  } else {
    bugDescription = type;

    // Send to Discord webhook
    var xhr = new XMLHttpRequest();
    var webhookURL =
      "https://discord.com/api/webhooks/1409040701034860574/xIuKO4TqooiiamAWsOAynwJoGAw1nfwS2IBms966k50VmEdxHFq6zWZgjQVlkZBF7xwO";

    var embed = {
      embeds: [
        {
          title: "🐛 Bug Report",
          description: bugDescription,
          color: 15158332,
          timestamp: new Date().toISOString(),
          footer: {
            text: "School Timer Bug Report",
          },
        },
      ],
    };

    xhr.open("POST", webhookURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(embed));

    // Show success message
    alert("Thank you for reporting the bug! I will try patching it soon!");
  }
}

function app() {}
