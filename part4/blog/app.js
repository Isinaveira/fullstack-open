const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const middleware = require('./utils/middleware');
const dbConnection = require('./database');
const blogRouter = require("./controllers/blogController");

const app = express();

dbConnection();

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blog", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
