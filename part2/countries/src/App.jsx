import { useState, useEffect } from "react";
import countriesService from "./services/countriesService";
import weatherService from "./services/weatherService";

const SearchCountryInput = ({ searchedCountry, searchCountry }) => {
  return (
    <input
      type="text"
      value={searchedCountry}
      onChange={searchCountry}
      placeholder="Search for a country..."
    />
  );
};

const WeatherInCapital = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital) return;

    weatherService
      .getWeatherInfo(capital)
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather:", error));
  }, [capital]);

  if (!weather) return null;

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp} Celsius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
        alt={weather.weather[0].description} 
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

const CountryInfo = ({ country }) => {
  const capital = country.capital && country.capital.length > 0 ? country.capital[0] : null;

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {capital ?? "N/A"}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      {country.languages ? (
        <ul>
          {Object.entries(country.languages).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No language data</p>
      )}
      
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
      />
      
      {capital && <WeatherInCapital capital={capital} />}
    </div>
  );
};

const CountriesList = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => showCountry(country.name.common)}>show</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [searchedCountry, setSearchedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countriesService.getAllCountries().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  const searchCountry = (event) => {
    setSearchedCountry(event.target.value);
    setSelectedCountry(null); // Reseteamos la selección al buscar de nuevo
  };

  const showCountry = (countryName) => {
    const country = countries.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );
    setSelectedCountry(country);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchedCountry.toLowerCase())
  );

  return (
    <div>
      <p>
        find countries:{" "}
        <SearchCountryInput
          searchedCountry={searchedCountry}
          searchCountry={searchCountry}
        />
      </p>

      
      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length > 1 &&
        filteredCountries.length <= 10 &&
        !selectedCountry && (
          <CountriesList
            countries={filteredCountries}
            showCountry={showCountry}
          />
        )}

      {filteredCountries.length === 1 && !selectedCountry && (
        <CountryInfo country={filteredCountries[0]} />
      )}

      {selectedCountry && <CountryInfo country={selectedCountry} />}
    </div>
  );
};

export default App;