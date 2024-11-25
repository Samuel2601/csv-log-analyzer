const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .on("error", (err) => {
        console.error(`Error al leer el archivo ${filePath}:`, err.message);
        reject({
          filePath,
          error: err.message,
        });
      })
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(`Archivo procesado exitosamente: ${filePath}`);
        resolve(results);
      });
  });
}

async function analyzeCsvFiles(folderPath) {
  const analysis = {};

  const folders = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const folder of folders) {
    if (folder.isDirectory()) {
      const folderName = folder.name;
      const folderFullPath = path.join(folderPath, folderName);

      analysis[folderName] = analysis[folderName] || { failedFiles: [] };

      const files = fs.readdirSync(folderFullPath);

      for (const file of files) {
        if (path.extname(file) === ".csv") {
          const filePath = path.join(folderFullPath, file);

          try {
            console.log(`Procesando archivo: ${filePath}`);
            const csvData = await readCsv(filePath);
            console.log("csvData", csvData);

            for (const record of csvData) {
              let level = record["Nivel"] || record["nivel"] || record["NIVEL"];
              let datetime =
                record["Fecha y hora"] ||
                record["fecha y hora"] ||
                record["FECHA Y HORA"];
              let origen = record["Origen"];
              let eventId = record["Id. del evento"];

              // Agrupar el resto de columnas excluyendo las que usamos para agrupar
              const otherData = Object.fromEntries(
                Object.entries(record).filter(([key]) => {
                  const lowerKey = key.toLowerCase();
                  if (lowerKey.includes("nivel")) {
                    level = record[key];
                  }
                  return (
                    !lowerKey.includes("nivel") &&
                    !lowerKey.includes("fecha") &&
                    key !== "Origen" &&
                    key !== "Id. del evento"
                  );
                })
              );

              // Validar datos clave
              if (!level || !datetime || !origen || !eventId) {
                console.warn(
                  `Registro omitido: Faltan campos requeridos en ${filePath}`
                );
                continue;
              }

              // Convertir fecha y hora
              const [datePart, timePart] = datetime.split(" ");

              // Crear estructura de agrupación anidada
              analysis[folderName][level] = analysis[folderName][level] || {};
              analysis[folderName][level][origen] =
                analysis[folderName][level][origen] || {};

              // Crear estructura para el ID del evento si no existe
              if (!analysis[folderName][level][origen][eventId]) {
                analysis[folderName][level][origen][eventId] = {
                  count: 0,
                  occurrences: [],
                  details: otherData, // Guardamos los detalles una sola vez ya que son los mismos para el mismo ID
                };
              }

              // Actualizar contador y agregar ocurrencia
              const eventGroup = analysis[folderName][level][origen][eventId];
              eventGroup.count++;
              eventGroup.occurrences.push({
                date: datePart,
                time: timePart,
              });
            }
          } catch (error) {
            console.error(`Error al procesar archivo: ${filePath}`, error);
            analysis[folderName].failedFiles.push({
              file: file,
              error: error.error || error.message,
            });
          }
        }
      }
    }
  }

  console.log(JSON.stringify(analysis, null, 2));
  return analysis;
}

module.exports = { analyzeCsvFiles };
