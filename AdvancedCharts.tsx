import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChartData {
  labels: string[] | string;
  datasets: {
    label: string;
    data: number[];
    borderColor: string | string[];
    backgroundColor: string | string[];
    fill?: boolean;
    tension?: number;
  }[];
}

export const AdvancedCharts: React.FC = () => {
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const areaChartRef = useRef<HTMLCanvasElement>(null);

  // Datos de ejemplo para gráficos
  const lineChartData: ChartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i}:00`) as unknown as string[],
    datasets: [
      {
        label: 'Altitud (m)',
        data: [400, 420, 450, 480, 500, 520, 510, 490, 470, 450, 430, 420],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Velocidad (m/s)',
        data: [12, 14, 16, 18, 20, 22, 21, 19, 17, 15, 13, 12],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData: ChartData = {
    labels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'] as unknown as string[],
    datasets: [
      {
        label: 'Misiones Completadas',
        data: [45, 38, 52, 41, 39],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Misiones Pendientes',
        data: [5, 12, 8, 9, 11],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
      },
    ],
  };

  const pieChartData: ChartData = {
    labels: ['Exitosas', 'Con Advertencias', 'Fallidas'] as unknown as string[],
    datasets: [
      {
        label: 'Estado de Misiones',
        data: [156, 28, 5],
        borderColor: ['#10b981', '#f59e0b', '#ef4444'],
        backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'],
      },
    ],
  };

  const areaChartData: ChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`) as unknown as string[],
    datasets: [
      {
        label: 'Consumo de Batería (%)',
        data: [100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    // Simular carga de Chart.js (en producción, usar la librería real)
    console.log('Charts initialized');
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📊 Advanced Analytics Visualizations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Tendencias</TabsTrigger>
              <TabsTrigger value="comparison">Comparativa</TabsTrigger>
              <TabsTrigger value="distribution">Distribución</TabsTrigger>
              <TabsTrigger value="consumption">Consumo</TabsTrigger>
            </TabsList>

            {/* Gráfico de Líneas - Tendencias */}
            <TabsContent value="trends" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold mb-4">📈 Tendencias de Altitud y Velocidad (Últimas 12 horas)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <canvas ref={lineChartRef} height="80"></canvas>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-100 rounded">
                      <p className="text-sm text-gray-600">Altitud Promedio</p>
                      <p className="text-2xl font-bold text-blue-600">467m</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded">
                      <p className="text-sm text-gray-600">Velocidad Promedio</p>
                      <p className="text-2xl font-bold text-red-600">16.8 m/s</p>
                    </div>
                  </div>
                </div>

                {/* Tabla de datos */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Hora</th>
                        <th className="px-4 py-2 text-left">Altitud</th>
                        <th className="px-4 py-2 text-left">Velocidad</th>
                        <th className="px-4 py-2 text-left">Batería</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }, (_, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{i}:00</td>
                          <td className="px-4 py-2">{400 + i * 20}m</td>
                          <td className="px-4 py-2">{12 + i * 2} m/s</td>
                          <td className="px-4 py-2">{100 - i * 10}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Gráfico de Barras - Comparativa */}
            <TabsContent value="comparison" className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold mb-4">📊 Comparativa de Misiones por Dirigible</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <canvas ref={barChartRef} height="80"></canvas>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map((name, idx) => (
                      <div key={name} className="p-3 bg-green-100 rounded text-center">
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-xl font-bold text-green-600">{45 - idx * 3}</p>
                        <p className="text-xs text-gray-600">Completadas</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas de Comparativa */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs text-gray-600">Mejor Desempeño</p>
                    <p className="text-lg font-bold">Gamma (52)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs text-gray-600">Promedio</p>
                    <p className="text-lg font-bold">43 misiones</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-bold">215 misiones</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Gráfico de Pastel - Distribución */}
            <TabsContent value="distribution" className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold mb-4">🥧 Distribución de Estado de Misiones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <canvas ref={pieChartRef} height="80"></canvas>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Exitosas</span>
                        <span className="text-2xl font-bold text-green-600">156</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">84% de éxito</p>
                    </div>

                    <div className="p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Con Advertencias</span>
                        <span className="text-2xl font-bold text-yellow-600">28</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">15% con advertencias</p>
                    </div>

                    <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Fallidas</span>
                        <span className="text-2xl font-bold text-red-600">5</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">1% fallidas</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Gráfico de Área - Consumo */}
            <TabsContent value="consumption" className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-bold mb-4">📉 Consumo de Batería (24 horas)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <canvas ref={areaChartRef} height="80"></canvas>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="p-3 bg-orange-100 rounded">
                      <p className="text-sm text-gray-600">Inicio</p>
                      <p className="text-2xl font-bold">100%</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded">
                      <p className="text-sm text-gray-600">Actual</p>
                      <p className="text-2xl font-bold">54%</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded">
                      <p className="text-sm text-gray-600">Consumo/h</p>
                      <p className="text-2xl font-bold">1.92%</p>
                    </div>
                  </div>
                </div>

                {/* Predicción de Batería */}
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold mb-2">⚠️ Predicción de Batería</h4>
                  <p className="text-sm text-gray-700">
                    Con el consumo actual, la batería se agotará en <span className="font-bold">22.4 horas</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Recomendación: Planificar recarga en 20 horas</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
