import { useState } from "react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const defaultData = {
  city: "Mumbai",
  country: "IN",
  forecast: [
    {
      dt: 1731250800,
      date: "2024-11-10 18:00:00",
      humidity: 52,
      icon: "02n",
      temp: 26.59,
      temp_max: 26.59,
      temp_min: 22.42,
      weather: "Clouds",
      windSpeed: 2.72,
    },
    {
      dt: 1731337200,
      date: "2024-11-11 18:00:00",
      humidity: 63,
      icon: "01n",
      temp: 21.86,
      temp_max: 21.86,
      temp_min: 21.86,
      weather: "Clear",
      windSpeed: 3.15,
    },
    {
      dt: 1731423600,
      date: "2024-11-12 18:00:00",
      humidity: 62,
      icon: "01n",
      temp: 23.14,
      temp_max: 23.14,
      temp_min: 23.14,
      weather: "Clear",
      windSpeed: 3.23,
    },
    {
      dt: 1731510000,
      date: "2024-11-13 18:00:00",
      humidity: 69,
      icon: "04n",
      temp: 23.87,
      temp_max: 23.87,
      temp_min: 23.87,
      weather: "Clouds",
      windSpeed: 3.07,
    },
    {
      dt: 1731596400,
      date: "2024-11-14 18:00:00",
      humidity: 72,
      icon: "10n",
      temp: 24.9,
      temp_max: 24.9,
      temp_min: 24.9,
      weather: "Rain",
      windSpeed: 3.03,
    },
  ],
};

export default function App() {
  const [weatherData, setWeatherData] = useState(defaultData);
  const [search, setSearch] = useState("");

  function handleSubmit(evnt) {
    evnt.preventDefault();
    getWeather();
    setSearch("");
  }

  function handleSetSearch(evnt) {
    setSearch(evnt.target.value);
  }

  async function getWeather() {
    try {
      const locationResponse = await fetch(
        `https://geocode.maps.co/search?q=${search}&api_key=67304255c56e5779277214uvoe94088`
      );

      const locationData = await locationResponse.json();

      const [lat, lon] = [locationData.at(0).lat, locationData.at(0).lon];
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=129ea2275221b1bb1c91adfc25f2a53f`
      );

      const data = await response.json();

      console.log(data);
      let currentTime = data.list[0].dt;

      const forecastArr = data.list
        .map((item) => {
          if (item.dt % currentTime === 0) {
            currentTime += 86400;
            return {
              dt: item.dt,
              date: item.dt_txt,
              temp: item.main.temp,
              temp_min: item.main.temp_min,
              temp_max: item.main.temp_max,
              humidity: item.main.humidity,
              weather: item.weather[0].main,
              icon: item.weather[0].icon,
              windSpeed: item.wind.speed,
            };
          }

          return null;
        })
        .filter((item) => item !== null);

      const weatherResponse = {
        id: data.city.id,
        coord: data.city.coord,
        city: data.city.name,
        country: data.city.country,
        forecast: forecastArr,
      };
      console.log(weatherResponse);
      setWeatherData(weatherResponse);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="app">
        <SearchForm
          search={search}
          onSubmit={handleSubmit}
          handleOnChange={handleSetSearch}
        />
        <WeatherInfo weatherData={weatherData} />
        <Forecast weatherData={weatherData} />
      </div>
    </>
  );
}

function SearchForm({ search, handleOnChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="enter city name"
        value={search}
        onChange={handleOnChange}
      />
      <button>🔍</button>
    </form>
  );
}
function WeatherInfo({ weatherData }) {
  return (
    <div className="weather-info">
      <h3>
        {weatherData.city}, {weatherData.country}
      </h3>
      <p>{new Date().toDateString()}</p>
      <div className="main-weather">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.forecast[0].icon}@2x.png`}
          alt="mist-night"
        />
        <p>{weatherData.forecast[0].temp}°C</p>
      </div>
      <span>{weatherData.forecast[0].weather}</span>
      <div className="other-weather">
        <p>
          {weatherData.forecast[0].windSpeed}m/s
          <br />
          Wind speed
        </p>
        <p>
          {weatherData.forecast[0].humidity}%
          <br />
          Humidity
        </p>
      </div>
    </div>
  );
}

function Forecast({ weatherData }) {
  return (
    <div className="forecast">
      <h3>5-Day Forecast:</h3>
      <ul>
        {weatherData.forecast.map((item) => (
          <ForecastItem item={item} key={item.dt} />
        ))}
      </ul>
    </div>
  );
}

function ForecastItem({ item }) {
  return (
    <li className="forecast-item">
      <h4>{weekDays[new Date(item.date).getDay()]}</h4>
      <img
        src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
        alt="mist-night"
      />
      <p>
        {item.temp_min}°/{item.temp_max}°
      </p>
    </li>
  );
}
