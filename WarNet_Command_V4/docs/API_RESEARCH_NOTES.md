# Investigación: APIs para Control de Servicios de Red y Dispositivos IoT

## 1. Web Bluetooth API

### Capacidades:
- **Descubrimiento de dispositivos:** `navigator.bluetooth.requestDevice()` con filtros por servicio, nombre, datos de fabricante
- **Conexión GATT:** Acceso a servidores GATT remotos
- **Lectura/Escritura:** Características y descriptores GATT
- **Notificaciones:** Escucha de cambios en características
- **Desconexión:** Control de ciclo de vida

### Limitaciones:
- Solo en contextos seguros (HTTPS)
- Requiere permiso explícito del usuario
- No disponible en Web Workers
- Soporte limitado en navegadores (Chrome 56+, Edge 79+, Opera 43+)

### Flujo de Control:
```javascript
navigator.bluetooth.requestDevice({
  filters: [{ services: ['battery_service'] }],
  acceptAllDevices: false
})
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('battery_service'))
  .then(service => service.getCharacteristic('battery_level'))
  .then(characteristic => characteristic.readValue())
  .then(value => console.log(value.getUint8(0)))
```

## 2. Web Serial API

### Capacidades:
- Acceso a puertos seriales
- Comunicación bidireccional con dispositivos
- Enumeración de puertos disponibles

### Limitaciones:
- HTTPS requerido
- Permiso del usuario necesario
- Soporte limitado (Chrome 89+)

## 3. Network Information API

### Capacidades:
- Tipo de conexión (wifi, cellular, etc.)
- Velocidad de conexión
- Información de latencia

### Limitaciones:
- No proporciona acceso directo a redes WiFi
- Solo información de estado actual

## 4. Arquitectura de API REST para Control de Servicios

Para una aplicación externa que controle servicios detectados, se requiere:

### Endpoints Propuestos:

#### 1. Descubrimiento de Dispositivos
```
GET /api/devices/scan
GET /api/devices/list
GET /api/devices/{id}
```

#### 2. Control de Dispositivos
```
POST /api/devices/{id}/connect
POST /api/devices/{id}/disconnect
POST /api/devices/{id}/command
GET /api/devices/{id}/status
```

#### 3. Servicios de Red
```
GET /api/network/wifi/scan
GET /api/network/wifi/connected
POST /api/network/wifi/connect
GET /api/network/devices
```

#### 4. Gestión de Permisos
```
GET /api/permissions/status
POST /api/permissions/request
DELETE /api/permissions/{device_id}
```

## 5. Arquitectura Backend Recomendada

### Stack:
- **Backend:** Node.js + Express (o FastAPI para Python)
- **Comunicación:** WebSocket para actualizaciones en tiempo real
- **Almacenamiento:** SQLite/PostgreSQL para historial de dispositivos
- **Seguridad:** JWT tokens, CORS, rate limiting

### Flujo:
1. Frontend detecta dispositivos con Web Bluetooth API
2. Frontend envía datos a backend vía REST/WebSocket
3. Backend mantiene registro de dispositivos y permisos
4. Aplicación externa consulta API del backend
5. Backend ejecuta comandos en dispositivos

## 6. Protocolo de Comunicación para Módulo Hacker

### Estructura de Payload:
```json
{
  "action": "scan|connect|read|write|disconnect",
  "device_id": "uuid-o-mac",
  "service_uuid": "service-uuid",
  "characteristic_uuid": "char-uuid",
  "data": "base64-encoded-data",
  "timestamp": "2026-02-25T21:00:00Z"
}
```

### Respuesta:
```json
{
  "status": "success|error|pending",
  "device_id": "uuid-o-mac",
  "data": "base64-encoded-response",
  "error": "error-message-if-applicable",
  "timestamp": "2026-02-25T21:00:00Z"
}
```

## 7. Consideraciones de Seguridad

1. **Autenticación:** JWT tokens para aplicaciones externas
2. **Autorización:** Whitelist de dispositivos permitidos
3. **Encriptación:** TLS para todas las comunicaciones
4. **Validación:** Sanitización de entrada de datos
5. **Auditoría:** Registro de todas las operaciones

## 8. Implementación en WarNet Command V4

### Módulo Hacker:
- Tab adicional con interfaz de descubrimiento
- Panel de dispositivos detectados
- Control manual de servicios
- Historial de operaciones
- Exportación de datos

### APIs Expuestas:
- `/api/hacker/devices` - Listar dispositivos
- `/api/hacker/scan` - Iniciar escaneo
- `/api/hacker/device/{id}/connect` - Conectar
- `/api/hacker/device/{id}/command` - Enviar comando
- `/api/hacker/device/{id}/disconnect` - Desconectar
- `/api/hacker/history` - Historial de operaciones

### Integración con Software Externo:
- Documentación de API completa
- Ejemplos de cliente Python/JavaScript
- SDK para integración rápida
