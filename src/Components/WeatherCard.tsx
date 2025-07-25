import type { WeatherDataProps } from "../types";


const WeatherCard = ({data}: WeatherDataProps) => {
  return (
    <div>
        <p>{data.weather[0].description}</p>
    </div>
  );
};

export default WeatherCard;