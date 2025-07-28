import type { WeatherDataProps, ForecastData } from "../types";


const WeatherCard = ({ data }: WeatherDataProps) => {
    return (
        <div>
            <h1>Температура</h1>
            <p>{data.main.temp} ℃</p>
            <h1>Влажность</h1>
            <p>{data.main.humidity}%</p>
            <h1>Ветер</h1>
            <p>{data.wind.speed} м/с</p>
            {data.rain && data.rain["1h"] && <p>{data.rain["1h"]} мм</p>}
            <p>{data.weather[0].description}</p>
        </div>
    );
};

export default WeatherCard;
