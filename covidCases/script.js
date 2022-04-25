function readJsonData() {
  
//   Working url: https://613aad1a110e000017a45364.mockapi.io/covidData/1
  
    fetch("https://6266b23763e0f3825685c4a6.mockapi.io/covidData/1", { cache: "reload" }) 
  
      .then(response => response.json())
      .then(data => {
        document.getElementById("totalCases").innerHTML = data.totalCases; 
        document.getElementById("impactfulCases").innerHTML = data.impactfulCases;
        document.getElementById("tenDayRollingCases").innerHTML = data.tenDayRollingCases;
        document.getElementById("lastFetched").innerHTML = data.lastUpdated;
      });
  
    setTimeout(readJsonData, 60*12*60*1000);
  }
  readJsonData();