export type Forecast = {
    lat?: string | null;
    lon?: string | null;
    city?: string;
    isForecast?: boolean;
    cnt?: string | null
};

export type WeatherItem = {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
    };
    weather: Array<{
        description: string;
    }>;
    wind: {
        speed: number;
    };
    dt_txt?: string;
};

export type ForecastData = WeatherItem & {
    list?: WeatherItem[];
    cnt?: number;
    cod?: string;
    message?: number;
    city?: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
    };
};

export type WeatherDataProps = {
    data: ForecastData;
};
