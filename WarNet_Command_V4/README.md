# WarNet Command Center V4

**Centro de Mando y Control Avanzado para WarNet Air-Fusion**

Versión: 4.0.0  
Fecha: 25 de febrero de 2026  
Estado: ✅ Operativo

---

## 📋 Descripción

WarNet Command Center V4 es una interfaz web profesional de mando y control para la gestión operativa del dirigible estratosférico WarNet Air-Fusion. Integra múltiples sistemas de monitoreo, predicción meteorológica avanzada y control de servicios en una plataforma unificada.

### Características Principales

✅ **7 Módulos Operativos:**
- 🗺️ **Mapa:** Integración Google Maps + NASA GIBS
- 📡 **Radar:** Detección 2D/3D de señales: [radio, geolocalizacion y OVNIs...](https://github.com/yoqer/WarNet-Radar)
- 🌤️ **Planificación:** Predicción meteorológica 15d → tiempo real
- ⚡ **Sensores:** Telemetría en tiempo real
- 🌐 **Visualización 3D:** CesiumJS (opcional)
- 🏙️ **Infraestructura:** Control de dispositivos urbanos, trafico, webcam.
- 🔓 **Hacker:** [Controles](https://github.com/yoqer/WarNet-SoftWAir) avanzados infraestructura, frecuencia, servicios, red.

✅ **APIs Operativas:**
- REST endpoints para integración externa
- Web Bluetooth API para control de dispositivos
- Predicción meteorológica con múltiples horizontes
- Historial de operaciones con auditoría completa

✅ **Seguridad:**
- Autenticación JWT
- Control de acceso basado en roles (RBAC)
- Encriptación TLS 1.3
- Auditoría completa de operaciones

---

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- pnpm o npm
- Navegador moderno (Chrome 56+, Edge 79+, Firefox 55+)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/yoqer/WarNet-Air.git
cd WarNet-Air/WarNet_Command_V4

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
pnpm run dev
```

### Acceso

```
http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
WarNet_Command_V4/
├── docs/                                    # Documentación
│   ├── WarNet_Command_V4_Technical_Documentation.md
│   ├── WarNet_Command_V4_Integration_Guide.md
│   └── API_RESEARCH_NOTES.md
├── src/                                     # Código fuente
│   ├── components/
│   │   ├── HackerModule.tsx                # Módulo Hacker
│   │   ├── WeatherPlanning.tsx             # Planificación meteorológica
│   │   └── ...
│   ├── hooks/
│   │   ├── useBluetoothDevices.ts          # Hook Bluetooth
│   │   ├── useWeatherPrediction.ts         # Hook meteorología
│   │   └── ...
│   ├── pages/
│   │   └── CommandCenter.tsx               # Página principal
│   └── ...
├── examples/                                # Ejemplos de integración
│   ├── python_client.py
│   ├── javascript_client.js
│   └── ...
├── api/                                     # Especificación de APIs
│   ├── hacker.yaml
│   ├── weather.yaml
│   └── ...
└── README.md
```

---

## 🔌 APIs Disponibles

### Módulo Hacker

```bash
# Listar dispositivos
GET /api/hacker/devices

# Iniciar escaneo
POST /api/hacker/scan

# Conectar dispositivo
POST /api/hacker/device/{id}/connect

# Enviar comando
POST /api/hacker/device/{id}/command

# Desconectar
DELETE /api/hacker/device/{id}

# Historial
GET /api/hacker/history
```

### Predicción Meteorológica

```bash
# Obtener pronóstico
GET /api/weather/forecast?lat=40.7128&lon=-74.006&period=7d

# Calcular ventana óptima
POST /api/weather/optimal-window
```

**Documentación completa:** [WarNet_Command_V4_Integration_Guide.md](docs/WarNet_Command_V4_Integration_Guide.md)

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Technical Documentation](docs/WarNet_Command_V4_Technical_Documentation.md) | Arquitectura, módulos, APIs y seguridad |
| [Integration Guide](docs/WarNet_Command_V4_Integration_Guide.md) | Clientes Python/JavaScript y ejemplos |
| [API Research Notes](docs/API_RESEARCH_NOTES.md) | Investigación de tecnologías y protocolos |

---

## 💻 Ejemplos de Uso

### Python

```python
from warnet_client import WarNetClient

client = WarNetClient(
    "http://localhost:3000/api",
    "operator",
    "password"
)

# Obtener dispositivos
devices = client.get_devices()

# Conectar y enviar comando
client.connect_device(devices[0]['id'])
result = client.send_command(devices[0]['id'], 'read_status')
client.disconnect_device(devices[0]['id'])
```

### JavaScript

```javascript
const client = new WarNetClient(
  'http://localhost:3000/api',
  'operator',
  'password'
);

const devices = await client.getDevices();
await client.connectDevice(devices[0].id);
const result = await client.sendCommand(devices[0].id, 'read_status');
```

**Más ejemplos:** [examples/](examples/)

---

## 🔐 Seguridad

### Autenticación

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

### Autorización

Roles disponibles:
- **Admin:** Acceso completo
- **Operator:** Control de vuelo y sensores
- **Monitor:** Solo lectura
- **Hacker:** Acceso a módulo Hacker

### Encriptación

- TLS 1.3 para todas las comunicaciones
- AES-256-GCM para almacenamiento
- JWT HS256 para tokens

---

## 🛠️ Desarrollo

### Stack Tecnológico

| Componente | Versión |
|-----------|---------|
| React | 19.0.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.0.0 |
| shadcn/ui | Latest |
| Wouter | Latest |

### Comandos Útiles

```bash
# Desarrollo
pnpm run dev

# Build
pnpm run build

# Lint
pnpm run lint

# Type check
pnpm run type-check

# Tests
pnpm run test
```

---

## 📊 Monitoreo y Logs

### Logs en Tiempo Real

```bash
tail -f /var/log/warnet-command/app.log
```

### Métricas

Sistema de monitoreo con Prometheus en `/metrics`

### Backup

```bash
# Backup manual
./scripts/backup.sh

# Restaurar
./scripts/restore.sh backup-2026-02-25.tar.gz
```

---

## 🐛 Troubleshooting

### Dispositivos Bluetooth no detectados

1. Verificar soporte de Web Bluetooth API en navegador
2. Asegurar contexto seguro (HTTPS)
3. Verificar permisos del usuario
4. Reiniciar escaneo

### Predicción meteorológica no actualiza

1. Verificar conexión a internet
2. Validar claves API
3. Revisar logs de error
4. Forzar actualización manual

### Alto latency en visualización 3D

1. Desactivar en conexiones lentas
2. Reducir capas de datos
3. Usar modo 2D
4. Optimizar resolución

---

## 🗺️ Roadmap

### V4.1 (Q2 2026)
- Integración NVIDIA Earth-2 en tiempo real
- Soporte para múltiples dirigibles
- Dashboard de análisis histórico

### V4.2 (Q3 2026)
- Control automático con LLM
- Integración de propulsión avanzada
- Predicción de eventos extremos

### V5.0 (Q4 2026)
- Interfaz AR/VR
- Control móvil
- Integración satelital

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Puede ejercer derecho del acceso, oposición, rectificación, cancelación o modificación:

- **Email:** support@warnet.dev
- **Issues:** https://github.com/yoqer/WarNet-Air/issues
- **Documentación:** https://warnet.dev/docs
- **Discord:** https://discord.gg/warnet

---

## 👥 Autores

**Manus AI** - Desarrollo e implementación  
**WarNet Team** - Concepto y especificaciones

---

## 🙏 Agradecimientos

- Google Maps Platform
- OpenWeatherMap
- NVIDIA Earth-2
- CesiumJS
- React y comunidad de código abierto

---

**Última actualización:** 25 de febrero de 2026  
**Versión:** 4.0.0  
**Estado:** ✅ Operativo
