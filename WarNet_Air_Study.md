# WarNet Air Study: Dirigible Solar Estratosférico (37 km)

## Autor: Manus AI
## Fecha: 5 de Enero de 2026

---

## 1. Introducción y Requisitos de Misión

El proyecto **WarNet Air** es un concepto de dirigible solar autodirigible diseñado para operar de forma permanente en la **estratosfera** (aproximadamente 37 km de altitud) [1]. Su misión principal es la **observación, geolocalización de precisión y comunicación de largo alcance**, integrándose como un nodo aéreo inteligente en la red WarNet controlada por el Gateway Central T4.

### 1.1. Requisitos Operacionales

| Requisito | Justificación Técnica |
| :--- | :--- |
| **Altitud de Operación** | 37 km (Estratósfera) |
| **Permanencia** | Flotación continua, recarga solar. |
| **Dirección** | Control de rumbo mediante hélices y control de altitud (flotabilidad). |
| **Comunicaciones** | LoRaWAN de largo alcance (primario) y Satelital (respaldo). |
| **Geolocalización** | Precisión centimétrica (GPS de doble frecuencia). |
| **Captura de Imágenes** | Programática, con compresión y transmisión selectiva. |

## 2. Arquitectura de Hardware (BOM)

La selección de componentes se basa en la necesidad de **ligereza, bajo consumo y resistencia a temperaturas extremas** (hasta -60°C) [2].

| ID | Componente | Referencia Clave | Función |
| :--- | :--- | :--- | :--- |
| **A1** | **Controlador Principal (GNC)** | **ESP32-S3-WROOM** | Cerebro del dirigible, gestión de energía y compresión de imágenes. |
| **A2** | **GPS de Alta Precisión** | **u-blox ZED-F9P** | Geoposicionamiento centimétrico para navegación precisa. |
| **A3** | **Módulo de Comunicación Primaria** | **Módulo LoRa SX1276 (868/915 MHz)** | Enlace de telemetría de largo alcance con el Gateway Central T4. |
| **A4** | **Módulo de Comunicación de Respaldo** | **Módulo Iridium SBD** | Enlace de emergencia global para comandos críticos. |
| **A5** | **Cámara** | **OV2640 (2MP)** | Captura de imágenes de la Tierra. |
| **A6** | **Sensor de Altitud/Presión** | **Bosch BMP388** | Medición precisa de la altitud para el control de flotabilidad. |
| **A7** | **Batería Principal** | **Batería de Litio-Sulfuro (Li-S)** | Alta densidad de energía para operación nocturna. |
| **A8** | **Panel Solar** | **Panel Solar Flexible Monocristalino** | Generación de energía ligera y adaptable a la forma del globo. |
| **A9** | **Propulsión** | **2x Motores Brushless de Bajo KV (ej. 1000KV)** | Control de dirección horizontal (guiñada). |
| **A10** | **Control de Flotabilidad** | **Válvula Solenoide + Mini Compresor** | Control activo de la altitud mediante la gestión del gas de flotación. |

## 3. Diseño de la Plataforma Física (Dirigible)

El diseño se basa en el concepto de un dirigible solar para gran altitud [3].

*   **Globo:** Material de polietileno de alta resistencia o Mylar, con forma alargada (dirigible) para minimizar la resistencia al viento y permitir la dirección.
*   **Propulsión:** Dos hélices de aeroplano montadas lateralmente, controladas por los motores Brushless (A9) y el ESP32-S3 (A1).
*   **Control de Altitud:** El sistema utiliza el sensor BMP388 (A6) para medir la altitud. El control se logra mediante la **gestión de la presión interna** (simulando el concepto de calentamiento/compresión) a través de la válvula solenoide y el mini compresor (A10).
*   **Energía:** El panel solar flexible (A8) se adhiere a la parte superior del dirigible para maximizar la exposición solar.

## 4. Lógica de Control y Software

El software se centra en el **Guiado, Navegación y Control (GNC)** y la **comunicación inteligente**.

### 4.1. GNC y Geolocalización

El ESP32-S3 ejecuta un *firmware* basado en el **ESP-IDF** o **Zephyr RTOS** (para bajo consumo) con la siguiente lógica:

1.  **Recepción GPS:** El ZED-F9P (A2) proporciona datos de posición y velocidad con alta precisión.
2.  **Cálculo de Rumbo:** El GNC calcula el error de rumbo entre la posición actual y el objetivo (enviado por el Gateway Central).
3.  **Actuación:** El ESP32-S3 ajusta la velocidad de los motores (A9) para corregir el rumbo.

### 4.2. Captura y Ampliación Programática de Imágenes

La captura de imágenes debe ser selectiva para ahorrar ancho de banda.

*   **Captura:** La cámara OV2640 (A5) captura imágenes en formato JPEG.
*   **Compresión:** El ESP32-S3 utiliza su acelerador de hardware para comprimir la imagen.
*   **Ampliación Programática:** El LLM de decisión del Gateway Central T4 puede enviar un comando para "ampliar" (es decir, capturar una imagen de mayor resolución o un video corto) de un área específica basada en las coordenadas GPS de la telemetría.

### 4.3. Integración con el Gateway Central T4

El Gateway Central T4 (el último prototipo con LLM de decisión) es el centro de mando.

*   **Comando de Alto Nivel:** El operador utiliza la interfaz **Play WarNet** para enviar comandos de misión (ej. "Ir a Lat/Lon X, Y", "Activar Escaneo de Imágenes").
*   **Traducción:** El LLM del Gateway Central traduce el comando a un paquete de datos LoRaWAN optimizado.
*   **Manipulación del LLM:** El Gateway puede enviar un nuevo "prompt" o una nueva "regla de decisión" al ESP32-S3 del WarNet Air para modificar su comportamiento autónomo (ej. "Priorizar la conservación de energía sobre la precisión de rumbo").

## 5. Conclusión

El proyecto **WarNet Air** es técnicamente viable utilizando componentes COTS (Commercial Off-The-Shelf) de bajo consumo y alta resistencia. El desafío principal es la **integración del control de flotabilidad** y la **comunicación de largo alcance** en la estratosfera, lo cual se aborda con el módulo Iridium de respaldo y el diseño de la antena LoRa de alta ganancia.

---
## Referencias

[1] Video de referencia para componentes de control: [https://youtu.be/Mv97UQmh_LY?si=m6wF0FLA-A7opa46](https://youtu.be/Mv97UQmh_LY?si=m6wF0FLA-A7opa46)
[2] Estudio de la Universidad de Alicante sobre la estratosfera: [https://rua.ua.es/dspace/handle/10045/113967](https://rua.ua.es/dspace/handle/10045/113967)
[3] Concepto de dirigible estratosférico: [https://actualidad.rt.com/actualidad/520217-dirigible-estratosferico-sceye-vuelo](https://actualidad.rt.com/actualidad/520217-dirigible-estratosferico-sceye-vuelo)
