async function readJsonDataFoodMenu() {
  var breakfastDiv = document.getElementById("breakfastMenu");
  breakfastDiv.innerHTML = "Loading!";

  var lunchDiv = document.getElementById("lunchMenu");
  lunchDiv.innerHTML = "Loading!";

  await fetch("https://6266b23763e0f3825685c4a6.mockapi.io/LunchBreakfastAPI/1")
    .then((response) => response.json())
    .then((data) => {
      // Breakfast Menu
      var breakfastObjSize = data.breakfast.length;
      var breakfastDiv = document.getElementById("breakfastMenu");
      breakfastDiv.innerHTML = "";
      for (let i = 0; i < breakfastObjSize; i++) {
        if (i == 0) {
          let breakfast = data.breakfast[i].product.name;
          breakfast = breakfast.charAt(0).toUpperCase() + breakfast.slice(1);
          breakfastDiv.innerHTML += breakfast;
        } else {
          let breakfast = data.breakfast[i].product.name;
          breakfastUpperCase =
            breakfast.charAt(0).toUpperCase() + breakfast.slice(1);
          breakfastFormated = ", " + breakfastUpperCase;
          breakfastDiv.innerHTML += breakfastFormated;
        }
      }

      // Lunch menu
      var LunchObjSize = data.lunch.length;
      var lunchDiv = document.getElementById("lunchMenu");
      lunchDiv.innerHTML = "";
      for (let i = 0; i < LunchObjSize; i++) {
        if (i == 0) {
          let lunch = data.lunch[i].product.name;
          lunch = lunch.charAt(0).toUpperCase() + lunch.slice(1);
          lunchDiv.innerHTML += lunch;
        } else {
          let lunch = data.lunch[i].product.name;
          lunchUpperCase = lunch.charAt(0).toUpperCase() + lunch.slice(1);
          lunchFormated = ", " + lunchUpperCase;
          lunchDiv.innerHTML += lunchFormated;
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching food menu data:", error);
      // Display dash for food menu elements when API fails
      document.getElementById("breakfastMenu").innerHTML = "-";
      document.getElementById("lunchMenu").innerHTML = "-";
    });

  setTimeout(readJsonDataFoodMenu, 60 * 12 * 60 * 1000);
}
readJsonDataFoodMenu();
