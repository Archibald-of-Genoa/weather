export type Forecast = {
    lat?: string | null;
    lon?: string | null;
    city?: string;
};

export type ForecastData = {
    weather: Array<{
        description: string;
    }>;
};

export type WeatherDataProps = {
    data: ForecastData
}