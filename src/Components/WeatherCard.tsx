import type { WeatherDataProps } from "../types";

const WeatherCard = ({ data }: WeatherDataProps) => {
    if (data.list) {
        const groupedByDate = data.list.reduce((acc, elem) => {
            const date = elem.dt_txt?.split(' ')[0];
            if (date) {
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(elem);
            }
            console.log(acc)
            return acc;
        }, {} as Record<string, typeof data.list>);

        return (
            <div className="grid gap-6">
                {Object.entries(groupedByDate).map(([date, items]) => (
                    <div key={date} className="grid-row">
                        <h3 className="text-lg font-semibold mb-4">{date}</h3>
                        <div className="flex gap-4 overflow-x-auto">
                            {items.map((elem, index) => (
                                <div key={index} className="border p-4 rounded min-w-64 flex-shrink-0">
                                    <p className="text-sm text-gray-600">{elem.dt_txt?.split(' ')[1]}</p>
                                    <h4>Температура</h4>
                                    <p>{elem.main.temp} ℃</p>
                                    <h4>Влажность</h4>
                                    <p>{elem.main.humidity}%</p>
                                    <h4>Ветер</h4>
                                    <p>{elem.wind.speed} м/с</p>
                                    <p>{elem.weather[0].description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1>Температура</h1>
            <p>{data.main.temp} ℃</p>
            <h1>Влажность</h1>
            <p>{data.main.humidity}%</p>
            <h1>Ветер</h1>
            <p>{data.wind.speed} м/с</p>
            <p>{data.weather[0].description}</p>
        </div>
    );
};

export default WeatherCard;
