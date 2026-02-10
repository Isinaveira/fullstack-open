import { useState, useEffect } from "react";
import countriesService from "./services/countriesService";

const SearchCountryInput = (props) => {
  return (
    <input
      type="text"
      value={props.searchedCountry}
      onChange={props.searchCountry}
    />
  );
};

const CountryInfo = ({ country }) => {
  return (
    <li key={country.name.common}>
      <h1>{country.name.common}</h1>

      <p>Capital: {country.capital?.[0] ?? "N/A"}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      {country.languages ? (
        <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
      ) : (
        <p>No language data</p>
      )}
      <img src={country.flags.png} alt="Country has no flag" />
    </li>
  );
};

const CountriesList = ({ countries }) => {
  return (
    <>
      {countries.map((country) => (
        <p>{country.name.common}</p>
      ))}
    </>
  );
};

const App = () => {
  const [searchedCountry, setSearchedCountry] = useState("");
  const [countries, setCountries] = useState([]);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchedCountry.toLowerCase()),
  );

  useEffect(() => {
    countriesService.getAllCountries().then((countries) => {
      console.log(countries);
      setCountries(countries);
    });
  }, []);

  const searchCountry = (event) => {
    setSearchedCountry(event.target.value);
  };

  return (
    <>
      find countries: 
      <SearchCountryInput
        searchedCountry={searchedCountry}
        searchCountry={searchCountry}
      />
      {filteredCountries.length > 1 && filteredCountries.length < 10 && (
        <CountriesList countries={filteredCountries} />
      )}
      {filteredCountries.length === 1 && (
        <CountryInfo country={filteredCountries[0]} />
      )}
      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
    </>
  );
};

export default App;
