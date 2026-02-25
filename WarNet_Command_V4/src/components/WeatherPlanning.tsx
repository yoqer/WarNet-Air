import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useWeatherPrediction, WeatherForecast } from "@/hooks/useWeatherPrediction";

type ForecastPeriod = "15d" | "7d" | "3d" | "2d" | "1d" | "realtime";

export function WeatherPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState<ForecastPeriod>("7d");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const { current, forecast7d, forecast3d, forecast1d, fetchWeatherData, getOptimalRoute } =
    useWeatherPrediction(40.7128, -74.006);

  useEffect(() => {
    fetchWeatherData();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  const getForecastData = (): WeatherForecast[] => {
    switch (selectedPeriod) {
      case "7d":
        return forecast7d;
      case "3d":
        return forecast3d;
      case "1d":
        return forecast1d;
      default:
        return forecast7d;
    }
  };

  const currentForecast = getForecastData();
  const optimalTimes = getOptimalRoute(currentForecast);

  const getBestWindow = () => {
    if (optimalTimes.length === 0) return null;
    return optimalTimes.reduce((best, current) =>
      current.score > best.score ? current : best
    );
  };

  const bestWindow = getBestWindow();

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "15d", label: "15 días" },
          { key: "7d", label: "7 días" },
          { key: "3d", label: "3 días" },
          { key: "2d", label: "2 días" },
          { key: "1d", label: "1 día" },
          { key: "realtime", label: "Tiempo Real" },
        ].map((period) => (
          <Button
            key={period.key}
            variant={selectedPeriod === period.key ? "default" : "outline"}
            onClick={() => setSelectedPeriod(period.key as ForecastPeriod)}
            className="text-sm"
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Current Conditions */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          Condiciones Actuales
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Temperatura</p>
            <p className="text-2xl font-bold">{current.temperature.toFixed(1)}°C</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Viento</p>
            <p className="text-2xl font-bold">{current.windSpeed.toFixed(1)} m/s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Visibilidad</p>
            <p className="text-2xl font-bold">{current.visibility.toFixed(1)} km</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Cobertura Nubosa</p>
            <p className="text-2xl font-bold">{current.cloudCover.toFixed(0)}%</p>
          </div>
        </div>
      </Card>

      {/* Optimal Flight Window */}
      {bestWindow && (
        <Card className="bg-green-950/30 border border-green-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ventana de Vuelo Óptima
              </h3>
              <p className="text-sm text-slate-300">
                {bestWindow.time.toLocaleString()} - Puntuación: {bestWindow.score.toFixed(1)}/100
              </p>
            </div>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setSelectedRoute(bestWindow.time.toISOString())}
            >
              Usar Ventana
            </Button>
          </div>
        </Card>
      )}

      {/* Forecast Timeline */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="font-semibold mb-4">Pronóstico Detallado</h3>
        <div className="space-y-3 max-h-96 overflow-auto">
          {currentForecast.slice(0, 24).map((forecast, idx) => {
            const optimalScore = optimalTimes[idx]?.score || 0;
            const isOptimal = optimalScore > 75;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  isOptimal
                    ? "bg-green-950/30 border-green-700 hover:border-green-600"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                }`}
                onClick={() => setSelectedRoute(forecast.timestamp.toISOString())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {forecast.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        {forecast.windSpeed.toFixed(1)} m/s
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {forecast.visibility.toFixed(1)} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {forecast.precipitation.toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{forecast.temperature.toFixed(1)}°C</p>
                    <p className={`text-xs font-semibold ${isOptimal ? "text-green-400" : "text-slate-400"}`}>
                      {optimalScore.toFixed(0)}/100
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Route Planning */}
      {selectedRoute && (
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-500" />
            Planificación de Ruta
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Hora de Despegue</p>
              <p className="text-lg font-mono">
                {new Date(selectedRoute).toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Altitud Recomendada</p>
                <p className="text-2xl font-bold">38,000 m</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Velocidad Crucero</p>
                <p className="text-2xl font-bold">8.5 m/s</p>
              </div>
            </div>
            <Button className="w-full" variant="default">
              Confirmar Ruta
            </Button>
          </div>
        </Card>
      )}

      {/* Warnings */}
      {current.windSpeed > 20 && (
        <Card className="bg-red-950/30 border border-red-800 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Alerta: Vientos Fuertes</p>
              <p className="text-xs text-red-300 mt-1">
                Velocidad de viento superior a 20 m/s. Considere esperar a mejores condiciones.
              </p>
            </div>
          </div>
        </Card>
      )}

      {current.cloudCover > 80 && (
        <Card className="bg-yellow-950/30 border border-yellow-800 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Advertencia: Cobertura Nubosa Alta</p>
              <p className="text-xs text-yellow-300 mt-1">
                Cobertura nubosa superior al 80%. Visibilidad reducida para paneles solares.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
