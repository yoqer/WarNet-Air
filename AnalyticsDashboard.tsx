import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MetricData {
  timestamp: string;
  value: number;
}

interface SensorReading {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, MetricData[]>>({
    altitude: Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - (11 - i) * 60000).toISOString(),
      value: 400 + Math.random() * 200,
    })),
    temperature: Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - (11 - i) * 60000).toISOString(),
      value: 15 + Math.random() * 10,
    })),
    humidity: Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - (11 - i) * 60000).toISOString(),
      value: 40 + Math.random() * 40,
    })),
    windSpeed: Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - (11 - i) * 60000).toISOString(),
      value: 5 + Math.random() * 20,
    })),
  });

  const [sensors, setSensors] = useState<SensorReading[]>([
    { name: 'Radar', value: 98, unit: '%', status: 'normal', trend: 'stable' },
    { name: 'Thermal', value: 95, unit: '%', status: 'normal', trend: 'up' },
    { name: 'LIDAR', value: 87, unit: '%', status: 'warning', trend: 'down' },
    { name: 'Optical', value: 92, unit: '%', status: 'normal', trend: 'stable' },
    { name: 'GPS', value: 99, unit: '%', status: 'normal', trend: 'up' },
    { name: 'Battery', value: 78, unit: '%', status: 'normal', trend: 'down' },
  ]);

  const [fleetStats, setFleetStats] = useState({
    totalAirships: 5,
    activeAirships: 4,
    idleAirships: 1,
    averageBattery: 76,
    totalFlightHours: 2847,
    missionsCompleted: 156,
    successRate: 98.7,
  });

  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metrics>('altitude');

  const getStatusColor = (status: string): string => {
    const colors = {
      normal: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600',
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusBg = (status: string): string => {
    const colors = {
      normal: 'bg-green-100',
      warning: 'bg-yellow-100',
      critical: 'bg-red-100',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100';
  };

  const getTrendIcon = (trend: string): string => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️',
    };
    return icons[trend as keyof typeof icons] || '➡️';
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        altitude: [
          ...prev.altitude.slice(1),
          {
            timestamp: new Date().toISOString(),
            value: 400 + Math.random() * 200,
          },
        ],
        temperature: [
          ...prev.temperature.slice(1),
          {
            timestamp: new Date().toISOString(),
            value: 15 + Math.random() * 10,
          },
        ],
        humidity: [
          ...prev.humidity.slice(1),
          {
            timestamp: new Date().toISOString(),
            value: 40 + Math.random() * 40,
          },
        ],
        windSpeed: [
          ...prev.windSpeed.slice(1),
          {
            timestamp: new Date().toISOString(),
            value: 5 + Math.random() * 20,
          },
        ],
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentMetrics = metrics[selectedMetric];
  const minValue = Math.min(...currentMetrics.map(m => m.value));
  const maxValue = Math.max(...currentMetrics.map(m => m.value));
  const avgValue = currentMetrics.reduce((sum, m) => sum + m.value, 0) / currentMetrics.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📊 Real-Time Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="sensors">Sensors</TabsTrigger>
              <TabsTrigger value="fleet">Fleet</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {Object.keys(metrics).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key as keyof typeof metrics)}
                    className={`p-2 rounded text-sm font-medium transition ${
                      selectedMetric === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-3xl font-bold">
                    {currentMetrics[currentMetrics.length - 1].value.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-3xl font-bold">{avgValue.toFixed(1)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Range</p>
                  <p className="text-3xl font-bold">
                    {(maxValue - minValue).toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold mb-3">Last 12 Minutes</p>
                <div className="flex items-end gap-1 h-32">
                  {currentMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                      style={{
                        height: `${((metric.value - minValue) / (maxValue - minValue)) * 100}%`,
                      }}
                      title={`${metric.value.toFixed(1)}`}
                    />
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-white rounded border">
                  <p className="text-gray-600">Min</p>
                  <p className="text-xl font-bold">{minValue.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-gray-600">Max</p>
                  <p className="text-xl font-bold">{maxValue.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-gray-600">Avg</p>
                  <p className="text-xl font-bold">{avgValue.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-gray-600">Samples</p>
                  <p className="text-xl font-bold">{currentMetrics.length}</p>
                </div>
              </div>
            </TabsContent>

            {/* Sensors Tab */}
            <TabsContent value="sensors" className="space-y-3">
              {sensors.map((sensor, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${getStatusBg(sensor.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{sensor.name}</h4>
                    <span className={`text-lg ${getStatusColor(sensor.trend)}`}>
                      {getTrendIcon(sensor.trend)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {sensor.value}
                        <span className="text-sm text-gray-600 ml-1">{sensor.unit}</span>
                      </p>
                      <p className={`text-xs font-semibold ${getStatusColor(sensor.status)}`}>
                        {sensor.status.toUpperCase()}
                      </p>
                    </div>

                    <div className="w-24 h-16 bg-white rounded">
                      <div
                        className={`w-full h-full rounded flex items-center justify-center text-sm font-bold ${
                          sensor.status === 'normal'
                            ? 'bg-green-100 text-green-700'
                            : sensor.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        style={{ width: `${sensor.value}%` }}
                      >
                        {sensor.value}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Fleet Tab */}
            <TabsContent value="fleet" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Airships</p>
                  <p className="text-3xl font-bold">{fleetStats.totalAirships}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">{fleetStats.activeAirships}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Idle</p>
                  <p className="text-3xl font-bold text-yellow-600">{fleetStats.idleAirships}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Battery</p>
                  <p className="text-3xl font-bold">{fleetStats.averageBattery}%</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600">Flight Hours</p>
                  <p className="text-3xl font-bold">{fleetStats.totalFlightHours}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600">Missions</p>
                  <p className="text-3xl font-bold">{fleetStats.missionsCompleted}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <p className="text-sm font-semibold mb-2">Success Rate</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-300 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
                      style={{ width: `${fleetStats.successRate}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold">{fleetStats.successRate}%</p>
                </div>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: 'API Response Time', value: 45, unit: 'ms', target: 100 },
                  { label: 'Database Query', value: 120, unit: 'ms', target: 200 },
                  { label: 'Cache Hit Rate', value: 92, unit: '%', target: 80 },
                  { label: 'Uptime', value: 99.95, unit: '%', target: 99.9 },
                ].map((perf, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{perf.label}</p>
                      <p className="text-lg font-bold">
                        {perf.value}
                        <span className="text-sm text-gray-600 ml-1">{perf.unit}</span>
                      </p>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          perf.value >= perf.target ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, (perf.value / perf.target) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Target: {perf.target}{perf.unit}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
