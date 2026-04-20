import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface NetworkNode {
  id: string;
  name: string;
  value: number;
  group: number;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
}

export const D3Visualizations: React.FC = () => {
  const heatmapRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const sunburstRef = useRef<HTMLDivElement>(null);

  const [selectedCell, setSelectedCell] = useState<HeatmapData | null>(null);

  // Datos de Mapa de Calor - Actividad por hora y día
  const heatmapData: HeatmapData[] = Array.from({ length: 168 }, (_, i) => ({
    x: `${Math.floor(i / 24)}:00`,
    y: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(i / 24) % 7],
    value: Math.floor(Math.random() * 100),
  }));

  // Datos de Red - Conexiones entre dirigibles
  const networkNodes: NetworkNode[] = [
    { id: 'alpha', name: 'Alpha', value: 45, group: 1 },
    { id: 'beta', name: 'Beta', value: 38, group: 1 },
    { id: 'gamma', name: 'Gamma', value: 52, group: 2 },
    { id: 'delta', name: 'Delta', value: 41, group: 2 },
    { id: 'epsilon', name: 'Epsilon', value: 39, group: 3 },
    { id: 'hub', name: 'Command Hub', value: 100, group: 0 },
  ];

  const networkLinks: NetworkLink[] = [
    { source: 'hub', target: 'alpha', strength: 1 },
    { source: 'hub', target: 'beta', strength: 1 },
    { source: 'hub', target: 'gamma', strength: 1 },
    { source: 'hub', target: 'delta', strength: 1 },
    { source: 'hub', target: 'epsilon', strength: 1 },
    { source: 'alpha', target: 'beta', strength: 0.5 },
    { source: 'gamma', target: 'delta', strength: 0.5 },
  ];

  // Datos de Sunburst - Jerarquía de misiones
  const sunburstData = {
    name: 'Misiones',
    children: [
      {
        name: 'Completadas (156)',
        children: [
          { name: 'Reconocimiento (78)', value: 78 },
          { name: 'Vigilancia (45)', value: 45 },
          { name: 'Mapeo (33)', value: 33 },
        ],
      },
      {
        name: 'Con Advertencias (28)',
        children: [
          { name: 'Batería Baja (15)', value: 15 },
          { name: 'Clima Adverso (10)', value: 10 },
          { name: 'Sensor Error (3)', value: 3 },
        ],
      },
      {
        name: 'Fallidas (5)',
        children: [
          { name: 'Comunicación (2)', value: 2 },
          { name: 'Hardware (2)', value: 2 },
          { name: 'Otro (1)', value: 1 },
        ],
      },
    ],
  };

  useEffect(() => {
    // Inicializar visualizaciones D3
    renderHeatmap();
    renderNetwork();
    renderSunburst();
  }, []);

  const renderHeatmap = () => {
    if (!heatmapRef.current) return;

    const cellSize = 20;
    const width = 24 * cellSize;
    const height = 7 * cellSize;

    heatmapRef.current.innerHTML = `
      <svg width="${width}" height="${height}" style="border: 1px solid #ccc; border-radius: 4px;">
        ${heatmapData.map((d, i) => {
          const x = (i % 24) * cellSize;
          const y = Math.floor(i / 24) * cellSize;
          const intensity = d.value / 100;
          const color = `rgba(59, 130, 246, ${intensity})`;
          return `
            <rect 
              x="${x}" 
              y="${y}" 
              width="${cellSize}" 
              height="${cellSize}" 
              fill="${color}" 
              stroke="#fff" 
              stroke-width="1"
              class="heatmap-cell"
              data-value="${d.value}"
              style="cursor: pointer;"
            />
          `;
        })}
      </svg>
    `;
  };

  const renderNetwork = () => {
    if (!networkRef.current) return;

    const width = 400;
    const height = 300;
    const nodeRadius = 20;

    // Simulación de posiciones de nodos
    const positions: Record<string, { x: number; y: number }> = {
      hub: { x: width / 2, y: height / 2 },
      alpha: { x: width / 4, y: height / 4 },
      beta: { x: (3 * width) / 4, y: height / 4 },
      gamma: { x: width / 4, y: (3 * height) / 4 },
      delta: { x: (3 * width) / 4, y: (3 * height) / 4 },
      epsilon: { x: width / 2, y: height / 4 },
    };

    let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #ccc; border-radius: 4px;">`;

    // Dibujar enlaces
    networkLinks.forEach(link => {
      const source = positions[link.source];
      const target = positions[link.target];
      svg += `
        <line 
          x1="${source.x}" 
          y1="${source.y}" 
          x2="${target.x}" 
          y2="${target.y}" 
          stroke="#999" 
          stroke-width="${link.strength * 2}"
          opacity="0.6"
        />
      `;
    });

    // Dibujar nodos
    networkNodes.forEach(node => {
      const pos = positions[node.id];
      const color = node.group === 0 ? '#ef4444' : node.group === 1 ? '#3b82f6' : '#10b981';
      svg += `
        <circle 
          cx="${pos.x}" 
          cy="${pos.y}" 
          r="${nodeRadius}" 
          fill="${color}" 
          opacity="0.8"
          stroke="#fff"
          stroke-width="2"
          style="cursor: pointer;"
        />
        <text 
          x="${pos.x}" 
          y="${pos.y}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          fill="#fff"
          font-size="12"
          font-weight="bold"
        >${node.name.charAt(0)}</text>
      `;
    });

    svg += '</svg>';
    networkRef.current.innerHTML = svg;
  };

  const renderSunburst = () => {
    if (!sunburstRef.current) return;

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Datos para visualización
    const data = [
      { label: 'Completadas', value: 156, color: '#10b981' },
      { label: 'Advertencias', value: 28, color: '#f59e0b' },
      { label: 'Fallidas', value: 5, color: '#ef4444' },
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);

    let svg = `<svg width="${width}" height="${height}" style="border: 1px solid #ccc; border-radius: 4px;">`;

    let currentAngle = 0;
    data.forEach(d => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      const x1 = width / 2 + radius * Math.cos(startAngle);
      const y1 = height / 2 + radius * Math.sin(startAngle);
      const x2 = width / 2 + radius * Math.cos(endAngle);
      const y2 = height / 2 + radius * Math.sin(endAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = `
        M ${width / 2} ${height / 2}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;

      svg += `
        <path 
          d="${pathData}" 
          fill="${d.color}" 
          stroke="#fff" 
          stroke-width="2"
          opacity="0.8"
          style="cursor: pointer;"
        />
      `;

      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = width / 2 + labelRadius * Math.cos(labelAngle);
      const labelY = height / 2 + labelRadius * Math.sin(labelAngle);

      svg += `
        <text 
          x="${labelX}" 
          y="${labelY}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          fill="#fff"
          font-size="12"
          font-weight="bold"
        >${d.label}</text>
      `;

      currentAngle = endAngle;
    });

    svg += '</svg>';
    sunburstRef.current.innerHTML = svg;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎨 Advanced D3.js Visualizations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
              <TabsTrigger value="network">Red</TabsTrigger>
              <TabsTrigger value="sunburst">Sunburst</TabsTrigger>
            </TabsList>

            {/* Mapa de Calor */}
            <TabsContent value="heatmap" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold mb-4">🔥 Mapa de Calor - Actividad por Hora y Día</h3>
                <div ref={heatmapRef} className="overflow-x-auto mb-4"></div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded text-center">
                    <p className="text-xs text-gray-600">Mínimo</p>
                    <p className="text-lg font-bold">0%</p>
                  </div>
                  <div className="p-2 bg-blue-200 rounded text-center">
                    <p className="text-xs text-gray-600">Bajo</p>
                    <p className="text-lg font-bold">33%</p>
                  </div>
                  <div className="p-2 bg-blue-400 rounded text-center">
                    <p className="text-xs text-gray-600">Medio</p>
                    <p className="text-lg font-bold">66%</p>
                  </div>
                  <div className="p-2 bg-blue-600 text-white rounded text-center">
                    <p className="text-xs">Máximo</p>
                    <p className="text-lg font-bold">100%</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border">
                  <p className="text-sm font-semibold">Interpretación</p>
                  <p className="text-xs text-gray-600 mt-1">
                    El mapa de calor muestra la intensidad de actividad de los dirigibles por hora del día y día de la semana.
                    Los colores más intensos indican mayor actividad.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Gráfico de Red */}
            <TabsContent value="network" className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold mb-4">🕸️ Gráfico de Red - Conexiones entre Dirigibles</h3>
                <div ref={networkRef} className="flex justify-center mb-4"></div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-red-100 rounded">
                    <div className="w-4 h-4 bg-red-500 rounded-full mb-2"></div>
                    <p className="text-xs font-semibold">Hub Central</p>
                    <p className="text-xs text-gray-600">Centro de comando</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mb-2"></div>
                    <p className="text-xs font-semibold">Grupo 1</p>
                    <p className="text-xs text-gray-600">Alpha, Beta</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded">
                    <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
                    <p className="text-xs font-semibold">Grupo 2</p>
                    <p className="text-xs text-gray-600">Gamma, Delta, Epsilon</p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-sm font-semibold">Estadísticas de Red</p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <p><span className="font-semibold">Nodos:</span> 6</p>
                    <p><span className="font-semibold">Enlaces:</span> 7</p>
                    <p><span className="font-semibold">Densidad:</span> 0.47</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Sunburst */}
            <TabsContent value="sunburst" className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold mb-4">☀️ Sunburst - Jerarquía de Misiones</h3>
                <div ref={sunburstRef} className="flex justify-center mb-4"></div>

                <div className="space-y-2">
                  <div className="p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
                    <p className="font-semibold text-sm">Completadas: 156 (84%)</p>
                    <p className="text-xs text-gray-600">Reconocimiento (78) • Vigilancia (45) • Mapeo (33)</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                    <p className="font-semibold text-sm">Con Advertencias: 28 (15%)</p>
                    <p className="text-xs text-gray-600">Batería Baja (15) • Clima Adverso (10) • Sensor Error (3)</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                    <p className="font-semibold text-sm">Fallidas: 5 (1%)</p>
                    <p className="text-xs text-gray-600">Comunicación (2) • Hardware (2) • Otro (1)</p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-sm font-semibold">Total de Misiones: 189</p>
                  <p className="text-xs text-gray-600 mt-1">Tasa de éxito: 98.4%</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
