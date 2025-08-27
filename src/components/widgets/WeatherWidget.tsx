import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    location: 'AsphaltOS City'
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  useEffect(() => {
    // Simulate weather updates
    const conditions = ['sunny', 'cloudy', 'rainy'];
    const updateWeather = () => {
      setWeather(prev => ({
        ...prev,
        temperature: 15 + Math.random() * 20,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 40 + Math.random() * 40,
        windSpeed: 5 + Math.random() * 20
      }));
    };

    const interval = setInterval(updateWeather, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{weather.location}</div>
      
      <div className="flex items-center gap-3">
        {getWeatherIcon()}
        <div>
          <div className="text-lg font-bold">{weather.temperature.toFixed(1)}°C</div>
          <div className="text-xs capitalize text-muted-foreground">{weather.condition}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Droplets className="h-3 w-3 text-blue-400" />
          <span>{weather.humidity.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-3 w-3 text-green-400" />
          <span>{weather.windSpeed.toFixed(1)} km/h</span>
        </div>
      </div>
    </div>
  );
};