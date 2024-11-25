const express = require("express");
const { analyzeCsvFiles } = require("./utils/fileReader");

const app = express();
const PORT = 3000;

// Ruta para analizar archivos CSV en una carpeta específica
app.get("/analyze", async (req, res) => {
  const folderPath = req.query.path; // Ruta base recibida como query
  if (!folderPath) {
    return res.status(400).send("Se requiere la ruta de la carpeta (path).");
  }

  try {
    const analysisResult = await analyzeCsvFiles(folderPath);
    res.json(analysisResult);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al analizar archivos: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
