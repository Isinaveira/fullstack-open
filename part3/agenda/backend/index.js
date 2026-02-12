const express = require('express');
const app = express();
const PORT = 3001;
const baseUrl= `http://localhost:${PORT}/api`;

app.use(express.json());


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

let endpoints = [
    {
        route: "/api/persons",
        description: "Get all persons in the agenda",
        url: `${baseUrl}/persons`
    },
]

const parseEndpoints = () => {
    endpoints.map(e => `${e.route} -- ${e.description} -- ${baseUrl}${e.route}`).join('\n');
}


app.get("/", (request, response) => {
    response.status(200).send("App is running, to see API go to /api");
});

app.get("/api", (request, response) => {
    response.status(200).send(endpoints);
})

app.get("/api/persons", (request, response) => {
    response.json(persons);
    response.end();
})


app.listen(PORT, () => {
    console.log(`🚀 App ready in http://localhost:${PORT}`);
})