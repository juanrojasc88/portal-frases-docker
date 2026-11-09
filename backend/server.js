
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || "/app/data";
const DATA_FILE = path.join(DATA_DIR, "frases.json");

// Crear directorio de almacenamiento
fs.mkdirSync(DATA_DIR, { recursive: true });

// Inicializar archivo de datos
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Verificar estado del servicio
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    servicio: "backend",
    mensaje: "API funcionando correctamente"
  });
});

// Consultar todas las frases
app.get("/api/frases", (req, res) => {
  try {
    const frases = JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

    res.json(frases);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron consultar las frases"
    });
  }
});

// Guardar una nueva frase
app.post("/api/frases", (req, res) => {
  const { texto, autor } = req.body || {};

  if (typeof texto !== "string" || !texto.trim()) {
    return res.status(400).json({
      error: "El texto de la frase es obligatorio"
    });
  }

  try {
    const frases = JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

    const nuevaFrase = {
      id: Date.now().toString(),
      texto: texto.trim(),
      autor: typeof autor === "string" && autor.trim()
        ? autor.trim()
        : "Anónimo"
    };

    frases.push(nuevaFrase);

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(frases, null, 2)
    );

    res.status(201).json({
      mensaje: "Frase guardada correctamente",
      frase: nuevaFrase
    });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo guardar la frase"
    });
  }
});

// Iniciar servidor HTTP
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend iniciado en puerto ${PORT}`);
});
