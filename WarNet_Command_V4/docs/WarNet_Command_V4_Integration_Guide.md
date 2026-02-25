# WarNet Command V4 - Guía de Integración para Software Externo

**Versión:** 1.0.0  
**Fecha:** 25 de febrero de 2026  
**Objetivo:** Permitir que aplicaciones externas consuman las APIs del módulo Hacker y otros servicios

---

## Índice

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Cliente Python](#cliente-python)
4. [Cliente JavaScript](#cliente-javascript)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Manejo de Errores](#manejo-de-errores)
7. [Rate Limiting](#rate-limiting)

---

## Introducción

Las APIs de WarNet Command V4 permiten que aplicaciones externas:

- Descubran y controlen dispositivos Bluetooth
- Escaneen redes WiFi
- Ejecuten comandos en dispositivos conectados
- Obtengan predicciones meteorológicas
- Consulten historial de operaciones

### Requisitos

- Acceso a red del servidor WarNet Command V4
- Token JWT válido (solicitar al administrador)
- Conocimiento básico de REST APIs

### Base URL

```
http://localhost:3000/api
```

En producción, reemplazar `localhost:3000` con el dominio/IP del servidor.

---

## Autenticación

### Obtener Token JWT

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### Incluir Token en Solicitudes

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/hacker/devices
```

---

## Cliente Python

### Instalación

```bash
pip install requests pyjwt
```

### Clase Base

```python
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
            return True
        except requests.exceptions.RequestException as e:
            print(f"Error de autenticación: {e}")
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
            print(f"Error al obtener dispositivos: {e}")
            return []
    
    def start_scan(self, scan_type: str = "all", duration: int = 30) -> str:
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
            return response.json()['scanId']
        except requests.exceptions.RequestException as e:
            print(f"Error al iniciar escaneo: {e}")
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
            return response.json()['status'] == 'success'
        except requests.exceptions.RequestException as e:
            print(f"Error al conectar dispositivo: {e}")
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
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al enviar comando: {e}")
            return {"status": "error", "message": str(e)}
    
    def disconnect_device(self, device_id: str) -> bool:
        """Desconectar un dispositivo"""
        try:
            response = requests.delete(
                f"{self.base_url}/hacker/device/{device_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()['status'] == 'success'
        except requests.exceptions.RequestException as e:
            print(f"Error al desconectar dispositivo: {e}")
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
            print(f"Error al obtener historial: {e}")
            return []
    
    def get_weather_forecast(
        self,
        latitude: float,
        longitude: float,
        period: str = "7d"
    ) -> Dict:
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
            print(f"Error al obtener pronóstico: {e}")
            return None
```

### Ejemplo de Uso

```python
# Inicializar cliente
client = WarNetClient(
    base_url="http://localhost:3000/api",
    username="operator",
    password="secure_password"
)

# Obtener dispositivos
devices = client.get_devices()
print(f"Dispositivos encontrados: {len(devices)}")

for device in devices:
    print(f"- {device['name']} ({device['id']})")

# Iniciar escaneo
scan_id = client.start_scan(scan_type="bluetooth", duration=30)
print(f"Escaneo iniciado: {scan_id}")

# Conectar a un dispositivo
if devices:
    device_id = devices[0]['id']
    if client.connect_device(device_id):
        print(f"Conectado a {device_id}")
        
        # Enviar comando
        result = client.send_command(
            device_id=device_id,
            action="read_status"
        )
        print(f"Resultado: {result}")
        
        # Desconectar
        client.disconnect_device(device_id)

# Obtener pronóstico meteorológico
weather = client.get_weather_forecast(
    latitude=40.7128,
    longitude=-74.006,
    period="7d"
)
print(f"Temperatura: {weather['forecast'][0]['temperature']}°C")
```

---

## Cliente JavaScript

### Instalación

```bash
npm install axios
```

### Clase Base

```javascript
class WarNetClient {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
    this.token = null;
    this.authenticate();
  }

  async authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });
      const data = await response.json();
      this.token = data.token;
    } catch (error) {
      console.error('Error de autenticación:', error);
    }
  }

  async getDevices() {
    try {
      const response = await fetch(`${this.baseUrl}/hacker/devices`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const data = await response.json();
      return data.devices;
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
      return [];
    }
  }

  async startScan(scanType = 'all', duration = 30) {
    try {
      const response = await fetch(`${this.baseUrl}/hacker/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: scanType, duration })
      });
      const data = await response.json();
      return data.scanId;
    } catch (error) {
      console.error('Error al iniciar escaneo:', error);
      return null;
    }
  }

  async connectDevice(deviceId, timeout = 10000) {
    try {
      const response = await fetch(
        `${this.baseUrl}/hacker/device/${deviceId}/connect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ timeout })
        }
      );
      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Error al conectar dispositivo:', error);
      return false;
    }
  }

  async sendCommand(deviceId, action, options = {}) {
    try {
      const response = await fetch(
        `${this.baseUrl}/hacker/device/${deviceId}/command`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            service_uuid: options.serviceUuid,
            characteristic_uuid: options.characteristicUuid,
            data: options.data
          })
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Error al enviar comando:', error);
      return { status: 'error', message: error.message };
    }
  }

  async disconnectDevice(deviceId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/hacker/device/${deviceId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );
      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Error al desconectar dispositivo:', error);
      return false;
    }
  }

  async getWeatherForecast(latitude, longitude, period = '7d') {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather/forecast?lat=${latitude}&lon=${longitude}&period=${period}`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Error al obtener pronóstico:', error);
      return null;
    }
  }
}
```

### Ejemplo de Uso

```javascript
// Inicializar cliente
const client = new WarNetClient(
  'http://localhost:3000/api',
  'operator',
  'secure_password'
);

// Esperar autenticación
setTimeout(async () => {
  // Obtener dispositivos
  const devices = await client.getDevices();
  console.log(`Dispositivos encontrados: ${devices.length}`);

  devices.forEach(device => {
    console.log(`- ${device.name} (${device.id})`);
  });

  // Conectar a primer dispositivo
  if (devices.length > 0) {
    const deviceId = devices[0].id;
    const connected = await client.connectDevice(deviceId);
    
    if (connected) {
      console.log(`Conectado a ${deviceId}`);
      
      // Enviar comando
      const result = await client.sendCommand(
        deviceId,
        'read_status'
      );
      console.log('Resultado:', result);
      
      // Desconectar
      await client.disconnectDevice(deviceId);
    }
  }

  // Obtener pronóstico
  const weather = await client.getWeatherForecast(40.7128, -74.006, '7d');
  console.log(`Temperatura: ${weather.forecast[0].temperature}°C`);
}, 1000);
```

---

## Ejemplos Prácticos

### Ejemplo 1: Monitor de Dispositivos

```python
import time
from warnet_client import WarNetClient

client = WarNetClient("http://localhost:3000/api", "operator", "password")

while True:
    devices = client.get_devices()
    
    print(f"\n=== Estado de Dispositivos ({time.strftime('%H:%M:%S')}) ===")
    
    for device in devices:
        status = "✓ Conectado" if device['connected'] else "✗ Desconectado"
        print(f"{device['name']}: {status}")
        
        if device['connected']:
            result = client.send_command(device['id'], 'read_status')
            print(f"  Resultado: {result['result']}")
    
    time.sleep(5)
```

### Ejemplo 2: Automatización de Conexión

```python
from warnet_client import WarNetClient
import time

client = WarNetClient("http://localhost:3000/api", "operator", "password")

# Buscar dispositivos específicos
target_devices = ["Device A", "Device B"]

for device in client.get_devices():
    if device['name'] in target_devices:
        print(f"Conectando a {device['name']}...")
        
        if client.connect_device(device['id']):
            # Ejecutar secuencia de comandos
            commands = [
                'read_status',
                'enable_service',
                'read_status'
            ]
            
            for cmd in commands:
                result = client.send_command(device['id'], cmd)
                print(f"  {cmd}: {result['status']}")
                time.sleep(1)
            
            client.disconnect_device(device['id'])
            print(f"Desconectado de {device['name']}\n")
```

### Ejemplo 3: Análisis Meteorológico

```python
from warnet_client import WarNetClient
from datetime import datetime

client = WarNetClient("http://localhost:3000/api", "operator", "password")

# Obtener pronóstico
weather = client.get_weather_forecast(40.7128, -74.006, "7d")

print("=== Pronóstico de 7 Días ===\n")

for forecast in weather['forecast']:
    timestamp = datetime.fromisoformat(forecast['timestamp'])
    
    print(f"{timestamp.strftime('%Y-%m-%d %H:%M')}")
    print(f"  Temperatura: {forecast['temperature']:.1f}°C")
    print(f"  Viento: {forecast['windSpeed']:.1f} m/s")
    print(f"  Visibilidad: {forecast['visibility']:.1f} km")
    print(f"  Precipitación: {forecast['precipitation']:.1f} mm")
    print()
```

---

## Manejo de Errores

### Errores Comunes

| Código | Significado | Solución |
|--------|-----------|----------|
| 401 | No autorizado | Verificar token JWT |
| 403 | Prohibido | Verificar permisos |
| 404 | No encontrado | Verificar ID del dispositivo |
| 429 | Rate limit excedido | Esperar antes de reintentar |
| 500 | Error del servidor | Contactar administrador |

### Reintentos Automáticos

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Intento {attempt + 1} falló, reintentando en {delay}s...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def connect_with_retry(client, device_id):
    return client.connect_device(device_id)
```

---

## Rate Limiting

### Límites

- **Dispositivos:** 100 solicitudes/minuto
- **Comandos:** 50 solicitudes/minuto
- **Predicción:** 20 solicitudes/minuto

### Headers de Respuesta

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645794000
```

### Manejo de Rate Limit

```python
import time

def handle_rate_limit(response):
    if response.status_code == 429:
        reset_time = int(response.headers.get('X-RateLimit-Reset', 0))
        wait_time = max(1, reset_time - time.time())
        print(f"Rate limit excedido. Esperando {wait_time:.0f}s...")
        time.sleep(wait_time)
        return True
    return False
```

---

## Soporte

Para reportar problemas o solicitar ayuda:

- **Email:** support@warnet.dev
- **Issues:** https://github.com/yoqer/WarNet-Air/issues
- **Documentación:** https://warnet.dev/docs

---

**Documento Generado:** 25 de febrero de 2026  
**Versión:** 1.0.0
