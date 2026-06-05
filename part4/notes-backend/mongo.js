// config/database.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Cargamos las variables de entorno
dotenv.config();

const dbConnection = async () => {
  const dbURI = process.env.MONGODB_URI

  if (!dbURI) {
    throw new Error(
      "La variable de entorno MONGODB_URI no está definida.",
    );
  }

  await mongoose
    .connect(dbURI)
    .then((result) => {
      console.log("🚀 Conexión exitosa a la base de datos");
    })
    .catch((error) => {
      console.error("❌ Error al conectar a la base de datos:", error.message);
      process.exit(1);
    });
};

mongoose.set("strictQuery", false);

module.exports = {
  dbConnection
};
