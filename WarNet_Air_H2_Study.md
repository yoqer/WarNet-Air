# WarNet Air-H2 Study: Dirigible Solar de 2 Metros con Pila de Hidrógeno Reversible

## Autor: Manus AI
## Fecha: 5 de Enero de 2026

---

## 1. Introducción y Concepto de Flotación Reversible

El proyecto **WarNet Air-H2** propone un dirigible de escala reducida (máximo 2 metros) que utiliza un sistema de energía y flotación de ciclo cerrado basado en la **Pila de Combustible Reversible (RFC)**. Este diseño innovador combina la ligereza del hidrógeno como gas de elevación con la seguridad y el control de la tecnología de energía moderna.

### 1.1. Principio de Flotación Reversible

El control de altitud se logra mediante la manipulación de la densidad del gas de flotación (H2) a través de la electrólisis y la recombinación del agua [1].

*   **Ascenso (Electrólisis):** La energía solar se utiliza para descomponer el agua (H₂O) en hidrógeno (H₂) y oxígeno (O₂). El H₂ se bombea al globo, aumentando la flotabilidad.
    $$2H_2O + Energía \rightarrow 2H_2 + O_2$$
*   **Descenso (Pila de Combustible):** El H₂ se extrae del globo y se combina con el O₂ para generar electricidad y agua. La reducción del volumen de H₂ disminuye la flotabilidad.
    $$2H_2 + O_2 \rightarrow 2H_2O + Electricidad$$

## 2. Arquitectura de Hardware (BOM)

La selección de componentes se centra en la miniaturización y la eficiencia energética.

| ID | Componente | Referencia Clave | Función |
| :--- | :--- | :--- | :--- |
| **A1** | **Microcontrolador Principal** | **ESP32-S3-WROOM** | Gestión de GNC, control de la RFC, seguimiento solar. |
| **A2** | **Pila de Combustible Reversible (RFC)** | **Kit de Pila de Combustible PEM Reversible Miniatura** | Corazón del sistema de energía y flotación. |
| **A3** | **Panel Solar Plegable** | **Panel Solar Flexible Monocristalino (2 unidades)** | Generación de energía. Montado en un sistema de seguimiento solar. |
| **A4** | **Mecanismo de Seguimiento Solar** | **Micro-Servos de Bajo Torque** | Orientación de los paneles hacia el este al amanecer para maximizar la recarga [2]. |
| **A5** | **Batería de Litio** | **Li-Po de Alta Densidad (ej. 1000mAh)** | Almacenamiento de energía para la electrólisis y operación nocturna. |
| **A6** | **Sensor de Presión/Altitud** | **BMP388** | Medición precisa de la altitud y la presión interna del globo. |
| **A7** | **Material del Globo** | **Mylar de Alta Retención** | Barrera de baja permeabilidad para el hidrógeno. |
| **A8** | **Propulsión** | **2x Micro-Hélices Brushless** | Control de dirección horizontal. |
| **A9** | **Comunicación** | **Módulo LoRa SX1276** | Enlace de telemetría con el Gateway Central T4. |

## 3. Diseño Físico y Control de Flotación

### 3.1. Diseño Mínimo (2 Metros)

El dirigible tendrá una longitud máxima de 2 metros y un diámetro proporcionalmente pequeño. El material de **Mylar de Alta Retención** es crucial para minimizar la fuga de hidrógeno, un problema conocido en los aerostatos históricos [3].

### 3.2. Flotación Histórica vs. Moderna

| Técnica | Aerostatos Históricos (H2) | WarNet Air-H2 (RFC) |
| :--- | :--- | :--- |
| **Control de Altitud** | Liberación de gas (pérdida de H2) o liberación de lastre (pérdida de peso). | **Flotación Reversible:** Conversión de H2 a H2O (descenso) y H2O a H2 (ascenso). |
| **Seguridad** | Alto riesgo de incendio/explosión (ej. Hindenburg). | Sistema cerrado, el O₂ generado se consume en la pila de combustible, minimizando el riesgo. |
| **Permanencia** | Limitada por la cantidad de gas y lastre. | Potencialmente ilimitada (si el ciclo H2O es eficiente). |

### 3.3. Seguimiento Solar

El ESP32-S3 controlará los micro-servos (A4) para orientar los paneles solares (A3) hacia el este al amanecer, maximizando la captación de energía para la electrólisis.

## 4. Integración con el Gateway Central T4

El Gateway Central T4 mantiene el control de la misión y la gestión de energía.

*   **Comando de Energía:** El Gateway puede enviar comandos para **"Priorizar Flotación"** (activar electrólisis) o **"Priorizar Energía"** (activar la pila de combustible para cargar la batería de litio).
*   **Telemetría:** El WarNet Air-H2 envía datos sobre el nivel de agua, la presión de H₂, la carga de la batería y la posición GPS al Gateway Central a través de LoRaWAN.

## 5. Conclusión

El **WarNet Air-H2** es un concepto de dirigible de alta eficiencia y control preciso. La clave de su viabilidad reside en la miniaturización de la **Pila de Combustible Reversible** y la optimización del sistema de gestión de energía para el seguimiento solar y la electrólisis. Este diseño ofrece una solución elegante al problema del control de altitud en aerostatos pequeños.

---
## Referencias

[1] Pila de combustible reversible para drones: [https://www.amazon.com/-/es/combustible-electrolizador-demostrador-experimentos-electricidad/dp/B0CNVCVNVK](https://www.amazon.com/-/es/combustible-electrolizador-demostrador-experimentos-electricidad/dp/B0CNVCVNVK)
[2] Orientación de paneles solares: [https://www.gtsolarenergy.com/es/blog/how-to-choose-the-best-flexible-folding-solar-panels-for-travel-and-camping2](https://www.gtsolarenergy.com/es/blog/how-to-choose-the-best-flexible-folding-solar-panels-for-travel-and-camping2)
[3] Materiales de globo de hidrógeno: [https://www.rc-zeppelin.com/es/Dirigibles%20dirigibles,%20zepelines,%20aerostatos%20de%20helio%20o%20hidrogeno.html](https://www.rc-zeppelin.com/es/Dirigibles%20dirigibles,%20zepelines,%20aerostatos%20de%20helio%20o%20hidrogeno.html)
