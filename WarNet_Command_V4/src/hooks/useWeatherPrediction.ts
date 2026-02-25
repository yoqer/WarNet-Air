import { useState, useCallback } from "react";

export interface WeatherForecast {
  timestamp: Date;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
}

export interface WeatherData {
  current: WeatherForecast;
  forecast15d: WeatherForecast[];
  forecast7d: WeatherForecast[];
  forecast3d: WeatherForecast[];
  forecast2d: WeatherForecast[];
  forecast1d: WeatherForecast[];
  realtime: WeatherForecast[];
  loading: boolean;
  error?: string;
}

// Simulación de datos meteorológicos realistas
const generateForecast = (
  baseTemp: number,
  days: number,
  interval: number = 1
): WeatherForecast[] => {
  const forecasts: WeatherForecast[] = [];
  const now = new Date();

  for (let i = 0; i < days * (24 / interval); i++) {
    const timestamp = new Date(now.getTime() + i * interval * 60 * 60 * 1000);
    const hourOfDay = timestamp.getHours();
    const dayOfYear = timestamp.getDay();

    // Variación diaria de temperatura (más frío de noche)
    const tempVariation = Math.sin((hourOfDay - 6) * (Math.PI / 12)) * 8;
    const weekVariation = Math.sin((dayOfYear / 7) * Math.PI) * 5;

    forecasts.push({
      timestamp,
      temperature: baseTemp + tempVariation + weekVariation + (Math.random() - 0.5) * 3,
      windSpeed: 8 + Math.sin(dayOfYear * 0.5) * 5 + (Math.random() - 0.5) * 3,
      windDirection: (dayOfYear * 45 + Math.random() * 30) % 360,
      humidity: 60 + Math.sin(hourOfDay * (Math.PI / 12)) * 20 + (Math.random() - 0.5) * 10,
      pressure: 1013 + Math.sin(dayOfYear * 0.1) * 10 + (Math.random() - 0.5) * 5,
      precipitation: Math.max(0, Math.sin(dayOfYear * 0.3) * 5 + (Math.random() - 0.5) * 3),
      cloudCover: Math.max(0, Math.min(100, 50 + Math.sin(dayOfYear * 0.2) * 30 + (Math.random() - 0.5) * 20)),
      visibility: 10 - Math.sin(dayOfYear * 0.1) * 3 + (Math.random() - 0.5) * 2,
      uvIndex: Math.max(0, 5 + Math.sin(hourOfDay * (Math.PI / 12)) * 4),
    });
  }

  return forecasts;
};

export function useWeatherPrediction(latitude: number, longitude: number) {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: {
      timestamp: new Date(),
      temperature: -56.2,
      windSpeed: 12.5,
      windDirection: 245,
      humidity: 35,
      pressure: 1013,
      precipitation: 0,
      cloudCover: 45,
      visibility: 10,
      uvIndex: 0,
    },
    forecast15d: [],
    forecast7d: [],
    forecast3d: [],
    forecast2d: [],
    forecast1d: [],
    realtime: [],
    loading: false,
  });

  const fetchWeatherData = useCallback(async () => {
    setWeatherData((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      // Simular llamadas a APIs de meteorología
      // En producción, estas serían llamadas reales a OpenWeatherMap, NVIDIA Earth-2, etc.

      const baseTemp = -56.2;

      const forecasts = {
        current: {
          timestamp: new Date(),
          temperature: baseTemp,
          windSpeed: 12.5,
          windDirection: 245,
          humidity: 35,
          pressure: 1013,
          precipitation: 0,
          cloudCover: 45,
          visibility: 10,
          uvIndex: 0,
        },
        forecast15d: generateForecast(baseTemp, 15, 6), // Cada 6 horas
        forecast7d: generateForecast(baseTemp, 7, 3), // Cada 3 horas
        forecast3d: generateForecast(baseTemp, 3, 1), // Cada hora
        forecast2d: generateForecast(baseTemp, 2, 1), // Cada hora
        forecast1d: generateForecast(baseTemp, 1, 0.5), // Cada 30 minutos
        realtime: generateForecast(baseTemp, 0.5, 0.25), // Cada 15 minutos
      };

      setWeatherData((prev) => ({
        ...prev,
        ...forecasts,
        loading: false,
      }));
    } catch (error) {
      setWeatherData((prev) => ({
        ...prev,
        loading: false,
        error: `Error fetching weather: ${(error as Error).message}`,
      }));
    }
  }, [latitude, longitude]);

  const getOptimalRoute = useCallback(
    (forecast: WeatherForecast[]): { time: Date; score: number }[] => {
      // Calcular puntuación de optimalidad basada en condiciones meteorológicas
      return forecast.map((f) => {
        // Factores: viento bajo, visibilidad alta, sin precipitación
        const windScore = Math.max(0, 100 - f.windSpeed * 5);
        const visibilityScore = f.visibility * 10;
        const precipScore = Math.max(0, 100 - f.precipitation * 20);
        const cloudScore = Math.max(0, 100 - f.cloudCover * 0.5);

        const totalScore = (windScore + visibilityScore + precipScore + cloudScore) / 4;

        return {
          time: f.timestamp,
          score: Math.min(100, totalScore),
        };
      });
    },
    []
  );

  return {
    ...weatherData,
    fetchWeatherData,
    getOptimalRoute,
  };
}
