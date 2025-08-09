import type { Forecast, ForecastData } from "./types";

export async function getForecast({ city, lat, lon, isForecast }: Forecast) {
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

        const json: ForecastData = await response.json();
        return json;
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
    }
}
