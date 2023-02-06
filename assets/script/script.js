// API key for OpenWeatherMap API
 const API_KEY = "0e8d79a8623e3b0540d910225191556a";
 // Input element for city search
 const cityInput = document.getElementById("search-input");
 // Container element for current weather informatsion
 const currentWeather = document.getElementById("today");
 // Container element for 5-day forecast
 const fiveDayForecast = document.getElementById("forecast");
 // Search history container
 const citiesArray = JSON.parse(localStorage.getItem('searched-cities')) || [];
// Function to retrieve the OpenWeather data for the selected city
 function fetchCurrentWeather(cityName, Button) {
  
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
  
  fetch(queryURL)
  .then(function (response) { return response.json(); })
  .then(function (cityData) {
  // Return error message if the city code is not = 200 
    if (cityData.cod === 200) {
      renderCurrentWeather(cityData);
      fetchFiveDaysForecast(cityData);
      if (Button) {
        updateCitiesArray(cityName);
        renderSearchHistory();
      }
    } else {
      alert("Something went wrong, please try again.");
    }
  });
}

// Function to render the current weather data of the selected city
function renderCurrentWeather(cityData) {
  const today = moment();
  currentWeather.classList.add("border", "border-dark");
  currentWeather.innerHTML = `
    <div class="currentCity">
      <h1> ${cityData.name} ${today.format("(DD/MM/YYYY)")} 
      <img id="city-icon" src="http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png">
      </h1>
    </div>
    <div class="currentData">
      <p id="temperature">Temperature: ${cityData.main.temp} ºC</p>
      <p id="wind">Wind speed: ${cityData.wind.speed} mph</p>
      <p id="humidity">Humidity: ${cityData.main.humidity}%</p>
    </div>
  `;
}

// Function to access the OpenWeather object with the city forecast data
async function fetchFiveDaysForecast(cityData) {
  const API_KEY = "0e8d79a8623e3b0540d910225191556a";
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityData.name}&units=metric&appid=${API_KEY}`;

  fetch(queryURL)
  .then(function (response) { return response.json(); })
  .then(function (forecastData) {
    renderFiveDayForecast(forecastData);
  });
}

//This function renders a 5-day forecast based on the forecastData provided. 
//It creates a forecastHeader, a forecastDiv, and five cards containing the date, temperature, wind speed, and humidity for each day.
function renderFiveDayForecast(forecastData) {
  const fiveDaysData = {};
  const fiveDaysTemp = [];
  const todayDate = moment();
  fiveDayForecast.innerHTML = "";

  forecastFiveDaysData(forecastData, fiveDaysData);

  const forecastHeader = document.createElement("div");
  forecastHeader.innerHTML = `
    <div id="forecastTitle">
      <h4> 5-Day Forecast </h4>
    </div>
  `;
  fiveDayForecast.appendChild(forecastHeader);

  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("row");
  fiveDayForecast.appendChild(forecastDiv);

  for (let index = 0; index < Object.keys(fiveDaysData).length; index++) {
    let day = Object.keys(fiveDaysData)[index];
    fiveDaysTemp.push(getTemp(day, fiveDaysData));
}


for (let index = 0; index < fiveDaysTemp.length; index++) {
  let card = document.createElement("div");
  card.classList.add("forecastCard", "col-sm-2");
  forecastDiv.appendChild(card);

  let date = document.createElement("h4");
  date.textContent = todayDate.add(1, 'days').format("DD/MM/YYYY");
  card.appendChild(date);

  let imgIcon = document.createElement("img");
  imgIcon.src = `http://openweathermap.org/img/wn/${fiveDaysTemp[index].icon}@2x.png`, card;
  card.appendChild(imgIcon);

  displayData(`Temp: ${fiveDaysTemp[index].temp} ºC`, card);
  displayData(`Wind: ${fiveDaysTemp[index].wind} mph`, card);
  displayData(`Humidity: ${fiveDaysTemp[index].humidity} %`, card);
  
}
}


function forecastFiveDaysData(forecastData, fiveDaysData) {
  let todayDate = moment();
  for (let index = 0; index < forecastData.list.length; index++) {
    let days = forecastData.list[index].dt_txt;
    let formattedDays = moment(days).format("DD/MM/YYYY");

    let temperature = forecastData.list[index].main.temp;
    let wind = forecastData.list[index].wind.speed;
    let humidity = forecastData.list[index].main.humidity;
    let icon = forecastData.list[index].weather[0].icon;

    
    if (formattedDays === todayDate.format("DD/MM/YYYY")) {
        continue;
    }

    if (fiveDaysData[formattedDays] === undefined) {
        fiveDaysData[formattedDays] = [];
    } else {
        fiveDaysData[formattedDays].push({ "temp": temperature, "wind": wind, "humidity": humidity, "icon": icon });
    }
}
}

function getTemp(day, fiveDaysData) {
  let maxTemp = -1000;
  let objTemp = {};

  for (let index = 0; index < fiveDaysData[day].length; index++) {

      if (fiveDaysData[day][index].temp > maxTemp) {
          maxTemp = fiveDaysData[day][index].temp;
          objTemp = fiveDaysData[day][index];
      }
  }
  return objTemp;
}

// Function to display the max value on a card
const displayData = (maxValue, card) => {
  const valueText = document.createElement("p");
  valueText.textContent = maxValue;
  card.appendChild(valueText);
};
  
  // Function to update the array of last 6 searched cities and save it in local storage
  const updateCitiesArray = (cityName) => {
    if (!cityName) {
        alert("Please enter a city name");
        return;
    }
      citiesArray.push(cityName);
    if (citiesArray.length > 6) {
      citiesArray.shift();
    }
      localStorage.setItem('searched-cities', JSON.stringify(citiesArray));
  };
  
  // Function to display the last searched cities as buttons
  const renderSearchHistory = () => {
      document.querySelector(".list-group").innerHTML = "";
      for (let index = 0; index < citiesArray.length; index++) {
      let capitalCity = citiesArray[index];
      capitalCity = capitalCity.charAt(0).toUpperCase() +  capitalCity.slice(1);
      const cityButton = document.createElement("button");
      cityButton.setAttribute("type", "submit");
      cityButton.classList.add("btn-city");
      cityButton.innerText = capitalCity;
      document.querySelector(".list-group").prepend(cityButton);
    }
  };
  
  renderSearchHistory();
  
  // Event listener for the search button
  document.getElementById("search-button").addEventListener("click", (event) => {
    const cityName = cityInput.value;
    event.preventDefault();
    fetchCurrentWeather(cityName, true);
    cityInput.value = "";
  });
  
  // Event listener for the city buttons
  document.querySelector(".list-group").addEventListener("click", (event) => {
    if (event.target.matches("button")) {
      fetchCurrentWeather(event.target.textContent, false);
    }
  });





