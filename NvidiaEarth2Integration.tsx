import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeatherForecast {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  cloudCover: number;
  visibility: number;
}

interface ClimateData {
  region: string;
  historicalTrend: number[];
  anomaly: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AirQuality {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  index: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
}

export const NvidiaEarth2Integration: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    name: 'New York, NY',
  });

  const [forecasts, setForecasts] = useState<WeatherForecast[]>([
    {
      timestamp: new Date().toISOString(),
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NW',
      precipitation: 0,
      cloudCover: 30,
      visibility: 10,
    },
    {
      timestamp: new Date(Date.now() + 3600000).toISOString(),
      temperature: 23,
      humidity: 62,
      windSpeed: 14,
      windDirection: 'NW',
      precipitation: 0,
      cloudCover: 25,
      visibility: 10,
    },
  ]);

  const [climateData, setClimateData] = useState<ClimateData>({
    region: 'North Atlantic',
    historicalTrend: [19, 20, 21, 22, 22.5, 23, 23.5],
    anomaly: 2.1,
    severity: 'high',
  });

  const [airQuality, setAirQuality] = useState<AirQuality>({
    pm25: 35,
    pm10: 55,
    no2: 45,
    o3: 65,
    so2: 12,
    index: 'moderate',
  });

  const [modelResolution, setModelResolution] = useState<'0.25' | '0.5' | '1.0'>('0.25');
  const [predictionHorizon, setPredictionHorizon] = useState<'6h' | '24h' | '7d'>('24h');

  const getSeverityColor = (severity: string): string => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
      good: 'bg-green-500',
      moderate: 'bg-yellow-500',
      unhealthy: 'bg-orange-500',
      hazardous: 'bg-red-500',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500';
  };

  const handleLocationChange = useCallback((lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name });
  }, []);

  const handlePredictionUpdate = useCallback(() => {
    // Simulate API call to NVIDIA Earth-2
    const newForecast: WeatherForecast = {
      timestamp: new Date(Date.now() + 7200000).toISOString(),
      temperature: 24 + Math.random() * 5,
      humidity: 60 + Math.random() * 10,
      windSpeed: 10 + Math.random() * 8,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      precipitation: Math.random() * 5,
      cloudCover: Math.random() * 100,
      visibility: 8 + Math.random() * 2,
    };

    setForecasts(prev => [...prev.slice(-5), newForecast]);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🌍 NVIDIA Earth-2 Climate Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weather" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="climate">Climate</TabsTrigger>
              <TabsTrigger value="airquality">Air Quality</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Weather Forecasts */}
            <TabsContent value="weather" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-3">📍 Current Location: {selectedLocation.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <Button
                    onClick={() => handleLocationChange(40.7128, -74.0060, 'New York, NY')}
                    variant={selectedLocation.name === 'New York, NY' ? 'default' : 'outline'}
                  >
                    New York
                  </Button>
                  <Button
                    onClick={() => handleLocationChange(34.0522, -118.2437, 'Los Angeles, CA')}
                    variant={selectedLocation.name === 'Los Angeles, CA' ? 'default' : 'outline'}
                  >
                    Los Angeles
                  </Button>
                  <Button
                    onClick={() => handleLocationChange(41.8781, -87.6298, 'Chicago, IL')}
                    variant={selectedLocation.name === 'Chicago, IL' ? 'default' : 'outline'}
                  >
                    Chicago
                  </Button>
                  <Button
                    onClick={() => handleLocationChange(29.7604, -95.3698, 'Houston, TX')}
                    variant={selectedLocation.name === 'Houston, TX' ? 'default' : 'outline'}
                  >
                    Houston
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {forecasts.map((forecast, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold">
                        {new Date(forecast.timestamp).toLocaleTimeString()}
                      </h5>
                      <span className="text-2xl font-bold">{forecast.temperature.toFixed(1)}°C</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Humidity</p>
                        <p className="font-semibold">{forecast.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Wind</p>
                        <p className="font-semibold">
                          {forecast.windSpeed} m/s {forecast.windDirection}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Precipitation</p>
                        <p className="font-semibold">{forecast.precipitation.toFixed(1)} mm</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cloud Cover</p>
                        <p className="font-semibold">{forecast.cloudCover.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Visibility</p>
                        <p className="font-semibold">{forecast.visibility.toFixed(1)} km</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handlePredictionUpdate} className="w-full bg-blue-600 hover:bg-blue-700">
                🔄 Update Predictions
              </Button>
            </TabsContent>

            {/* Climate Analysis */}
            <TabsContent value="climate" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <h4 className="font-bold mb-3">🌡️ Climate Anomaly: {climateData.region}</h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Temperature Anomaly</span>
                      <span className="text-sm font-bold">{climateData.anomaly.toFixed(1)}°C</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getSeverityColor(climateData.severity)}`}
                        style={{ width: `${Math.min(100, climateData.anomaly * 10)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Historical Trend (7 days)</p>
                    <div className="flex items-end gap-1 h-24">
                      {climateData.historicalTrend.map((temp, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-red-500 rounded-t"
                          style={{ height: `${(temp / 25) * 100}%` }}
                          title={`${temp}°C`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border-l-4 border-red-500">
                    <p className="text-sm">
                      <span className="font-semibold">Severity:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-white text-xs font-bold ${getSeverityColor(climateData.severity)}`}>
                        {climateData.severity.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Above-normal temperatures detected. Recommend altitude adjustment for airship operations.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Air Quality */}
            <TabsContent value="airquality" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                <h4 className="font-bold mb-3">💨 Air Quality Index</h4>

                <div className={`p-4 rounded-lg mb-4 ${getSeverityColor(airQuality.index)} text-white`}>
                  <p className="text-sm font-semibold">Overall AQI Status</p>
                  <p className="text-2xl font-bold">{airQuality.index.toUpperCase()}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'PM2.5', value: airQuality.pm25, unit: 'µg/m³' },
                    { label: 'PM10', value: airQuality.pm10, unit: 'µg/m³' },
                    { label: 'NO₂', value: airQuality.no2, unit: 'ppb' },
                    { label: 'O₃', value: airQuality.o3, unit: 'ppb' },
                    { label: 'SO₂', value: airQuality.so2, unit: 'ppb' },
                  ].map(pollutant => (
                    <div key={pollutant.label} className="p-3 bg-white rounded border">
                      <p className="text-xs text-gray-600">{pollutant.label}</p>
                      <p className="text-lg font-bold">{pollutant.value}</p>
                      <p className="text-xs text-gray-500">{pollutant.unit}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Moderate air quality. Recommend sensor recalibration for optical systems.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label className="text-sm font-semibold">Model Resolution</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(['0.25', '0.5', '1.0'] as const).map(res => (
                      <button
                        key={res}
                        onClick={() => setModelResolution(res)}
                        className={`p-2 rounded text-sm font-medium transition ${
                          modelResolution === res
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {res}°
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Higher resolution = more detail but slower processing</p>
                </div>

                <div>
                  <label className="text-sm font-semibold">Prediction Horizon</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(['6h', '24h', '7d'] as const).map(horizon => (
                      <button
                        key={horizon}
                        onClick={() => setPredictionHorizon(horizon)}
                        className={`p-2 rounded text-sm font-medium transition ${
                          predictionHorizon === horizon
                            ? 'bg-purple-500 text-white'
                            : 'bg-white border border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {horizon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm font-semibold">Current Configuration</p>
                  <p className="text-xs text-gray-700 mt-1">
                    Resolution: {modelResolution}° | Horizon: {predictionHorizon}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
