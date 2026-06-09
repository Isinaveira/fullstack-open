const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MONGODB_URI } = require("./utils/config");

const dbConnection = async () => {
    if(!MONGODB_URI) {
        throw new Error("La variable de entorno MONGODB_URI no está definida.")
    }

    await mongoose
        .connect(MONGODB_URI)
        .then((result) => {
            console.log("🚀 Conexión exitosa a la base de datos");
        })
        .catch((error) => {
          console.error("❌ Error al conectar a la base de datos: ", error.message);
          process.exit(1);  
        });
};

mongoose.set("strictQuery", false);

module.exports = dbConnection;