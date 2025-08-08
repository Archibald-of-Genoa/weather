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
            return acc;
        }, {} as Record<string, typeof data.list>);

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-orange-800 mb-6 text-center"> The weather forecast for {data.city?.name} in the next 5 days </h3>
                {Object.entries(groupedByDate).map(([date, items]) => (
                    <div key={date} className="bg-gradient-to-r from-orange-200/60 to-amber-200/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-orange-800 mb-6 text-center">
                            {new Date(date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                            {items.map((elem, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl min-w-64 flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200 border border-orange-100"
                                >
                                    <div className="text-center mb-4">
                                        <p className="text-sm font-medium text-orange-600">
                                            {elem.dt_txt?.split(' ')[1].slice(0, 5)}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-r from-red-100 to-orange-100 p-3 rounded-xl">
                                            <h4 className="text-sm font-semibold text-red-700 mb-1">Temperature</h4>
                                            <p className="text-xl font-bold text-red-800">{Math.round(elem.main.temp)}°C</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-xl">
                                            <h4 className="text-sm font-semibold text-blue-700 mb-1">Humidity</h4>
                                            <p className="text-lg font-medium text-blue-800">{elem.main.humidity}%</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                                            <h4 className="text-sm font-semibold text-green-700 mb-1">Wind</h4>
                                            <p className="text-lg font-medium text-green-800">{elem.wind.speed} m/s</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-3 rounded-xl">
                                            <p className="text-sm font-medium text-amber-700 capitalize text-center">
                                                {elem.weather[0].description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-orange-200/80 to-amber-200/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-orange-800 mb-2">Current weather in {data.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-red-700 mb-3">Temperature</h3>
                    <p className="text-4xl font-bold text-red-800">{Math.round(data.main.temp)}°C</p>
                    <p className="text-sm text-red-600 mt-2">Feels like {Math.round(data.main.feels_like)}°C</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Humidity</h3>
                    <p className="text-3xl font-bold text-blue-800">{data.main.humidity}%</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-green-700 mb-3">Wind Speed</h3>
                    <p className="text-3xl font-bold text-green-800">{data.wind.speed} m/s</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-amber-700 mb-3">Conditions</h3>
                    <p className="text-xl font-medium text-amber-800 capitalize">{data.weather[0].description}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
