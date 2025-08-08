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

    async function getForecast({ city, lat, lon, isForecast }: Forecast) {
        const params = new URLSearchParams({
            appid: import.meta.env.VITE_OPENWEATHER_API,
            units: "metric",
            lang: "en",
        });

        if (city) {
            params.append("q", city);
        } else if (lat && lon) {
            params.append("lat", lat);
            params.append("lon", lon);
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
            console.log(url);
            console.log(json);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-orange-200/80 to-amber-200/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 mb-8">
                    <div className="space-y-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                getForecast({ city });
                            }}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 rounded-2xl bg-white/90 border-2 border-orange-200 focus:border-orange-400 focus:outline-none text-gray-700 placeholder-gray-500 text-lg shadow-sm"
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter city name..."
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                                    onClick={getLocation}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">My Location</span>
                                </button>
                                
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                                    </svg>
                                    <span className="font-medium">Today</span>
                                </button>
                                
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-6 py-3 bg-red-400 hover:bg-red-500 text-white rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                                    onClick={() =>
                                        getForecast({
                                            lat: latitude?.toString(),
                                            lon: longitude?.toString(),
                                            isForecast: true,
                                        })
                                    }
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">5 Days</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {forecastData && <WeatherCard data={forecastData} />}
            </div>
        </div>
    );
};

export default SearchBox;
