import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Radar,
  MapPin,
  Settings,
  Radio,
  AlertCircle,
  Zap,
  Wind,
  Thermometer,
  Battery,
  Eye,
  Maximize2,
  Menu,
  Skull,
} from "lucide-react";
import { HackerModule } from "@/components/HackerModule";
import { WeatherPlanning } from "@/components/WeatherPlanning";

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState("map");
  const [autonomyMode, setAutonomyMode] = useState<"manual" | "auto">("auto");
  const [sensorPanelOpen, setSensorPanelOpen] = useState(true);
  const [radarMode, setRadarMode] = useState<"2d" | "3d">("2d");

  // Simulación de datos de telemetría
  const telemetry = {
    altitude: 37245,
    temperature: -56.2,
    windSpeed: 12.5,
    windDirection: 245,
    solarPower: 85,
    batteryLevel: 92,
    h2Level: 78,
    h2oLevel: 45,
    gpsAccuracy: 0.15,
    latitude: 40.7128,
    longitude: -74.006,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">WarNet Air-Fusion</h1>
              <p className="text-xs text-slate-400">Command & Control Center V4</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-slate-800 bg-slate-900/30 p-0 h-auto">
              <TabsTrigger
                value="map"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mapa
              </TabsTrigger>
              <TabsTrigger
                value="radar"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <Radar className="w-4 h-4 mr-2" />
                Radar
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <Globe className="w-4 h-4 mr-2" />
                Planificación
              </TabsTrigger>
              <TabsTrigger
                value="sensors"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <Zap className="w-4 h-4 mr-2" />
                Sensores
              </TabsTrigger>
              <TabsTrigger
                value="3d"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualización 3D
              </TabsTrigger>
              <TabsTrigger
                value="infrastructure"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Infraestructura
              </TabsTrigger>
              <TabsTrigger
                value="hacker"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
              >
                <Skull className="w-4 h-4 mr-2" />
                Hacker
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="map" className="flex-1 overflow-auto p-6">
              <Card className="h-full bg-slate-900 border-slate-800">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">
                      Integración con Google Maps y NASA GIBS
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Posición: {telemetry.latitude.toFixed(4)}°,{" "}
                      {telemetry.longitude.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="radar" className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={radarMode === "2d" ? "default" : "outline"}
                    onClick={() => setRadarMode("2d")}
                  >
                    Radar 2D
                  </Button>
                  <Button
                    variant={radarMode === "3d" ? "default" : "outline"}
                    onClick={() => setRadarMode("3d")}
                  >
                    Radar 3D
                  </Button>
                </div>
                <Card className="h-96 bg-slate-900 border-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <Radar className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">
                      {radarMode === "2d"
                        ? "Radar 2D - Detección de señales"
                        : "Radar 3D - Visualización espacial"}
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="planning" className="flex-1 overflow-auto p-6">
              <WeatherPlanning />
            </TabsContent>

            <TabsContent value="sensors" className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Temperatura</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {telemetry.temperature}°C
                  </p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Viento</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {telemetry.windSpeed} m/s
                  </p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Batería</span>
                  </div>
                  <p className="text-2xl font-bold">{telemetry.batteryLevel}%</p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Energía Solar</span>
                  </div>
                  <p className="text-2xl font-bold">{telemetry.solarPower}%</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="3d" className="flex-1 overflow-auto p-6">
              <Card className="h-full bg-slate-900 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400">
                    Visualización 3D con CesiumJS
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Integración de capas NASA GIBS y Google Earth Engine
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="infrastructure" className="flex-1 overflow-auto p-6">
              <Card className="h-full bg-slate-900 border-slate-800 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Control de Infraestructura
                </h3>
                <p className="text-slate-400 text-sm">
                  Deteccion y control de semaforos, camaras de seguridad y
                  dispositivos conectados mediante protocolos de proximidad.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="hacker" className="flex-1 overflow-auto p-6">
              <HackerModule />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Control Panel */}
        {sensorPanelOpen && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/50 backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold text-sm">Control & Estado</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSensorPanelOpen(false)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Autonomy Control */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Modo Autonomía
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={
                      autonomyMode === "manual" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setAutonomyMode("manual")}
                    className="flex-1"
                  >
                    Manual
                  </Button>
                  <Button
                    variant={autonomyMode === "auto" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutonomyMode("auto")}
                    className="flex-1"
                  >
                    Automático
                  </Button>
                </div>
              </div>

              {/* Telemetry Display */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Telemetría
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Altitud:</span>
                    <span className="font-mono">
                      {telemetry.altitude.toLocaleString()} m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temperatura:</span>
                    <span className="font-mono">{telemetry.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Viento:</span>
                    <span className="font-mono">{telemetry.windSpeed} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">H₂ Nivel:</span>
                    <span className="font-mono">{telemetry.h2Level}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">H₂O Nivel:</span>
                    <span className="font-mono">{telemetry.h2oLevel}%</span>
                  </div>
                </div>
              </div>

              {/* System Controls */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Controles
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Seguimiento Solar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Orientación Viento
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Activar Jammer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
