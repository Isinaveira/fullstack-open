import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const getWeatherInfo = (capital) => {
  const request = axios.get(`${baseUrl}?q=${capital}&appid=${api_key}&units=metric`);
  return request.then(response => response.data);
};

export default { getWeatherInfo };