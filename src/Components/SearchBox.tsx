import { useState } from "react";

const SearchBox = () => {
    const [city, setCity] = useState("Москва");
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0)

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { coords } = position;
                    setLongitude(coords.longitude);
                    setLatitude(coords.latitude)
                    console.log(coords.longitude, coords.latitude)
                },
                (error) => {
                    console.error(error);
                    alert("Ошибка при получении геопозиции");
                }
            );

            
        } else {
            alert("Геопозиция не определена");
        }
    };

    async function getForecast() {
        const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            appid: import.meta.env.VITE_OPENWEATHER_API
        });

        const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    // async function getData() {
    //     const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${
    //         import.meta.env.VITE_OPENWEATHER_API
    //     }`;
    //     try {
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //             throw new Error(`Response status: ${response.status}`);
    //         }

    //         const json = await response.json();
    //         console.log(json);
    //     } catch (e) {
    //         console.error((e as Error).message);
    //     }
    // }

    return (
        <div>
            <h1>{city}</h1>
            <p>{longitude}</p>
            <p>{latitude}</p>
            <input
                type="text"
                placeholder="Введите город"
                value={city}
                onChange={(event) => setCity(event.target.value)}
            />
            <button onClick={getLocation}>Получить координаты</button>
            <button onClick={getForecast} >Получить местный прогноз</button>
        </div>
    );
};

export default SearchBox;
