# WarNet Air: Estudios de Arquitectura de Dirigibles Estratosféricos

Este repositorio contiene los estudios de arquitectura para dos conceptos de dirigibles solares de alta altitud, diseñados para integrarse como nodos de observación y comunicación en la red WarNet, controlados por el Gateway Central T4.

## 1. WarNet Air Study (Globo Sonda Estratosférico)

Este estudio se centra en un dirigible de gran escala (37 km de altitud) con enfoque en la permanencia y la comunicación de largo alcance.

| Característica | Detalle |
| :--- | :--- |
| **Escala** | Gran Altitud (37 km - Estratosfera) |
| **Energía** | Panel Solar Flexible + Baterías de Litio-Sulfuro (Li-S) |
| **Flotación** | Helio/Hidrógeno (Control de altitud por compresión/válvula) |
| **Comunicaciones** | LoRaWAN (Primario) + Iridium SBD (Respaldo Satelital) |
| **Control** | ESP32-S3 (GNC) |

**Documento de Referencia:** `WarNet_Air_Study.md`

## 2. WarNet Air-H2 Study (Dirigible de Hidrógeno Reversible)

Este estudio se centra en un dirigible de escala reducida (máximo 2 metros) con un sistema de energía y flotación innovador de ciclo cerrado.

| Característica | Detalle |
| :--- | :--- |
| **Escala** | Miniatura (Máx. 2 metros) |
| **Energía** | Pila de Combustible Reversible (RFC) + Solar con Seguimiento |
| **Flotación** | Hidrógeno (H₂) generado por electrólisis (Control de altitud activo H₂O ↔ H₂) |
| **Comunicaciones** | LoRaWAN |
| **Control** | ESP32-S3 (Gestión de Energía y RFC) |

**Documento de Referencia:** `WarNet_Air_H2_Study.md`

## 3. Próximo Estudio: WarNet Air-Fusion (Integración y Optimización)

El siguiente paso en el desarrollo de la plataforma WarNet Air es un estudio de fusión que aborde las limitaciones de ambos conceptos y optimice la integración con el Gateway Central T4.

### 3.1. Objetivo del Estudio

Diseñar un sistema de control de altitud y energía que combine la **seguridad del ciclo cerrado H₂O ↔ H₂** (de Air-H2) con la **capacidad de carga y altitud** (de Air).

### 3.2. Puntos Clave a Investigar

1.  **Optimización de la RFC para la Estratosfera:** ¿Es viable escalar la Pila de Combustible Reversible para manejar el volumen de gas necesario a 37 km?
2.  **Control de Flotabilidad Híbrido:** Diseño de un sistema que utilice la RFC para el control fino de altitud y un sistema de calentamiento/compresión para el control grueso.
3.  **Sistema de Visión de Largo Alcance:** Integración de una cámara con zoom óptico y procesamiento de imágenes por TinyML en el ESP32-S3 para la detección de objetivos a gran distancia.
4.  **Protocolo de Comunicación Unificado:** Definición del protocolo de telemetría y comando LoRaWAN para que el Gateway Central T4 pueda gestionar ambos tipos de dirigibles (Air y Air-H2) de forma transparente.

Este estudio de fusión sentará las bases para el prototipo final de la plataforma aérea WarNet.
