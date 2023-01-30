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
 
 // // Search history container
 // const searchHistory = document.querySelector(".list-group");
 
 // Fetch current weather data for a city
 const fetchCurrentWeather = city => {
   return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
     .then(res => res.json())
     .then(data => {
       return {
         cityName: data.name,
         date: new Date(),
         icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
         temperature: data.main.temp,
         humidity: data.main.humidity,
         windSpeed: data.wind.speed
       };
     });
 };

  // Render current weather data to the page
  const renderCurrentWeather = data => {
    currentWeather.innerHTML = `
    <h1>${data.cityName} (${data.date.toDateString()})</h1>
      <img src="${data.icon}" alt="Weather icon">
      <p>Temperature: ${data.temperature}°F</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Wind Speed: ${data.windSpeed}mph</p>
    `;
  };
 
       // Handle city search form submission
       const handleCitySearch = event => {
       event.preventDefault();
       const city = cityInput.value;
       Promise.all([fetchCurrentWeather(city)])
       .then(([currentWeatherData]) => {
       renderCurrentWeather(currentWeatherData);
      
       });
       cityInput.value = "";
       };
       
       // Add city to search history
       const addToSearchHistory = city => {
       const cityEl = document.querySelector(".list-group");
       cityEl.innerHTML +=`<li> <a href="#" class="list-group-item list-group-item-action">${city}</a></li>`;
       searchHistory.appendChild(cityEl);
       };
   
             // Add the city to the search history
         const history = document.getElementById("history");
         history.innerHTML += `<a href="#" class="list-group-item list-group-item-action">${cityInput}</a>`;
         
         // Clear the input field
         cityInput.value = "";
 
       // Event listener for city search form submission
       form.addEventListener("submit", handleCitySearch);
 