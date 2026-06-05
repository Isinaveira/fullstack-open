const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;


const { dbConnection } = require("./mongo");
const { Person } = require("./models/person");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// Configuración de Morgan
morgan.token("body", (req) => JSON.stringify(req.body));
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

app.get("/info", async (request, response, next) => {
  try {
    const count = await Person.countDocuments({});
    response.send(`
        <p>Phonebook has info for ${count} people </p>
        <p>${new Date()}</p>
    `);
  } catch (error) {
    next(error)
  }
});

app.get("/api/persons", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    next(error)
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
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
    next(error)
  }
});

app.post("/api/persons", async (request, response, next) => {
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
    next(error)
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error)
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
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
    next(error);
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message});
  }

  next(error);
};

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 App ready in http://localhost:${PORT}`);
});
