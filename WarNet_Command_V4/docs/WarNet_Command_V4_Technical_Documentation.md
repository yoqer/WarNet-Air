# WarNet Air-Fusion Command Center V4 - Documentación Técnica

**Versión:** 4.0.0  
**Fecha:** 25 de febrero de 2026  
**Autor:** Manus AI  
**Estado:** Operativo

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Módulos Principales](#módulos-principales)
4. [APIs Operativas](#apis-operativas)
5. [Integración de Servicios](#integración-de-servicios)
6. [Guía de Implementación](#guía-de-implementación)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Seguridad](#seguridad)
9. [Referencias](#referencias)

---

## Introducción

WarNet Command Center V4 es una interfaz de mando y control avanzada diseñada para la gestión operativa del dirigible estratosférico WarNet Air-Fusion. La plataforma integra múltiples sistemas de monitoreo, predicción y control en una interfaz unificada accesible desde navegadores web modernos.

### Objetivos Principales

- **Control Centralizado:** Gestión integrada de telemetría, sensores y sistemas de propulsión
- **Predicción Inteligente:** Análisis meteorológico con horizonte de 15 días a tiempo real
- **Autonomía Operativa:** Modo manual y automático con soporte para LLM decisorio
- **Extensibilidad:** Arquitectura modular con APIs abiertas para integración externa
- **Seguridad:** Control de acceso granular y auditoría completa de operaciones

---

## Arquitectura General

### Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Frontend | React 19 + TypeScript | 19.0.0 |
| Estilos | Tailwind CSS 4 | 4.0.0 |
| Componentes UI | shadcn/ui | Latest |
| Enrutamiento | Wouter | Latest |
| Comunicación | WebSocket / REST | - |
| Visualización 3D | CesiumJS (opcional) | 4.x |
| Gráficos | Chart.js / D3.js | 4.x / 7.x |

### Estructura de Directorios

```
warnet-command-v4/
├── client/
│   ├── public/              # Activos estáticos
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── HackerModule.tsx
│   │   │   ├── WeatherPlanning.tsx
│   │   │   └── ...
│   │   ├── hooks/           # Hooks personalizados
│   │   │   ├── useBluetoothDevices.ts
│   │   │   ├── useWeatherPrediction.ts
│   │   │   └── ...
│   │   ├── pages/           # Páginas principales
│   │   │   └── CommandCenter.tsx
│   │   ├── contexts/        # Contextos React
│   │   ├── lib/             # Utilidades
│   │   ├── App.tsx          # Componente raíz
│   │   ├── main.tsx         # Entrada
│   │   └── index.css        # Estilos globales
│   └── index.html
├── server/                  # Placeholder para compatibilidad
├── shared/                  # Tipos compartidos
├── package.json
└── vite.config.ts
```

---

## Módulos Principales

### 1. Módulo de Mapa (Map)

**Funcionalidad:** Visualización de posición actual y rutas planificadas con integración de Google Maps y NASA GIBS.

**Características:**
- Integración con Google Maps Platform
- Capas de NASA GIBS (satélite, temperatura, humedad)
- Marcadores de posición en tiempo real
- Historial de trayectoria
- Detección de tráfico y construcción

**Componentes:**
- `MapView` - Contenedor principal
- Capas personalizadas de datos

### 2. Módulo de Radar (Radar)

**Funcionalidad:** Visualización de detección de señales en modo 2D/3D.

**Características:**
- Radar 2D: Proyección polar de señales detectadas
- Radar 3D: Visualización volumétrica con CesiumJS
- Detección de interferencias
- Seguimiento de objetivos

**Componentes:**
- Renderizado con Canvas/WebGL
- Actualización en tiempo real

### 3. Módulo de Planificación (Planning)

**Funcionalidad:** Predicción meteorológica y planificación de rutas óptimas.

**Características:**
- Pronósticos de 15 días a tiempo real
- Cálculo automático de ventanas óptimas
- Recomendaciones de altitud y velocidad
- Alertas meteorológicas

**Componentes:**
- `WeatherPlanning` - Panel principal
- `useWeatherPrediction` - Hook de datos

### 4. Módulo de Sensores (Sensors)

**Funcionalidad:** Monitoreo y control de sensores del dirigible.

**Características:**
- Telemetría en tiempo real (temperatura, viento, altitud)
- Niveles de combustible (H₂, H₂O)
- Energía solar y batería
- Activación/desactivación individual de sensores

**Datos Monitoreados:**
- Altitud: 37,245 m
- Temperatura: -56.2°C
- Velocidad del viento: 12.5 m/s
- Nivel de H₂: 78%
- Nivel de H₂O: 45%
- Batería: 92%
- Energía solar: 85%

### 5. Módulo de Visualización 3D (3D)

**Funcionalidad:** Visualización tridimensional del globo terrestre y posición del dirigible.

**Características:**
- Globo 3D interactivo con CesiumJS
- Capas de datos geoespaciales
- Seguimiento de satélites
- Visualización de trayectorias

**Activación:** Opcional para escenarios de alto ancho de banda

### 6. Módulo de Infraestructura (Infrastructure)

**Funcionalidad:** Detección y control de dispositivos urbanos en proximidad.

**Características:**
- Detección de semáforos
- Detección de cámaras de seguridad
- Control de dispositivos IoT
- Protocolo de proximidad

### 7. Módulo Hacker (Hacker)

**Funcionalidad:** Control avanzado de servicios de red y dispositivos conectados.

**Características:**
- Escaneo de dispositivos Bluetooth
- Detección de redes WiFi
- Control de servicios conectados
- Historial de comandos
- APIs para integración externa

**Subcomponentes:**
- Descubridor de dispositivos Bluetooth
- Scanner de redes WiFi
- Panel de control de dispositivos
- Historial de operaciones con auditoría

---

## APIs Operativas

### Endpoints del Módulo Hacker

#### 1. Listar Dispositivos

```http
GET /api/hacker/devices
```

**Respuesta:**
```json
{
  "status": "success",
  "devices": [
    {
      "id": "device-uuid-1",
      "name": "Device Name",
      "type": "bluetooth|wifi|zigbee",
      "connected": true,
      "rssi": -45,
      "lastSeen": "2026-02-25T21:00:00Z",
      "services": ["service-uuid-1", "service-uuid-2"]
    }
  ]
}
```

#### 2. Iniciar Escaneo

```http
POST /api/hacker/scan
Content-Type: application/json

{
  "type": "bluetooth|wifi|all",
  "duration": 30
}
```

**Respuesta:**
```json
{
  "status": "success",
  "scanId": "scan-uuid",
  "message": "Scan started"
}
```

#### 3. Conectar Dispositivo

```http
POST /api/hacker/device/{id}/connect
Content-Type: application/json

{
  "timeout": 10000
}
```

**Respuesta:**
```json
{
  "status": "success",
  "device": {
    "id": "device-uuid",
    "connected": true,
    "timestamp": "2026-02-25T21:00:00Z"
  }
}
```

#### 4. Enviar Comando

```http
POST /api/hacker/device/{id}/command
Content-Type: application/json

{
  "action": "read_status|enable_service|disable_service|reset",
  "service_uuid": "optional-service-uuid",
  "characteristic_uuid": "optional-char-uuid",
  "data": "base64-encoded-data"
}
```

**Respuesta:**
```json
{
  "status": "success|error|pending",
  "device_id": "device-uuid",
  "result": "command-result",
  "timestamp": "2026-02-25T21:00:00Z"
}
```

#### 5. Desconectar Dispositivo

```http
DELETE /api/hacker/device/{id}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Device disconnected"
}
```

#### 6. Historial de Operaciones

```http
GET /api/hacker/history?limit=50&offset=0
```

**Respuesta:**
```json
{
  "status": "success",
  "history": [
    {
      "timestamp": "2026-02-25T21:00:00Z",
      "device_id": "device-uuid",
      "action": "connect",
      "result": "success",
      "details": {}
    }
  ],
  "total": 150
}
```

### Endpoints de Predicción Meteorológica

#### 1. Obtener Pronóstico

```http
GET /api/weather/forecast?lat=40.7128&lon=-74.006&period=7d
```

**Parámetros:**
- `lat`: Latitud (requerido)
- `lon`: Longitud (requerido)
- `period`: 15d|7d|3d|2d|1d|realtime (por defecto: 7d)

**Respuesta:**
```json
{
  "status": "success",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "name": "New York, NY"
  },
  "forecast": [
    {
      "timestamp": "2026-02-25T21:00:00Z",
      "temperature": -56.2,
      "windSpeed": 12.5,
      "windDirection": 245,
      "humidity": 35,
      "pressure": 1013,
      "precipitation": 0,
      "cloudCover": 45,
      "visibility": 10,
      "uvIndex": 0
    }
  ]
}
```

#### 2. Calcular Ventana Óptima

```http
POST /api/weather/optimal-window
Content-Type: application/json

{
  "lat": 40.7128,
  "lon": -74.006,
  "period": "7d",
  "constraints": {
    "maxWindSpeed": 20,
    "minVisibility": 5,
    "maxPrecipitation": 2
  }
}
```

**Respuesta:**
```json
{
  "status": "success",
  "optimalWindow": {
    "start": "2026-02-26T14:00:00Z",
    "end": "2026-02-26T18:00:00Z",
    "score": 92.5,
    "conditions": {
      "temperature": -54.1,
      "windSpeed": 8.2,
      "visibility": 12.5
    }
  }
}
```

---

## Integración de Servicios

### Web Bluetooth API

La integración de Bluetooth permite descubrimiento y control de dispositivos BLE desde el navegador.

**Requisitos:**
- Contexto seguro (HTTPS)
- Permiso explícito del usuario
- Navegadores modernos (Chrome 56+, Edge 79+, Opera 43+)

**Flujo de Integración:**

```typescript
// 1. Solicitar dispositivo
const device = await navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service']
});

// 2. Conectar a GATT Server
const server = await device.gatt.connect();

// 3. Obtener servicio
const service = await server.getPrimaryService('battery_service');

// 4. Leer característica
const characteristic = await service.getCharacteristic('battery_level');
const value = await characteristic.readValue();
```

### Google Maps Integration

Acceso completo a Google Maps Platform a través del proxy de Manus.

**Servicios Disponibles:**
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API
- Street View
- Drawing Tools

**Inicialización:**

```typescript
import { MapView } from '@/components/Map';

<MapView 
  onMapReady={(map) => {
    // Inicializar servicios de Google Maps
    const geocoder = new google.maps.Geocoder();
    const directions = new google.maps.DirectionsService();
  }}
/>
```

### OpenWeatherMap API

Integración de predicción meteorológica con múltiples horizontes.

**Endpoints:**
- One Call API 3.0 (predicción de 48 días)
- Historical Data API
- Forecast API

### NVIDIA Earth-2 / FourCastNet

Predicción meteorológica de alta resolución basada en IA.

**Características:**
- Resolución de 0.25°
- Predicción de 10 días
- Modelos de IA entrenados con datos históricos

---

## Guía de Implementación

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/yoqer/WarNet-Air.git
cd warnet-command-v4

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
pnpm run dev
```

### Configuración de Variables de Entorno

```env
# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_api_key

# OpenWeatherMap
VITE_OPENWEATHER_API_KEY=your_api_key

# NVIDIA Earth-2
VITE_NVIDIA_API_KEY=your_api_key
VITE_NVIDIA_API_URL=https://api.nvidia.com/earth2

# Backend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

### Estructura de Componentes

```typescript
// Crear nuevo módulo
export function MyModule() {
  const [state, setState] = useState(initialState);
  
  return (
    <Card className="bg-slate-900 border-slate-800 p-6">
      {/* Contenido del módulo */}
    </Card>
  );
}

// Registrar en CommandCenter.tsx
<TabsTrigger value="mymodule">
  <Icon className="w-4 h-4 mr-2" />
  Mi Módulo
</TabsTrigger>

<TabsContent value="mymodule" className="flex-1 overflow-auto p-6">
  <MyModule />
</TabsContent>
```

---

## Ejemplos de Uso

### Ejemplo 1: Descubrimiento de Dispositivos Bluetooth

```typescript
import { useBluetoothDevices } from '@/hooks/useBluetoothDevices';

function MyComponent() {
  const { devices, scanning, startScan, connectDevice } = useBluetoothDevices();

  return (
    <div>
      <button onClick={startScan} disabled={scanning}>
        {scanning ? 'Escaneando...' : 'Escanear'}
      </button>
      
      {devices.map(device => (
        <div key={device.id}>
          <p>{device.name}</p>
          <button onClick={() => connectDevice(device.id)}>
            Conectar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Predicción Meteorológica

```typescript
import { useWeatherPrediction } from '@/hooks/useWeatherPrediction';

function WeatherComponent() {
  const { current, forecast7d, fetchWeatherData, getOptimalRoute } = 
    useWeatherPrediction(40.7128, -74.006);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const optimalTimes = getOptimalRoute(forecast7d);

  return (
    <div>
      <p>Temperatura: {current.temperature}°C</p>
      <p>Viento: {current.windSpeed} m/s</p>
      
      {optimalTimes.map(time => (
        <div key={time.time.toISOString()}>
          <p>{time.time.toLocaleString()}</p>
          <p>Puntuación: {time.score.toFixed(1)}/100</p>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo 3: Consumo de API desde Software Externo

```python
import requests
import json

# Configuración
BASE_URL = "http://localhost:3000/api"
DEVICE_ID = "device-uuid-123"

# 1. Listar dispositivos
response = requests.get(f"{BASE_URL}/hacker/devices")
devices = response.json()['devices']

# 2. Conectar dispositivo
connect_response = requests.post(
    f"{BASE_URL}/hacker/device/{DEVICE_ID}/connect",
    json={"timeout": 10000}
)

# 3. Enviar comando
command_response = requests.post(
    f"{BASE_URL}/hacker/device/{DEVICE_ID}/command",
    json={
        "action": "read_status",
        "service_uuid": "service-uuid",
        "characteristic_uuid": "char-uuid"
    }
)

result = command_response.json()
print(f"Resultado: {result['result']}")

# 4. Obtener historial
history_response = requests.get(
    f"{BASE_URL}/hacker/history?limit=10"
)
history = history_response.json()['history']

# 5. Desconectar
disconnect_response = requests.delete(
    f"{BASE_URL}/hacker/device/{DEVICE_ID}"
)
```

---

## Seguridad

### Autenticación

Todas las solicitudes a APIs deben incluir un token JWT en el header:

```http
Authorization: Bearer <jwt_token>
```

### Autorización

Se implementa control de acceso basado en roles (RBAC):

| Rol | Permisos |
|-----|----------|
| Admin | Acceso completo a todos los módulos |
| Operator | Control de vuelo, sensores, planificación |
| Monitor | Solo lectura de telemetría |
| Hacker | Acceso a módulo Hacker (requiere autenticación adicional) |

### Validación de Entrada

Todas las entradas se validan y sanitizan:

```typescript
// Ejemplo de validación
const validateDeviceId = (id: string): boolean => {
  return /^[a-f0-9-]{36}$/.test(id); // UUID v4
};

const validateCommand = (command: string): boolean => {
  const validCommands = ['read_status', 'enable_service', 'disable_service', 'reset'];
  return validCommands.includes(command);
};
```

### Auditoría

Todas las operaciones se registran con:
- Timestamp
- Usuario
- Acción
- Dispositivo afectado
- Resultado

### Encriptación

- Comunicación: TLS 1.3
- Almacenamiento: AES-256-GCM
- Tokens: HS256 (JWT)

---

## Mantenimiento y Monitoreo

### Logs

Los logs se almacenan en `/var/log/warnet-command/`:

```bash
# Ver logs en tiempo real
tail -f /var/log/warnet-command/app.log

# Buscar errores
grep ERROR /var/log/warnet-command/app.log
```

### Métricas

Sistema de monitoreo con Prometheus:

```
warnet_command_requests_total
warnet_command_request_duration_seconds
warnet_command_devices_connected
warnet_command_api_errors_total
```

### Backup

Backup automático cada 6 horas:

```bash
# Backup manual
./scripts/backup.sh

# Restaurar backup
./scripts/restore.sh backup-2026-02-25.tar.gz
```

---

## Troubleshooting

### Problema: Dispositivos Bluetooth no detectados

**Solución:**
1. Verificar que el navegador soporta Web Bluetooth API
2. Asegurar contexto seguro (HTTPS)
3. Verificar permisos del usuario
4. Reiniciar escaneo

### Problema: Predicción meteorológica no actualiza

**Solución:**
1. Verificar conexión a internet
2. Validar claves API de OpenWeatherMap/NVIDIA
3. Revisar logs de error
4. Forzar actualización manual

### Problema: Alto latency en visualización 3D

**Solución:**
1. Desactivar visualización 3D en conexiones lentas
2. Reducir número de capas de datos
3. Usar modo 2D como alternativa
4. Optimizar resolución de texturas

---

## Roadmap Futuro

### V4.1 (Q2 2026)
- Integración con NVIDIA Earth-2 en tiempo real
- Soporte para múltiples dirigibles simultáneos
- Dashboard de análisis histórico
- Exportación de datos en formato estándar

### V4.2 (Q3 2026)
- Control de autonomía basado en LLM
- Integración con sistemas de propulsión avanzados
- Predicción de eventos climáticos extremos
- Modo de simulación para entrenamiento

### V5.0 (Q4 2026)
- Rediseño de interfaz con AR/VR
- Soporte para control desde dispositivos móviles
- Integración con sistemas de comunicación satelital
- Análisis predictivo de fallos

---

## Referencias

1. [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
2. [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
3. [OpenWeatherMap API Documentation](https://openweathermap.org/api)
4. [NVIDIA Earth-2 Documentation](https://docs.nvidia.com/earth2/)
5. [React 19 Documentation](https://react.dev)
6. [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
7. [CesiumJS Documentation](https://cesium.com/learn/cesiumjs/)
8. [MDN Web Docs - Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

---

**Documento Generado:** 25 de febrero de 2026  
**Versión:** 4.0.0  
**Clasificación:** Operativo
