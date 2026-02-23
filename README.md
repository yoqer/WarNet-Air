# WarNet-Air: Plataforma Aérea Estratosférica Autónoma

## Descripción del Proyecto

**WarNet-Air** es un ecosistema de investigación y desarrollo enfocado en la creación de plataformas aéreas autónomas para la estratosfera (aproximadamente 37 km de altitud). El proyecto integra tecnologías de vanguardia en energía híbrida, flotación reversible, comunicaciones de largo alcance e inteligencia artificial para misiones de observación, vigilancia y comunicación de larga duración.

El sistema está diseñado para ser controlado y orquestado por el **Gateway Central T4**, actuando como una extensión aérea de la red robótica WarNet.

## Estudios Técnicos y Documentación

El repositorio contiene una serie de estudios técnicos que evolucionan desde conceptos básicos hasta una arquitectura de fusión avanzada:

1.  **[WarNet Air Study](War_Net_Air_Study.md):** Investigación inicial sobre dirigibles estratosféricos de gran escala, materiales y sistemas de control GNC.
2.  **[WarNet Air-H2 Study](War_Net_Air_H2_Study.md):** Estudio de un dirigible de hidrógeno reversible de 2 metros, introduciendo el concepto de flotación por ciclo cerrado H₂O ↔ H₂.
3.  **[WarNet Air-Fusion Study](War_Net_Air_Fusion_Study.md):** La culminación tecnológica que integra energía solar, eólica y de hidrógeno reversible en una plataforma de alta eficiencia.
4.  **[Desglose de Ingeniería Mecánica y Materiales](WarNet_Air_Fusion_Mechanical_Engineering_Breakdown.md):** Detalle exhaustivo de piezas, materiales resistentes a la estratosfera (Mylar, Fibra de Carbono), integración de motores Taurus (Indra/Edge) y sistemas de captación de agua (Aquaer).
5.  **[Algoritmo de Vuelo Autónomo](warnet_air_fusion_flight_algorithm.md):** Lógica de control para el mantenimiento de posición (loitering), orientación contra el viento y gestión de energía híbrida ejecutada en el ESP32-S3.
6.  **[Integración de Comunicaciones y Sensores](WarNet_Air_Fusion_Communication_Sensor_Integration.md):** Detalle de la instalación de la antena MIMO de alta ganancia y la red de sensores aeronáuticos (GPS RTK, IMU, Anemómetro ultrasónico).
7.  **[Plan de Implementación](WarNet_Air_Fusion_Implementation_Plan.md):** Hoja de ruta estratégica de 18 meses para el desarrollo, prototipado y despliegue operativo.

## Características Principales

*   **Energía Triple Híbrida:** Combinación de paneles solares plegables con seguimiento solar, micro-turbinas eólicas de alta altitud y pila de combustible reversible (RFC).
*   **Flotación Reversible:** Control activo de la altitud mediante la conversión electroquímica de agua en hidrógeno, eliminando la necesidad de lastre.
*   **Resiliencia Estratosférica:** Materiales seleccionados para soportar temperaturas de -60°C, baja presión y alta radiación UV.
*   **Inteligencia en el Borde:** Procesamiento de misión y toma de decisiones autónomas mediante un LLM reducido (TinyLLM) en el ESP32-S3.
*   **Comunicación Robusta:** Enlace primario LoRaWAN de largo alcance con respaldo satelital Iridium SBD y antena Wi-Fi MIMO de alta ganancia.

## Cómo Contribuir

Este es un proyecto de código abierto y experimental. Se invita a investigadores, ingenieros y entusiastas de la robótica aeroespacial a contribuir en las áreas de:
*   Optimización de algoritmos de GNC.
*   Mejora de la eficiencia de la RFC y los sistemas de captación de agua.
*   Diseño de estructuras ultraligeras y resistentes.
*   Integración de nuevos sensores y cargas útiles.

---
**Autor:** Manus AI
**Licencia:** Apache 2.0
**Repositorio:** [https://github.com/yoqer/WarNet-Air](https://github.com/yoqer/WarNet-Air)
8. [Interfaz de Control Web](warnet_air_control_center.html): Centro de mando operativo (C2) con integración de WorldView y telemetría estratosférica.
