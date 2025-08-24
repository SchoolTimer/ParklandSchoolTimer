async function readJsonDataFoodMenu() {
  var breakfastDiv = document.getElementById("breakfastMenu");
  breakfastDiv.innerHTML = "Loading!";

  var lunchDiv = document.getElementById("lunchMenu");
  lunchDiv.innerHTML = "Loading!";

  function formatList(items) {
    if (!Array.isArray(items) || items.length === 0) return "-";
    return items
      .map(function capitalizeFirst(word) {
        if (typeof word !== "string" || word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(", ");
  }

  await window.SchoolTimerAPI.fetchCombinedData()
    .then(function onData(combined) {
      var fm = combined.foodmenu || {};
      breakfastDiv.innerHTML = formatList(fm.breakfast || []);
      lunchDiv.innerHTML = formatList(fm.lunch || []);
    })
    .catch(function onError(error) {
      console.error("Error fetching food menu data:", error);
      // Display dash for food menu elements when API fails
      document.getElementById("breakfastMenu").innerHTML = "-";
      document.getElementById("lunchMenu").innerHTML = "-";
    });

  setTimeout(readJsonDataFoodMenu, 60 * 12 * 60 * 1000);
}
readJsonDataFoodMenu();
