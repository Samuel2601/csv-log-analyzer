# CSV Log Analysis Service

## Descripción General

Este servicio de análisis de logs permite procesar archivos CSV de registros de eventos, proporcionando una estructura organizada y detallada de la información extraída. Está diseñado específicamente para analizar logs de sistemas, agrupando eventos por diferentes niveles de severidad, orígenes y IDs de eventos.

## Características Principales

- 🔍 Análisis detallado de archivos CSV de logs
- 📊 Agrupación jerárquica de eventos
- 🗂️ Soporte para múltiples directorios y archivos
- 🚀 Servicio web basado en Express.js

## Estructura de Agrupación

Los eventos se agrupan en la siguiente jerarquía:

1. Usuario/Directorio
2. Nivel de Evento (Advertencia, Error, Información)
3. Origen del Evento
4. ID del Evento

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (administrador de paquetes de Node)

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/Samuel2601/csv-log-analyzer.git
cd csv-log-analyzer
```

2. Instalar dependencias

```bash
npm install
```

## Uso del Servicio

### Iniciar el Servidor

```bash
node index.js
```

El servidor estará disponible en `http://localhost:3000`

### Endpoint de Análisis

- **URL:** `/analyze`
- **Método:** GET
- **Parámetro:** `path` (ruta absoluta del directorio a analizar)

### Ejemplo de Consulta

```
http://localhost:3000/analyze?path=/ruta/absoluta/a/directorio/logs
http://localhost:3000/analyze?path=./data
```

## Ejemplo de Respuesta JSON

```json
{
  "USER1": {
    "Crítico": {
      "Microsoft-Windows-Kernel-Power": {
        "41": {
          "count": 19,
          "occurrences": [
            {
              "date": "25/11/2024",
              "time": "13:05:37"
            },
            {
              "date": "25/11/2024",
              "time": "9:28:42"
            }
          ],
          "details": {
            "Categoría de la tarea": "(63)",
            "_5": "Se reinició el sistema sin apagarlo limpiamente primero. Este error puede producirse si el sistema dejó de responder, se bloqueó o se interrumpió el suministro eléctrico de forma inesperada."
          }
        }
      }
    }
  }
}
```

## Archivos del Proyecto

- `index.js`: Servidor Express principal
- `utils/fileReader.js`: Lógica de procesamiento de archivos CSV
- `README.md`: Documentación del proyecto

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Confirma tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Sube tu rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Consulte `LICENSE` para más información.

## Contacto

[Samuel Arévalo](https://github.com/samuel-arevalo) - [saamare99@gmail.com](mailto:saamare99@gmail.com)

Enlace del Proyecto: https://github.com/Samuel2601/csv-log-analyzer
