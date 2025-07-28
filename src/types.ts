export type Forecast = {
    lat?: string | null;
    lon?: string | null;
    city?: string;
    isForecast?: boolean;
    cnt?: string | null
};

export type ForecastData = {
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
    rain?: {
        "1h"?: number;
    };
};

export type WeatherDataProps = {
    data: ForecastData;
};
