#!/usr/bin/env python3
"""
WarNet Command V4 - Cliente Python de Ejemplo
Demuestra cómo integrar aplicaciones externas con las APIs de WarNet
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Optional

class WarNetClient:
    """Cliente para interactuar con WarNet Command V4 APIs"""
    
    def __init__(self, base_url: str, username: str, password: str):
        self.base_url = base_url
        self.username = username
        self.password = password
        self.token = None
        self.headers = {}
        self.authenticate()
    
    def authenticate(self) -> bool:
        """Autenticarse y obtener token JWT"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={
                    "username": self.username,
                    "password": self.password
                }
            )
            response.raise_for_status()
            data = response.json()
            self.token = data['token']
            self.headers = {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            }
            print(f"✓ Autenticado como {self.username}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"✗ Error de autenticación: {e}")
            return False
    
    def get_devices(self) -> List[Dict]:
        """Obtener lista de dispositivos detectados"""
        try:
            response = requests.get(
                f"{self.base_url}/hacker/devices",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()['devices']
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al obtener dispositivos: {e}")
            return []
    
    def start_scan(self, scan_type: str = "all", duration: int = 30) -> Optional[str]:
        """Iniciar escaneo de dispositivos"""
        try:
            response = requests.post(
                f"{self.base_url}/hacker/scan",
                headers=self.headers,
                json={
                    "type": scan_type,
                    "duration": duration
                }
            )
            response.raise_for_status()
            scan_id = response.json()['scanId']
            print(f"✓ Escaneo iniciado: {scan_id}")
            return scan_id
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al iniciar escaneo: {e}")
            return None
    
    def connect_device(self, device_id: str, timeout: int = 10000) -> bool:
        """Conectar a un dispositivo"""
        try:
            response = requests.post(
                f"{self.base_url}/hacker/device/{device_id}/connect",
                headers=self.headers,
                json={"timeout": timeout}
            )
            response.raise_for_status()
            if response.json()['status'] == 'success':
                print(f"✓ Conectado a {device_id}")
                return True
            return False
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al conectar dispositivo: {e}")
            return False
    
    def send_command(
        self,
        device_id: str,
        action: str,
        service_uuid: Optional[str] = None,
        characteristic_uuid: Optional[str] = None,
        data: Optional[str] = None
    ) -> Dict:
        """Enviar comando a un dispositivo"""
        try:
            payload = {
                "action": action,
                "service_uuid": service_uuid,
                "characteristic_uuid": characteristic_uuid,
                "data": data
            }
            response = requests.post(
                f"{self.base_url}/hacker/device/{device_id}/command",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            print(f"✓ Comando '{action}' enviado: {result['status']}")
            return result
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al enviar comando: {e}")
            return {"status": "error", "message": str(e)}
    
    def disconnect_device(self, device_id: str) -> bool:
        """Desconectar un dispositivo"""
        try:
            response = requests.delete(
                f"{self.base_url}/hacker/device/{device_id}",
                headers=self.headers
            )
            response.raise_for_status()
            if response.json()['status'] == 'success':
                print(f"✓ Desconectado de {device_id}")
                return True
            return False
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al desconectar dispositivo: {e}")
            return False
    
    def get_history(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Obtener historial de operaciones"""
        try:
            response = requests.get(
                f"{self.base_url}/hacker/history",
                headers=self.headers,
                params={"limit": limit, "offset": offset}
            )
            response.raise_for_status()
            return response.json()['history']
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al obtener historial: {e}")
            return []
    
    def get_weather_forecast(
        self,
        latitude: float,
        longitude: float,
        period: str = "7d"
    ) -> Optional[Dict]:
        """Obtener pronóstico meteorológico"""
        try:
            response = requests.get(
                f"{self.base_url}/weather/forecast",
                headers=self.headers,
                params={
                    "lat": latitude,
                    "lon": longitude,
                    "period": period
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"✗ Error al obtener pronóstico: {e}")
            return None


def main():
    """Función principal de demostración"""
    
    print("=" * 60)
    print("WarNet Command V4 - Cliente Python de Ejemplo")
    print("=" * 60)
    print()
    
    # Inicializar cliente
    client = WarNetClient(
        base_url="http://localhost:3000/api",
        username="operator",
        password="secure_password"
    )
    
    print("\n--- Obtener Dispositivos ---")
    devices = client.get_devices()
    print(f"Dispositivos encontrados: {len(devices)}")
    for device in devices[:5]:  # Mostrar primeros 5
        status = "✓" if device['connected'] else "✗"
        print(f"  {status} {device['name']} ({device['type']})")
    
    print("\n--- Iniciar Escaneo ---")
    scan_id = client.start_scan(scan_type="bluetooth", duration=30)
    
    print("\n--- Conectar a Dispositivo ---")
    if devices:
        device_id = devices[0]['id']
        if client.connect_device(device_id):
            
            print("\n--- Enviar Comandos ---")
            commands = ['read_status', 'enable_service', 'read_status']
            for cmd in commands:
                result = client.send_command(device_id, cmd)
                if result.get('result'):
                    print(f"  Resultado: {result['result']}")
            
            print("\n--- Desconectar ---")
            client.disconnect_device(device_id)
    
    print("\n--- Obtener Pronóstico Meteorológico ---")
    weather = client.get_weather_forecast(40.7128, -74.006, "7d")
    if weather and 'forecast' in weather:
        forecast = weather['forecast'][0]
        print(f"  Temperatura: {forecast['temperature']:.1f}°C")
        print(f"  Viento: {forecast['windSpeed']:.1f} m/s")
        print(f"  Visibilidad: {forecast['visibility']:.1f} km")
    
    print("\n--- Historial de Operaciones ---")
    history = client.get_history(limit=5)
    print(f"Últimas {len(history)} operaciones:")
    for op in history:
        timestamp = op['timestamp']
        print(f"  [{timestamp}] {op['action']}: {op['status']}")
    
    print("\n" + "=" * 60)
    print("Demostración completada")
    print("=" * 60)


if __name__ == "__main__":
    main()
