import { useState, useCallback } from "react";

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  rssi?: number;
  services?: string[];
  lastSeen: Date;
  type: "bluetooth" | "wifi" | "zigbee";
}

export interface ScanResult {
  scanning: boolean;
  devices: BluetoothDeviceInfo[];
  error?: string;
}

export function useBluetoothDevices() {
  const [scanResult, setScanResult] = useState<ScanResult>({
    scanning: false,
    devices: [],
  });

  const startScan = useCallback(async () => {
    setScanResult((prev) => ({ ...prev, scanning: true, error: undefined }));

    try {
      // Solicitar dispositivos Bluetooth
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "battery_service",
          "device_information",
          "generic_access",
        ],
      });

      const deviceInfo: BluetoothDeviceInfo = {
        id: device.id,
        name: device.name || "Unknown Device",
        connected: device.gatt?.connected || false,
        lastSeen: new Date(),
        type: "bluetooth",
      };

      setScanResult((prev) => ({
        ...prev,
        devices: [
          ...prev.devices.filter((d) => d.id !== deviceInfo.id),
          deviceInfo,
        ],
      }));
    } catch (error) {
      setScanResult((prev) => ({
        ...prev,
        error: `Error scanning: ${(error as Error).message}`,
      }));
    } finally {
      setScanResult((prev) => ({ ...prev, scanning: false }));
    }
  }, []);

  const connectDevice = useCallback(async (deviceId: string) => {
    try {
      const device = scanResult.devices.find((d) => d.id === deviceId);
      if (!device) throw new Error("Device not found");

      // Aquí iría la lógica de conexión real
      setScanResult((prev) => ({
        ...prev,
        devices: prev.devices.map((d) =>
          d.id === deviceId ? { ...d, connected: true } : d
        ),
      }));
    } catch (error) {
      setScanResult((prev) => ({
        ...prev,
        error: `Connection error: ${(error as Error).message}`,
      }));
    }
  }, [scanResult.devices]);

  const disconnectDevice = useCallback(async (deviceId: string) => {
    try {
      setScanResult((prev) => ({
        ...prev,
        devices: prev.devices.map((d) =>
          d.id === deviceId ? { ...d, connected: false } : d
        ),
      }));
    } catch (error) {
      setScanResult((prev) => ({
        ...prev,
        error: `Disconnection error: ${(error as Error).message}`,
      }));
    }
  }, []);

  const clearDevices = useCallback(() => {
    setScanResult({ scanning: false, devices: [], error: undefined });
  }, []);

  return {
    ...scanResult,
    startScan,
    connectDevice,
    disconnectDevice,
    clearDevices,
  };
}
