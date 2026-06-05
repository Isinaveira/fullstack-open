const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;
const baseUrl = `http://localhost:${PORT}/api`;

const { dbConnection } = require("./mongo");
const { Person } = require("./models/person");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// Configuración de Morgan
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// Inicializar Conexión a MongoDB
dbConnection();

let endpoints = [
  {
    route: "/api/persons",
    description: "Get all persons in the agenda",
    url: `/api/persons`,
  },
];

app.get("/", (request, response) => {
  response.status(200).send("App is running, to see API go to /api");
});

app.get("/api", (request, response) => {
  response.status(200).send(endpoints);
});

app.get("/info", async (request, response) => {
  try {
    const count = await Person.countDocuments({});
    response.send(`
        <p>Phonebook has info for ${count} people </p>
        <p>${new Date()}</p>
    `);
  } catch (error) {
    console.error("Error al generar la info: ", error);
    response
      .status(500)
      .send("<p>Error al obtener la información de la base de datos</p>");
  }
});

app.get("/api/persons", async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    response
      .status(500)
      .json({ error: "Error al obtener los datos de las personas" });
  }
});

app.get("/api/persons/:id", async (request, response) => {
  // CORREGIDO: Añadido async
  try {
    const person = await Person.findById(request.params.id);

    if (!person) {
      return response.status(404).json({
        error: `No data for id ${request.params.id}`,
      });
    }

    response.json(person);
  } catch (error) {
    console.error("Error al buscar la persona por ID:", error);

    response.status(400).json({ error: "Malformatted id" });
  }
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  try {
    const nameExists = await Person.findOne({
      name: { $regex: new RegExp(`^${body.name}$`, "i") },
    });

    if (nameExists) {
      return response.status(400).json({
        error: "name must be unique, even with lower or upper case",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.status(201).json(savedPerson);
  } catch (error) {
    console.error("Error al guardar la persona:", error);
    response
      .status(500)
      .json({ error: "Error al guardar en la base de datos" });
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error("Error al eliminar la persona:", error);
    response.status(400).json({ error: "Malformatted id" });
  }
});

app.put("/api/persons/:id", async (request, response) => {
  const { name, number } = request.body;

  // Validación básica de que nos llega el nuevo número
  if (!number) {
    return response.status(400).json({
      error: "number missing"
    });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id, 
      { name, number }, // Campos que queremos actualizar
      { new: true, runValidators: true, context: 'query' } 
    );

    if (!updatedPerson) {
      return response.status(404).json({
        error: "Contacto no encontrado en la base de datos"
      });
    }

    response.json(updatedPerson);
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    response.status(400).json({ error: "Malformatted id o error de validación" });
  }
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 App ready in http://localhost:${PORT}`);
});
