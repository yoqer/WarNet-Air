# Algoritmo de Vuelo Autónomo: WarNet Air-Fusion (GNC System)

## 1. Introducción
El sistema de Guiado, Navegación y Control (GNC) del WarNet Air-Fusion está diseñado para operar en la estratosfera, donde los vientos pueden ser fuertes pero predecibles. El algoritmo se basa en un control de bucle cerrado que integra datos de sensores aeronáuticos para mantener una posición de "loitering" (vuelo en círculo) y orientarse activamente contra ráfagas de viento para maximizar la estabilidad y la eficiencia energética.

## 2. Lógica de Control de Actitud y Posición

### 2.1. Modo de Mantenimiento de Posición (Loitering)
El dirigible debe permanecer dentro de un radio geográfico definido. Debido a que cuenta con paneles solares en ambos lados de su superficie superior, el algoritmo de giro debe considerar la incidencia solar.

*   **Entrada:** Coordenadas GPS (u-blox ZED-F9P), Orientación (BNO055), Velocidad del viento (Anemómetro de estado sólido).
*   **Acción:** El ESP32-S3 calcula el error de posición respecto al centro del círculo de loitering.
*   **Maniobra:** Ejecuta un patrón de vuelo en "ocho" o circular, ajustando el empuje diferencial de las hélices traseras para compensar la deriva.

### 2.2. Orientación contra el Viento (Wind-Facing Mode)
Ante ráfagas de viento detectadas por el sensor de viento, el sistema prioriza la estabilidad estructural y la reducción de la resistencia aerodinámica.

*   **Detección:** El sensor de viento detecta un aumento súbito en la velocidad relativa del aire.
*   **Respuesta:** El algoritmo alinea el eje longitudinal del dirigible directamente contra el viento.
*   **Estabilidad:** Si el viento es excesivo, el sistema activa el modo "Planeo Estable", utilizando las hélices solo para mantener la orientación, permitiendo que el perfil aerodinámico genere la sustentación necesaria sin desplazamiento lateral excesivo.

## 3. Gestión de Energía Híbrida y Seguimiento Solar

### 3.1. Algoritmo de Seguimiento Solar (Solar Tracking)
Los paneles solares plegables se orientan dinámicamente.

*   **Lógica:** Basada en la posición del sol calculada por el GPS (hora/fecha/latitud) y refinada por sensores de luz (LDRs).
*   **Actuación:** Micro-servos ajustan el ángulo de los paneles para mantener una incidencia de 90°.

### 3.2. Coordinación de Propulsión y Generación Eólica
Los motores traseros y el delantero tienen una función dual:

*   **Modo Propulsión:** Consumen energía de las baterías Li-S o la RFC para mover el dirigible.
*   **Modo Generación (Eólico):** Cuando el viento es favorable o el dirigible está en descenso controlado, los motores actúan como generadores (frenado regenerativo), enviando energía al BMS.
*   **Prioridad:** El algoritmo prioriza la generación eólica cuando las baterías están por debajo del 40% y hay viento suficiente (>15 km/h).

## 4. Pseudocódigo del Bucle Principal (ESP32-S3)

```cpp
void loop() {
    // 1. Lectura de Sensores
    Vector3 orientation = imu.getOrientation();
    GPSData pos = gps.getData();
    WindData wind = windSensor.getReading();
    float batteryLevel = bms.getBatteryLevel();

    // 2. Lógica de Seguridad (Viento Fuerte)
    if (wind.speed > MAX_WIND_THRESHOLD) {
        alignAgainstWind(wind.direction);
        setFlightMode(STABLE_GLIDE);
    } else {
        // 3. Navegación Estándar
        if (isOutsideLoiteringRadius(pos)) {
            returnToCenter(pos);
        } else {
            executeLoiteringPattern();
        }
    }

    // 4. Gestión de Energía
    updateSolarTracking();
    if (batteryLevel < 40.0 && wind.speed > GENERATION_THRESHOLD) {
        switchToWindGenerationMode();
    } else {
        switchToPropulsionMode();
    }

    // 5. Comunicación con Gateway T4
    sendTelemetryToGateway();
    processIncomingCommands();
    
    delay(100); // Frecuencia de 10Hz para el bucle de control
}
```

## 5. Sensores Aeronáuticos Requeridos
*   **Anemómetro de Estado Sólido:** Sin partes móviles para evitar congelamiento.
*   **Tubo Pitot Digital:** Para medir la velocidad del aire (Airspeed) con precisión.
*   **Altímetro Barométrico de Alta Resolución:** Para el control fino de la altitud en combinación con el GPS.
*   **Sensores de Flujo de Hidrógeno:** Para monitorizar la tasa de electrólisis/recombinación en la RFC.

Este algoritmo asegura que el WarNet Air-Fusion sea una plataforma autónoma, resiliente y energéticamente eficiente en la estratosfera.
