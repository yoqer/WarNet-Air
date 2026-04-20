import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KPI {
  id: string;
  title: string;
  value: number | string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  target: number | string;
  status: 'good' | 'warning' | 'critical';
  icon: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const KPIDashboard: React.FC = () => {
  const [kpis] = useState<KPI[]>([
    {
      id: 'fleet-health',
      title: 'Fleet Health',
      value: 98.7,
      unit: '%',
      trend: 'up',
      trendValue: 2.3,
      target: 95,
      status: 'good',
      icon: '❤️',
    },
    {
      id: 'mission-success',
      title: 'Mission Success Rate',
      value: 98.4,
      unit: '%',
      trend: 'stable',
      trendValue: 0,
      target: 95,
      status: 'good',
      icon: '🎯',
    },
    {
      id: 'avg-battery',
      title: 'Avg Battery Level',
      value: 76,
      unit: '%',
      trend: 'down',
      trendValue: -5.2,
      target: 80,
      status: 'warning',
      icon: '🔋',
    },
    {
      id: 'uptime',
      title: 'System Uptime',
      value: 99.95,
      unit: '%',
      trend: 'stable',
      trendValue: 0,
      target: 99.9,
      status: 'good',
      icon: '⏱️',
    },
    {
      id: 'response-time',
      title: 'Avg Response Time',
      value: 45,
      unit: 'ms',
      trend: 'down',
      trendValue: -8,
      target: 50,
      status: 'good',
      icon: '⚡',
    },
    {
      id: 'data-processed',
      title: 'Data Processed',
      value: 2.4,
      unit: 'TB',
      trend: 'up',
      trendValue: 15.3,
      target: 2,
      status: 'good',
      icon: '📊',
    },
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Low Battery Alert',
      message: 'Airship Beta-2 battery at 25%. Recommend landing within 15 minutes.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false,
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Mission Completed',
      message: 'Reconnaissance mission Alpha-1 completed successfully.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      resolved: false,
    },
    {
      id: 'alert-3',
      type: 'critical',
      title: 'Sensor Malfunction',
      message: 'LIDAR sensor on Gamma-3 offline. Switching to backup.',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      resolved: true,
    },
  ]);

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const getStatusColor = (status: string): string => {
    if (status === 'good') return 'bg-green-100 border-green-500';
    if (status === 'warning') return 'bg-yellow-100 border-yellow-500';
    if (status === 'critical') return 'bg-red-100 border-red-500';
    return 'bg-gray-100 border-gray-500';
  };

  const getTrendIcon = (trend: string, value: number): string => {
    if (trend === 'up') return value > 0 ? '📈' : '📉';
    if (trend === 'down') return value < 0 ? '📉' : '📈';
    return '➡️';
  };

  const getAlertIcon = (type: string): string => {
    if (type === 'critical') return '🚨';
    if (type === 'warning') return '⚠️';
    return 'ℹ️';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>📊 KPI Dashboard</CardTitle>
            <div className="flex gap-2">
              {(['1h', '24h', '7d', '30d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kpis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* KPIs Tab */}
            <TabsContent value="kpis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map(kpi => (
                  <div
                    key={kpi.id}
                    onClick={() => setSelectedKPI(kpi.id)}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition ${getStatusColor(
                      kpi.status
                    )} ${selectedKPI === kpi.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{kpi.icon}</span>
                      <span className="text-xl font-bold">{getTrendIcon(kpi.trend, kpi.trendValue)}</span>
                    </div>

                    <h4 className="font-semibold text-sm mb-1">{kpi.title}</h4>

                    <div className="mb-2">
                      <p className="text-2xl font-bold">
                        {kpi.value}
                        <span className="text-sm text-gray-600 ml-1">{kpi.unit}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Target: {kpi.target}{kpi.unit}</span>
                      <span className={`font-semibold ${kpi.trendValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPI Details */}
              {selectedKPI && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold mb-3">{kpis.find(k => k.id === selectedKPI)?.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Current Value:</span>{' '}
                      {kpis.find(k => k.id === selectedKPI)?.value}
                      {kpis.find(k => k.id === selectedKPI)?.unit}
                    </p>
                    <p>
                      <span className="font-semibold">Target:</span>{' '}
                      {kpis.find(k => k.id === selectedKPI)?.target}
                      {kpis.find(k => k.id === selectedKPI)?.unit}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          kpis.find(k => k.id === selectedKPI)?.status === 'good'
                            ? 'bg-green-500 text-white'
                            : kpis.find(k => k.id === selectedKPI)?.status === 'warning'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {kpis.find(k => k.id === selectedKPI)?.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  } ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                      <div>
                        <h4 className="font-bold">{alert.title}</h4>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                      </div>
                    </div>
                    {alert.resolved && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              <div className="space-y-3">
                {kpis.map(kpi => (
                  <div key={kpi.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-sm">{kpi.title}</p>
                      <p className="text-sm font-bold">
                        {kpi.value}
                        {kpi.unit}
                      </p>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          kpi.status === 'good'
                            ? 'bg-green-500'
                            : kpi.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            typeof kpi.value === 'number'
                              ? (kpi.value / (typeof kpi.target === 'number' ? kpi.target : 100)) * 100
                              : 50
                          )}%`,
                        }}
                      />
                    </div>
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
