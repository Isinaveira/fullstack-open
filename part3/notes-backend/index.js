const express = require('express');
const { dbConnection } = require("./mongo");
const { Note } = require("./models/note");

const app = express();
app.use(express.json());


dbConnection();

//Mocks
let notes = [
   {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  } 
]



app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>');
})

app.get('/api/notes/:id', (request, response) => {
  const note = Note.findById(request.params.id).then(note => {
    response.json(note);
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note ({
    content: body.content,
    important: body.important || false,
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })

})


app.get('/api/notes', (request, response) =>{
    Note.find({}).then((notes) => {
      response.json(notes);
    })
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

