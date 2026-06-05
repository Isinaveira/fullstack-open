const config = require('./utils/config');
const middleware = require('./utils/middleware');
const cors = require('cors');

const express = require("express");
const app = express();

const { dbConnection } = require("./mongo");
const notesRouter = require("./controllers/notes");

dbConnection();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknowEndpoint);
app.use(middleware.errorHandler);


module.exports = {
  app,
};
