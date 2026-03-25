const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const PORT = 3001;
const baseUrl = `http://localhost:${PORT}/api`;
const db = require('./db.json');

app.use(express.json());
app.use(cors());
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})


app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

/* let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]; */

let endpoints = [
  {
    route: "/api/persons",
    description: "Get all persons in the agenda",
    url: `${baseUrl}/persons`,
  },
];

const generateId = () => {
    return Math.floor(Math.random() * 10000000);
}

const parseEndpoints = () => {
  endpoints
    .map((e) => `${e.route} -- ${e.description} -- ${baseUrl}${e.route}`)
    .join("\n");
};

app.get("/", (request, response) => {
  response.status(200).send("App is running, to see API go to /api");
});

app.get("/info", (request, response) => {
  response.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${new Date()}</p>
    `);
});

app.get("/api", (request, response) => {
  response.status(200).send(endpoints);
});

app.get("/api/persons", (request, response) => {
  response.json(db.persons);
  response.end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).json({
      error: `No data for id ${id}`,
    });
  }

  response.json(person);
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        });
    }

    const nameExists = db.persons.some(person => person.name.toLowerCase() === body.name.toLowerCase());

    if(nameExists){
        return response.status(400).json({
            error:"name must be unique, even with lower or upper case"
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    db.persons.push(person);
    
    response.status(201).json(person);
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  if(!id){
    return response.status(400).json({
      error: "id missing"
    });
  }

  db.persons = db.persons.filter(p => p.id !== id);
  response.status(201).json(db.persons);
})



app.listen(PORT, () => {
  console.log(`🚀 App ready in http://localhost:${PORT}`);
});
