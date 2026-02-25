import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Wifi,
  Bluetooth,
  Zap,
  Play,
  Square,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Terminal,
} from "lucide-react";
import { useBluetoothDevices } from "@/hooks/useBluetoothDevices";

interface DeviceCommand {
  timestamp: Date;
  device: string;
  action: string;
  status: "success" | "error" | "pending";
  result?: string;
}

export function HackerModule() {
  const { devices, scanning, startScan, connectDevice, disconnectDevice } =
    useBluetoothDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<DeviceCommand[]>([]);
  const [wifiNetworks, setWifiNetworks] = useState<
    { ssid: string; strength: number; security: string }[]
  >([
    { ssid: "WarNet-Core", strength: 95, security: "WPA3" },
    { ssid: "Guest-Network", strength: 78, security: "WPA2" },
    { ssid: "IoT-Mesh", strength: 82, security: "WPA2" },
  ]);

  const handleCommand = (action: string) => {
    const command: DeviceCommand = {
      timestamp: new Date(),
      device: selectedDevice || "unknown",
      action,
      status: "pending",
    };

    setCommandHistory((prev) => [command, ...prev]);

    // Simular ejecución del comando
    setTimeout(() => {
      setCommandHistory((prev) =>
        prev.map((cmd) =>
          cmd === command
            ? {
                ...cmd,
                status: "success",
                result: `Command executed: ${action}`,
              }
            : cmd
        )
      );
    }, 500);
  };

  const handleConnectDevice = (deviceId: string) => {
    connectDevice(deviceId);
    handleCommand(`connect:${deviceId}`);
  };

  const handleDisconnectDevice = (deviceId: string) => {
    disconnectDevice(deviceId);
    handleCommand(`disconnect:${deviceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-950/30 border border-red-800 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-400">
            Módulo Hacker - Acceso Restringido
          </p>
          <p className="text-xs text-red-300 mt-1">
            Este módulo permite control de dispositivos de red. Úsalo solo con
            autorización. Todas las operaciones son registradas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Bluetooth Devices */}
        <Card className="bg-slate-900 border-slate-800 p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Dispositivos Bluetooth</h3>
            </div>
            <Button
              size="sm"
              variant={scanning ? "destructive" : "default"}
              onClick={startScan}
              disabled={scanning}
            >
              {scanning ? (
                <>
                  <Clock className="w-3 h-3 mr-1 animate-spin" />
                  Escaneando...
                </>
              ) : (
                <>
                  <Radio className="w-3 h-3 mr-1" />
                  Escanear
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-auto">
            {devices.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No hay dispositivos detectados. Inicia un escaneo.
              </p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedDevice === device.id
                      ? "bg-blue-950 border-blue-700"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-slate-400">
                        ID: {device.id.substring(0, 12)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.connected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Radio className="w-4 h-4 text-slate-500" />
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (device.connected) {
                            handleDisconnectDevice(device.id);
                          } else {
                            handleConnectDevice(device.id);
                          }
                        }}
                      >
                        {device.connected ? "Desconectar" : "Conectar"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* WiFi Networks */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold">Redes WiFi</h3>
          </div>

          <div className="space-y-2">
            {wifiNetworks.map((network) => (
              <div
                key={network.ssid}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium">{network.ssid}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {network.security}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-sm ${
                          i < Math.floor(network.strength / 20)
                            ? "bg-green-500"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device Control Panel */}
      {selectedDevice && (
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="font-semibold mb-4">Panel de Control</h3>
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand("read_status")}
            >
              <Zap className="w-4 h-4 mr-2" />
              Leer Estado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand("enable_service")}
            >
              <Play className="w-4 h-4 mr-2" />
              Activar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand("disable_service")}
            >
              <Square className="w-4 h-4 mr-2" />
              Desactivar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCommand("reset_device")}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </Card>
      )}

      {/* Command History */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Historial de Comandos</h3>
        </div>

        <div className="space-y-2 max-h-48 overflow-auto font-mono text-xs">
          {commandHistory.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              Sin comandos ejecutados
            </p>
          ) : (
            commandHistory.map((cmd, idx) => (
              <div
                key={idx}
                className={`p-2 rounded bg-slate-800/50 border-l-2 flex items-start justify-between ${
                  cmd.status === "success"
                    ? "border-green-600"
                    : cmd.status === "error"
                      ? "border-red-600"
                      : "border-yellow-600"
                }`}
              >
                <div className="flex-1">
                  <p className="text-slate-300">
                    [{cmd.timestamp.toLocaleTimeString()}] {cmd.action}
                  </p>
                  {cmd.result && (
                    <p className="text-slate-400 text-xs mt-1">{cmd.result}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${cmd.timestamp.toISOString()} | ${cmd.action} | ${cmd.result || ""}`
                    );
                  }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* API Documentation */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="font-semibold mb-4">Endpoints de API Disponibles</h3>
        <div className="space-y-2 text-xs font-mono">
          <p className="text-slate-300">
            <span className="text-green-500">GET</span>{" "}
            <span className="text-cyan-400">/api/hacker/devices</span> - Listar
            dispositivos
          </p>
          <p className="text-slate-300">
            <span className="text-blue-500">POST</span>{" "}
            <span className="text-cyan-400">/api/hacker/scan</span> - Iniciar
            escaneo
          </p>
          <p className="text-slate-300">
            <span className="text-blue-500">POST</span>{" "}
            <span className="text-cyan-400">
              /api/hacker/device/{"{id}"}/connect
            </span>{" "}
            - Conectar dispositivo
          </p>
          <p className="text-slate-300">
            <span className="text-blue-500">POST</span>{" "}
            <span className="text-cyan-400">
              /api/hacker/device/{"{id}"}/command
            </span>{" "}
            - Enviar comando
          </p>
          <p className="text-slate-300">
            <span className="text-red-500">DELETE</span>{" "}
            <span className="text-cyan-400">
              /api/hacker/device/{"{id}"}
            </span>{" "}
            - Desconectar dispositivo
          </p>
        </div>
      </Card>
    </div>
  );
}
