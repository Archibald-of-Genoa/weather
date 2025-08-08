import { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";
import type { Forecast, ForecastData, CityGeoData } from "../types";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const SearchBox = () => {
    const [city, setCity] = useState("");
    const [longitude, setLongitude] = useState<number | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cityList, setCityList] = useState<CityGeoData[]>([]);
    const [selectedCityIndex, setSelectedCityIndex] = useState(-1);
    
    const debouncedCity = useDebounce(city, 500);

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

    useEffect(() => {
        if (debouncedCity.length >= 2) {
            showCityList(debouncedCity, 5);
        } else {
            setShowDropdown(false);
            setCityList([]);
            setSelectedCityIndex(-1);
        }
    }, [debouncedCity]);

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
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || cityList.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedCityIndex(prev => 
                    prev < cityList.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedCityIndex(prev => 
                    prev > 0 ? prev - 1 : cityList.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedCityIndex >= 0) {
                    handleCitySelect(cityList[selectedCityIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedCityIndex(-1);
                break;
        }
    };

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        setSelectedCityIndex(-1);
    };

    async function showCityList(city: string, limit: number) {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${import.meta.env.VITE_OPENWEATHER_API}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(url);
            console.log(json);
            setCityList(json);
            setShowDropdown(true);
            
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    const handleCitySelect = (selectedCity: CityGeoData, isForecast: boolean = false) => {
        setCity(selectedCity.name);
        setShowDropdown(false);
        setSelectedCityIndex(-1);
        getForecast({ city: selectedCity.name, isForecast });
    };

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
                                    onChange={handleCityInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter city name..."
                                />
                                {showDropdown && cityList.length > 0 && (
                                    <div className="top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-2xl shadow-lg z-50 max-h-70 overflow-y-auto">
                                        {cityList.map((cityData, index) => (
                                            <div
                                                key={`${cityData.lat}-${cityData.lon}-${index}`}
                                                className="border-b border-orange-100 last:border-b-0"
                                            >
                                                <div className={`px-4 py-3 transition-colors ${
                                                    selectedCityIndex === index 
                                                        ? 'bg-orange-100' 
                                                        : 'hover:bg-orange-50'
                                                }`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 cursor-pointer" onClick={() => handleCitySelect(cityData)}>
                                                            <div className="text-gray-800 font-medium">
                                                                {cityData.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {cityData.state ? `${cityData.state}, ` : ""}{cityData.country}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <button
                                                                className="px-3 py-1 text-xs bg-amber-400 hover:bg-amber-500 text-white rounded-lg transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCitySelect(cityData, false);
                                                                }}
                                                            >
                                                                Today
                                                            </button>
                                                            <button
                                                                className="px-3 py-1 text-xs bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCitySelect(cityData, true);
                                                                }}
                                                            >
                                                                5 Days
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    onClick={() => {
                                        if (city) {
                                            getForecast({ city, isForecast: true });
                                        } else {
                                            getForecast({
                                                lat: latitude?.toString(),
                                                lon: longitude?.toString(),
                                                isForecast: true,
                                            });
                                        }
                                    }}
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
