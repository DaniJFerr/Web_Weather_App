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
    currentWeather.innerHTML = `
    <h1>${data.cityName} (${moment(data.date).format("DD MM YYYY")}) <img src="${data.icon}" alt="Weather icon"></h1>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Wind Speed: ${Math.round(data.windSpeed)}mph</p>
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
      humidity: forecast.main.humidity
    };
  });
};

 // Render 5-day forecast to the page 
const renderFiveDayForecast = data => { 
  fiveDayForecast.innerHTML = ""; 

  for (let i = 0; i < 5; i++) {   // loop through the first 5 days of the forecast array  

    const forecastEl = document.createElement("div");   // create a div element for each day's forecast

    forecastEl.innerHTML = `      
       <p>${moment(data[i].date).format("DD MM YYYY")}</p>       
       <img src="${data[i].icon}" alt="Weather icon">     
       <p>Temperature: ${data[i].temperature}°F</p>      
       <p>Humidity: ${data[i].humidity}%</p>      `;

    fiveDayForecast.appendChild(forecastEl);   // append each day's forecast to the fiveDayForecast container on the page 

  }   // end of loop through first 5 days of forecast array   

 };

       // Handle city search form submission
       const handleCitySearch = event => {
       event.preventDefault();
       const city = cityInput.value;
       Promise.all([fetchCurrentWeather(city), fetchFiveDayForecast(city)])
       .then(([currentWeatherData, fiveDayForecastData]) => {
       renderCurrentWeather(currentWeatherData);
       renderFiveDayForecast(fiveDayForecastData);
       });
       cityInput.value = "";
       };

 
// Event listener for city search form submission
  form.addEventListener("submit", handleCitySearch);
 
