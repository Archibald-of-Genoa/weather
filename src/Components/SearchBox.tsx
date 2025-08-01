import { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";
import type { Forecast, ForecastData } from "../types";

const SearchBox = () => {
    const [city, setCity] = useState("");
    const [longitude, setLongitude] = useState<number | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { coords } = position;
                    setLongitude(coords.longitude);
                    setLatitude(coords.latitude);
                    console.log(coords.longitude, coords.latitude);
                },
                (error) => {
                    console.log("Геолокация не определена", error);
                }
            );
        } else {
            alert("Геопозиция не определена");
        }
    };

    useEffect(() => getLocation(), []);

    useEffect(() => {
        if (latitude === null || longitude === null) return;

        const fetchForecast = () => {
            getForecast({
                lat: latitude.toString(),
                lon: longitude.toString(),
            });
        };
        fetchForecast();
    }, [latitude, longitude]);

    async function getForecast({ city, lat, lon, isForecast, cnt }: Forecast) {
        const params = new URLSearchParams({
            appid: import.meta.env.VITE_OPENWEATHER_API,
            units: "metric",
            lang: "ru",
        });

        if (city) {
            params.append("q", city);
        } else if (lat && lon) {
            params.append("lat", lat);
            params.append("lon", lon);
        }

        if (cnt) {
            params.append("cnt", cnt);
        } 

        const endpoint = isForecast ? "forecast" : "weather";
        const url = `https://api.openweathermap.org/data/2.5/${endpoint}?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setForecastData(json);
            console.log(url)
            console.log(json)
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    return (
        <div className="">
            <div className="">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        getForecast({ city });
                    }}
                >
                    <input
                        className=""
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                    />
                    <button className="cursor-pointer border" type="submit">
                        Прогноз на сегодня
                    </button>
                </form>
                <button className="cursor-pointer border" onClick={getLocation}>
                    Получить координаты
                </button>
                <button
                    onClick={() =>
                        getForecast({
                            lat: latitude?.toString(),
                            lon: longitude?.toString(),
                            isForecast: true,
                            cnt: "40"
                        })
                    }
                >
                    Прогноз на 5 дней
                </button>
                {forecastData && <WeatherCard data={forecastData} />}
            </div>
        </div>
    );
};

export default SearchBox;
