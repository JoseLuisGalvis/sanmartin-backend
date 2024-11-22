// Carga las variables de entorno desde el archivo .env
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

// API:
// Instala:
// npm init -y
// npm install express
// npm install cors
// npm install body-parser
// npm install mysql
// Para listar Dependencias: npm list

// Importa el módulo 'express'
const express = require("express");
// Importa el paquete 'cors'
const cors = require("cors");
// Crea una instancia de la aplicación Express
const app = express();
// Habilita el middleware 'cors'
app.use(cors());
// Define el puerto en el que se ejecutará el servidor
// Puerto dinámico para Vercel
const port = process.env.PORT || 2500;
// Importa el módulo mysql
const mysql = require("mysql");

// Configuración de CORS con lista de orígenes y patrón regex
const allowedOrigins = [
  "http://localhost",
  "http://127.0.0.1",
  "http://192.168.0.113",
  "https://san-martin-web-app.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite origen si está en la lista o es localhost/127.0.0.1 en cualquier puerto
      if (
        !origin ||
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware para habilitar el parseo de JSON en las solicitudes entrantes
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.stack);
    return;
  }
  console.log("Conexión exitosa a la base de datos MySQL");
});

// Configura ruta raíz para mostrar mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Bienvenido a mi API REST con Flutter y Node.js");
});

// Healthcheck endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horarios", (req, res) => {
  const query = "SELECT * FROM horarioida;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      // Formatea los datos obtenidos en el resultado
      const formattedData = results.map((row) => ({
        num_tren: row.num_tren,
        hora_estacion: row.hora_estacion,
      }));

      console.log("Respuesta enviada:", { horarios: formattedData }); // Imprime la respuesta en la consola
      res.json({ horarios: formattedData });
    }
  });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horariosfs", (req, res) => {
  const query = "SELECT * FROM horarioidafs;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horariosdom", (req, res) => {
  const query = "SELECT * FROM horarioidadom;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horariosvuelta", (req, res) => {
  const query = "SELECT * FROM horariovuelta;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horariosvueltafs", (req, res) => {
  const query = "SELECT * FROM horariovueltafs;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para obtener los horarios de todas las estaciones
app.get("/horariosvueltadom", (req, res) => {
  const query = "SELECT * FROM horariovueltadom;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para Obtener Horarios por Estación
app.get("/horarios/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  // Reemplazar espacios en el nombre de la estación con guiones bajos para que coincida con el nombre de la columna
  const columnEstacion = estacion.replace(/ /g, "_");

  // Consulta para obtener los horarios de la estación y hora especificadas
  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horarioida
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para Obtener Horarios por Estación
app.get("/horariosfs/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  // Reemplazar espacios en el nombre de la estación con guiones bajos para que coincida con el nombre de la columna
  const columnEstacion = estacion.replace(/ /g, "_");

  // Consulta para obtener los horarios de la estación y hora especificadas
  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horarioidafs
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para Obtener Horarios por Estación
app.get("/horariosdom/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  // Reemplazar espacios en el nombre de la estación con guiones bajos para que coincida con el nombre de la columna
  const columnEstacion = estacion.replace(/ /g, "_");

  // Consulta para obtener los horarios de la estación y hora especificadas
  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horarioidadom
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para Obtener Horarios por Estación
app.get("/horariosvuelta/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  // Reemplazar espacios en el nombre de la estación con guiones bajos para que coincida con el nombre de la columna
  const columnEstacion = estacion.replace(/ /g, "_");

  // Consulta para obtener los horarios de la estación y hora especificadas
  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horariovuelta
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Ruta para Obtener Horarios por Estación
app.get("/horariosvueltafs/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  // Reemplazar espacios en el nombre de la estación con guiones bajos para que coincida con el nombre de la columna
  const columnEstacion = estacion.replace(/ /g, "_");

  // Consulta para obtener los horarios de la estación y hora especificadas
  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horariovueltafs
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

app.get("/horariosvueltadom/:estacion/:hora", (req, res) => {
  const { estacion, hora } = req.params;

  const columnEstacion = estacion.replace(/ /g, "_");

  const query = `
      SELECT num_tren, ${columnEstacion} AS hora_estacion
      FROM horariovueltadom
      WHERE STR_TO_DATE(${columnEstacion}, '%H:%i') > ?
      ORDER BY STR_TO_DATE(${columnEstacion}, '%H:%i') ASC LIMIT 3;
`;

  connection.query(query, [hora], (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios: " + err.stack);
      res.status(500).json({ mensaje: "Error al obtener los horarios" });
    } else {
      console.log("Respuesta enviada:", { horarios: results }); // Imprime la respuesta en la consola
      res.json({ horarios: results });
    }
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
  });
});

// Escuchar el servidor
app.listen(port, () => {
  console.log(
    `Servidor ejecutándose en el puerto ${port} en modo ${process.env.NODE_ENV}`
  );
});
