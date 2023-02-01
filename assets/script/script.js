 // API key for OpenWeatherMap API
 const API_KEY = "0e8d79a8623e3b0540d910225191556a";

 // Form element for city search
 const form = document.getElementById("search-form");
 
 // Input element for city search
 const cityInput = document.getElementById("search-input");
 
 // Container element for current weather information
 const currentWeather = document.getElementById("today");
 
 // Container element for 5-day forecast
 const fiveDayForecast = document.getElementById("forecast");
 
 // Search history container
 const searchHistory = document.getElementById("history");


 function addEventListener(){

  if ( cityInput === 0){
    alert("Please insert a city name!");
  }

 }
 
 // Fetch current weather data for a city
 const fetchCurrentWeather = async city => {
   const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
   const data = await res.json();
   return {
     cityName: data.name,
     date: new Date(),
     icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
     temperature: Math.floor(data.main.temp - 32) * 5 / 9,
     humidity: data.main.humidity,
     windSpeed: data.wind.speed
   };
 };

// Render current weather data to the page
  const renderCurrentWeather = data => {
    currentWeather.classList.add("border" , "border-dark");
    currentWeather.innerHTML = `
    <div class=currentCity >
    <h1>${data.cityName} (${moment(data.date).format("DD/MM/YYYY")}) <img src="${data.icon}" alt="Weather icon"></h1>
    </div>
    <div class=currentData>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Wind Speed: ${Math.round(data.windSpeed)}mph</p>
    </div>
    `;
  };
 
// Fetch 5-day forecast for a city
const fetchFiveDayForecast = async city => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
  const data = await res.json();
  return data.list.map(forecast => {
    return {
      date: new Date(forecast.dt * 1000),
      icon: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`,
      temperature: forecast.main.temp,
      humidity: forecast.main.humidity,
      windSpeed: forecast.wind.speed
    };
  });
};

 // Render 5-day forecast to the page 
const renderFiveDayForecast = data => { 
  let forecastTitle = document.createElement("div");
  forecastTitle.classList.add("col-lg-12");
  forecastTitle.innerHTML =
      `<div class="forecastTitle">
          <h3>5-Day Forecast</h3>
      </div>`;
  fiveDayForecast.appendChild(forecastTitle);

  // fiveDayForecast.innerHTML = "";
  for (let i = 0; i < 5; i++) {   // loop through the first 5 days of the forecast array  
    const forecastEl = document.createElement("div");   // create a div element for each day's forecast
    forecastEl.innerHTML = `
       <div class="forecastCard">
       <h4>${moment(data[i].date).format("DD/MM/YYYY")}</h4>       
       <img src="${data[i].icon}" alt="Weather icon">     
       <p>Temp: ${data[i].temperature}°F</p>      
       <p>Humidity: ${data[i].humidity}%</p>
       <p>Wind: ${data[i].windSpeed}mph</p>
       </div>`;
    
    fiveDayForecast.appendChild(forecastEl);   // append each day's forecast to the fiveDayForecast container on the page 

  }   // end of loop through first 5 days of forecast array   

 };

 // Add search history to localStorage
const addSearchHistory = city => {
  let searchHistoryArray = [];
  if (localStorage.getItem("searchHistory")) {
  searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));
  }
  searchHistoryArray.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
  };
  
  // Render search history to the page
  const renderSearchHistory = () => {
    let searchHistoryArray = [];
    if (localStorage.getItem("searchHistory")) {
       searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));
    }
       searchHistory.innerHTML = "";
       searchHistoryArray.forEach(city => {
       const button = document.createElement("button");
       button.classList.add("btn-city");
       button.innerText = city;
       button.addEventListener("click", () => {
       Promise.all([fetchCurrentWeather(city), fetchFiveDayForecast(city)])
       .then(([currentWeatherData, fiveDayForecastData]) => {
       renderCurrentWeather(currentWeatherData);
       renderFiveDayForecast(fiveDayForecastData);
    });
    });
    searchHistory.appendChild(button);
    });
  };
  
  // Add city to search history and render it to the page after a successful search
  const handleCitySearch = event => {
    event.preventDefault();
      const city = cityInput.value;
      Promise.all([fetchCurrentWeather(city), fetchFiveDayForecast(city)])
      .then(([currentWeatherData, fiveDayForecastData]) => {
      renderCurrentWeather(currentWeatherData);
      renderFiveDayForecast(fiveDayForecastData);
    });
      addSearchHistory(city);
      renderSearchHistory();
      cityInput.value = "";
  };
  
  // Initial render of search history on page load
  renderSearchHistory();
 
// Event listener for city search form submission
  form.addEventListener("submit", handleCitySearch);
 
